import { differenceInCalendarDays, parseISO, startOfToday } from 'date-fns';
import { streaksRepository } from '$lib/db/repositories/streaks';
import type { StreakRecord } from '$lib/db/database';

export const streakService = {
	/**
	 * Checks if a streak needs to be reset based on last completion date.
	 * Returns modified streak record if reset occurred, or original if valid.
	 */
	async validateStreak(habitId: string): Promise<StreakRecord> {
		const record = await streaksRepository.getByHabitId(habitId);

		if (!record) {
			return {
				habitId,
				currentStreak: 0,
				lastCompletionDate: '',
				longestStreak: 0
			};
		}

		const today = startOfToday();
		const lastDate = parseISO(record.lastCompletionDate);
		const daysSince = differenceInCalendarDays(today, lastDate);

		// If > 1 day gap (so 2 days or more since last completion), reset.
		// E.g. Completed Monday. Today is Wednesday. Gap is 2 days. Reset.
		// Completed Monday. Today is Tuesday. Gap is 1 day. Valid.
		if (daysSince > 1) {
			const resetRecord: StreakRecord = {
				...record,
				currentStreak: 0
			};
			await streaksRepository.set(resetRecord);
			return resetRecord;
		}

		return record;
	},

	/**
	 * Updates streak after a completion today.
	 */
	async incrementStreak(habitId: string): Promise<{ newStreak: number; record: StreakRecord }> {
		const record = await this.validateStreak(habitId); // Ensure baseline is correct

		const todayStr = startOfToday().toISOString().split('T')[0];

		// If already completed today, don't increment streak count, just ensure date is set
		if (record.lastCompletionDate === todayStr) {
			return { newStreak: record.currentStreak, record };
		}

		const newStreak = record.currentStreak + 1;
		const newRecord: StreakRecord = {
			habitId,
			currentStreak: newStreak,
			lastCompletionDate: todayStr,
			longestStreak: Math.max(record.longestStreak, newStreak)
		};

		await streaksRepository.set(newRecord);
		return { newStreak, record: newRecord };
	},

	/**
	 * Runs validity check for all streaks (e.g. on app open).
	 */
	async validateAllStreaks(habitIds: string[]): Promise<void> {
		for (const id of habitIds) {
			await this.validateStreak(id);
		}
	}
};
