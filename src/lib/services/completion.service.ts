import { habitsRepository } from '$lib/db/repositories/habits';
import { skillsRepository } from '$lib/db/repositories/skills';
import { completionsRepository } from '$lib/db/repositories/completions';
import { streakService } from './streak.service';
import { xpService } from './xp.service';
import { type HabitCompletion } from '$lib/db/database';

export interface CompletionResult {
	habitName: string;
	skillUpdates: Array<{
		skillName: string;
		xpGained: number;
		newLevel: number;
		levelUp: boolean;
	}>;
	streak: number;
	bonusMultiplier: number;
}

export const completionService = {
	async completeHabit(habitId: string): Promise<CompletionResult | null> {
		// 1. Get Habit
		const habit = await habitsRepository.getById(habitId);
		if (!habit) return null;

		// 2. Update Streak
		const { newStreak, record } = await streakService.incrementStreak(habitId);

		// 3. Calculate Bonus
		// multiplier = 1 + (streak * 0.10)
		// Note: streakService.incrementStreak returns the NEW streak.
		// If it was 0 and now 1 (first day), bonus is 1.1x?
		// Or does bonus start applying after day 1?
		// "bonusMultiplier = 1 + (currentStreak * 0.10)"
		// If streak is 1, mult is 1.1. Seems fair.
		const bonusMultiplier = 1 + newStreak * 0.1;

		// 4. Calculate and Award XP to Skills
		const skillUpdates = [];
		const xpAwarded: Record<string, number> = {};

		for (const skillId of habit.skillIds) {
			const skill = await skillsRepository.getById(skillId);
			if (skill) {
				const xpAmount = xpService.calculateXPGain(habit.effort, newStreak);

				const oldLevel = skill.level;
				await skillsRepository.addXP(skillId, xpAmount);

				// Fetch updated skill to check level
				const updatedSkill = await skillsRepository.getById(skillId);
				const newLevel = updatedSkill?.level || oldLevel;

				skillUpdates.push({
					skillName: skill.name,
					xpGained: xpAmount,
					newLevel,
					levelUp: newLevel > oldLevel
				});

				xpAwarded[skillId] = xpAmount;
			}
		}

		// 5. Record Completion
		await completionsRepository.create({
			habitId,
			completedAt: new Date(),
			xpAwarded,
			streakAtCompletion: newStreak,
			bonusMultiplier
		});

		return {
			habitName: habit.name,
			skillUpdates,
			streak: newStreak,
			bonusMultiplier
		};
	}
};
