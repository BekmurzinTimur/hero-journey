import { type Habit, type Skill, type HabitCompletion, type StreakRecord } from '$lib/db/database';
import { habitsRepository } from '$lib/db/repositories/habits';
import { skillsRepository } from '$lib/db/repositories/skills';
import { completionsRepository } from '$lib/db/repositories/completions';
import { streaksRepository } from '$lib/db/repositories/streaks';
import { streakService } from '$lib/services/streak.service';
import { completionService, type CompletionResult } from '$lib/services/completion.service';
import { startOfToday, endOfToday, isSameDay } from 'date-fns';

export class DashboardStore {
	habits = $state<Habit[]>([]);
	skills = $state<Skill[]>([]);
	todayCompletions = $state<HabitCompletion[]>([]);
	history = $state<HabitCompletion[]>([]);
	streaks = $state<Record<string, StreakRecord>>({});

	loading = $state(true);

	constructor() {
		// Init happens explicitly via load()
	}

	async load() {
		this.loading = true;

		// Parallel fetch
		const [habits, skills, completions] = await Promise.all([
			habitsRepository.getAll(),
			skillsRepository.getAll(),
			completionsRepository.getByDateRange(startOfToday(), endOfToday())
		]);

		this.habits = habits.filter((h) => h.isActive);
		this.skills = skills;
		this.todayCompletions = completions;

		// Load streaks
		for (const habit of habits) {
			// Validate first
			const streak = await streakService.validateStreak(habit.id);
			this.streaks[habit.id] = streak;
		}

		await this.loadHistory(); // Load history for graph

		this.loading = false;
	}

	async loadHistory() {
		// Load last 30 days
		const end = endOfToday();
		const start = new Date();
		start.setDate(end.getDate() - 29);
		this.history = await completionsRepository.getByDateRange(start, end);
	}

	// Derived: Habit Status
	getHabitStatus(habitId: string) {
		const isCompleted = this.todayCompletions.some((c) => c.habitId === habitId);
		const streak = this.streaks[habitId]?.currentStreak || 0;
		return { isCompleted, streak };
	}

	async completeHabit(habitId: string): Promise<CompletionResult | null> {
		const result = await completionService.completeHabit(habitId);
		if (result) {
			await this.load(); // Reload data to reflect changes
		}
		return result;
	}
}

// Singleton instance
export const dashboardStore = new DashboardStore();
