<script lang="ts">
	import { dashboardStore } from '$lib/stores/dashboard.store.svelte';
	import { onMount, onDestroy } from 'svelte';
	import { fade, slide } from 'svelte/transition';
	import SkillProgressBar from '$lib/components/dashboard/SkillProgressBar.svelte';
	import HabitCheckbox from '$lib/components/dashboard/HabitCheckbox.svelte';
	import StreakGraph from '$lib/components/dashboard/StreakGraph.svelte';
	import { streakService } from '$lib/services/streak.service';

	// Load data on mount
	onMount(async () => {
		await dashboardStore.load();
		// Also validate streaks in case they weren't validated recently
		const habitIds = dashboardStore.habits.map((h) => h.id);
		await streakService.validateAllStreaks(habitIds);
	});

	async function handleComplete(habitId: string) {
		await dashboardStore.completeHabit(habitId);
		// Show overlay logic will go here later (Phase 5)
	}

	// Reactive state from store
	let loading = $derived(dashboardStore.loading);
	let skills = $derived(dashboardStore.skills);
	let habits = $derived(dashboardStore.habits);
	let history = $derived(dashboardStore.history);
</script>

{#if loading}
	<div in:fade class="flex min-h-screen items-center justify-center">
		<div class="h-8 w-8 animate-spin rounded-full border-t-2 border-b-2 border-indigo-500"></div>
	</div>
{:else}
	<div in:fade={{ duration: 300 }} class="pb-20">
		<!-- Header -->
		<header class="p-6 pb-2">
			<h1 class="text-2xl font-bold tracking-tight text-white">Hero Journey</h1>
			<p class="mt-1 text-xs font-medium tracking-wider text-neutral-500 uppercase">Skills</p>
		</header>

		<!-- Skills Section -->
		<section class="no-scrollbar -mx-6 mb-8 snap-x overflow-x-auto px-6 pb-4">
			<div class="flex min-w-max flex-col gap-3 p-4">
				{#each skills as skill (skill.id)}
					<div class="snap-center">
						<SkillProgressBar
							{skill}
							isProgressable={habits.some(
								(h) =>
									h.skillIds.includes(skill.id) && !dashboardStore.getHabitStatus(h.id).isCompleted
							)}
						/>
					</div>
				{/each}
			</div>
		</section>

		<!-- Habits Section -->
		<section class="mb-8 px-6">
			<h2
				class="mb-4 flex items-center justify-between text-xs font-bold tracking-wider text-neutral-500 uppercase"
			>
				<span>Today's Quests</span>
				<span class="font-mono text-neutral-600">
					{dashboardStore.todayCompletions.length}/{habits.length}
				</span>
			</h2>

			<div class="space-y-3">
				{#each habits as habit (habit.id)}
					{@const status = dashboardStore.getHabitStatus(habit.id)}
					<HabitCheckbox
						{habit}
						isCompleted={status.isCompleted}
						streak={status.streak}
						oncomplete={handleComplete}
					/>
				{/each}

				{#if habits.length === 0}
					<div
						class="rounded-xl border border-dashed border-neutral-800 bg-neutral-900/50 py-10 text-center"
					>
						<p class="text-sm text-neutral-500">No habits active.</p>
						<a
							href="/onboarding/habits"
							class="mt-2 inline-block text-sm text-indigo-400 hover:underline">Add some quests</a
						>
					</div>
				{/if}
			</div>
		</section>

		<!-- Streaks Section -->
		{#if habits.length > 0}
			<section class="px-6 pb-6">
				<h2 class="mb-4 text-xs font-bold tracking-wider text-neutral-500 uppercase">Chronicles</h2>
				<div class="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
					<StreakGraph {habits} {history} />
				</div>
			</section>
		{/if}
	</div>
{/if}

<style>
	/* Hide scrollbar for Chrome, Safari and Opera */
	.no-scrollbar::-webkit-scrollbar {
		display: none;
	}
	/* Hide scrollbar for IE, Edge and Firefox */
	.no-scrollbar {
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}
</style>
