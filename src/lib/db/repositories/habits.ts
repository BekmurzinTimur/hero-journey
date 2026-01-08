import { toPlainObject } from '$lib/utils/objects';
import { db, type Habit } from '../database';
import { v4 as uuidv4 } from 'uuid';

export const habitsRepository = {
	async getAll(): Promise<Habit[]> {
		return await db.habits.toArray();
	},

	async getById(id: string): Promise<Habit | undefined> {
		return await db.habits.get(id);
	},

	async create(habit: Omit<Habit, 'id' | 'createdAt' | 'isActive'>): Promise<string> {
		console.log(habit);
		const id = uuidv4();
		await db.habits.add({
			...toPlainObject(habit),
			id,
			createdAt: new Date(),
			isActive: true
		});
		return id;
	},

	async update(id: string, updates: Partial<Habit>): Promise<void> {
		await db.habits.update(id, updates);
	},

	async toggleActive(id: string, isActive: boolean): Promise<void> {
		await db.habits.update(id, { isActive });
	},

	async delete(id: string): Promise<void> {
		await db.habits.delete(id);
	}
};
