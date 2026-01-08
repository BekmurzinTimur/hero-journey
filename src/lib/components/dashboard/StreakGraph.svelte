<script lang="ts">
	import type { Habit, HabitCompletion } from '$lib/db/database';
	import { differenceInCalendarDays, endOfToday, format, startOfDay, subDays } from 'date-fns';

	interface Props {
		habits: Habit[];
		history: HabitCompletion[];
	}

	let { habits, history } = $props<Props>();

	// Generate last 30 days
	const today = endOfToday();
	const days = Array.from({ length: 30 }, (_, i) => {
		const date = subDays(today, 29 - i);
		return {
			date,
			label: format(date, 'd'),
			fullDate: format(date, 'yyyy-MM-dd')
		};
	});

	function getIntensity(habitId: string, date: Date) {
		// Count completions for this habit on this date
		const count = history.filter(
			(c) => c.habitId === habitId && differenceInCalendarDays(new Date(c.completedAt), date) === 0
		).length;

		if (count === 0) return 'bg-neutral-800';
		if (count === 1) return 'bg-emerald-500/50'; // Light green
		if (count >= 2) return 'bg-emerald-500'; // Dark green (or full opacity)
		return 'bg-neutral-800';
	}
</script>

<div class="-mx-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
	<div class="min-w-[500px]">
		<!-- Table Header (Days) -->
		<div class="mb-2 flex">
			<div class="w-32 shrink-0"></div>
			<!-- Spacer for names -->
			<div class="flex flex-1 justify-between gap-0.5">
				{#each days as day}
					<div class="flex-1 text-center font-mono text-[9px] text-neutral-600">
						{day.label}
					</div>
				{/each}
			</div>
		</div>

		<!-- Rows -->
		<div class="space-y-1">
			{#each habits as habit}
				<div class="flex items-center">
					<div class="w-32 shrink-0 truncate pr-2 text-xs font-medium text-neutral-400">
						{habit.name}
					</div>
					<div class="flex h-4 flex-1 flex-wrap justify-between gap-0.5">
						{#each days as day}
							<div
								class="flex-1 rounded-[1px] transition-colors duration-300 {getIntensity(
									habit.id,
									day.date
								)}"
								title="{format(day.date, 'MMM d')}: {habit.name}"
							></div>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
