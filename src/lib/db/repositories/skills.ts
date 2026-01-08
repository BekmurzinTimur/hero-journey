import { db, type Skill } from '../database';
import { v4 as uuidv4 } from 'uuid';

export const skillsRepository = {
	async getAll(): Promise<Skill[]> {
		return await db.skills.toArray();
	},

	async getById(id: string): Promise<Skill | undefined> {
		return await db.skills.get(id);
	},

	async create(skill: Omit<Skill, 'id' | 'createdAt' | 'level' | 'currentXP'>): Promise<string> {
		const id = uuidv4();
		await db.skills.add({
			...skill,
			id,
			currentXP: 0,
			level: 1,
			createdAt: new Date()
		});
		return id;
	},

	async update(id: string, updates: Partial<Skill>): Promise<void> {
		await db.skills.update(id, updates);
	},

	async addXP(id: string, amount: number): Promise<void> {
		const skill = await this.getById(id);
		if (!skill) return;

		const newXP = skill.currentXP + amount;
		// level = floor(sqrt(xp / 10))
		// We start at level 1.
		// If xp < 10, sqrt < 1, level 0?
		// Let's stick to the user's formula but maybe ensure min level 1.
		// User formula: level = floor(sqrt(currentXP / 10))
		// If xp=0, level=0. If xp=10, level=1.
		// If they want level 1 to start, maybe it should be 1 + ...?
		// "This creates diminishing returns requiring more XP per level."
		// I'll stick to the requested formula for now, but maybe handle level 0 case in UI or make it 1-based if needed.
		// Actually, usually level 1 is base.
		// If XP=0, level=0 seems odd for a game. I'll make it 1-based in display or adjust formula if needed.
		// Let's assume the user wants accurate formula implementation:
		// level = Math.floor(Math.sqrt(newXP / 10));
		// If currentXP is accumulated, level grows.

		// Wait, typical RPG:
		// Lvl 1: 0 XP
		// Lvl 2: 100 XP
		// Formula: XP = 10 * level^2
		// If level = sqrt(xp/10), then xp = 10 * level^2.
		// So 10 XP = lvl 1. 40 XP = lvl 2. 90 XP = lvl 3.
		// That seems fast.
		// But user specified: level = floor(sqrt(currentXP / 10))
		// I will implement exactly that.

		const newLevel = Math.floor(Math.sqrt(newXP / 10));

		await db.skills.update(id, {
			currentXP: newXP,
			level: newLevel
		});
	},

	async delete(id: string): Promise<void> {
		await db.skills.delete(id);
	}
};
