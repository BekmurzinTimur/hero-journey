<script lang="ts">
    import { goto } from '$app/navigation';
    import { habitsRepository } from '$lib/db/repositories/habits';
    import { skillsRepository } from '$lib/db/repositories/skills';
    import { userRepository } from '$lib/db/repositories/user';
    import type { Skill } from '$lib/db/database';
    import HabitSkillLinker from '$lib/components/onboarding/HabitSkillLinker.svelte';
    import EffortSelector from '$lib/components/onboarding/EffortSelector.svelte';
    import { onMount } from 'svelte';
    import { fade, slide } from 'svelte/transition';
    import { Plus, Trash2 } from 'lucide-svelte';

    let skills = $state<Skill[]>([]);
    let habits = $state<Array<{tempId: number, name: string, effort: 'low' | 'medium' | 'high', skillIds: string[]}>>([]);
    let loading = $state(true);

    // Form inputs
    let habitName = $state('');
    let habitEffort = $state<'low' | 'medium' | 'high'>('medium');
    let habitSkillIds = $state<string[]>([]);

    onMount(async () => {
        skills = await skillsRepository.getAll();
        loading = false;
        
        // Pre-fill templates if empty
        if (habits.length === 0) {
            // Could add default templates here
        }
    });

    function addHabit() {
        if (!habitName.trim() || habitSkillIds.length === 0) return;
        
        habits = [...habits, {
            tempId: Date.now(),
            name: habitName.trim(),
            effort: habitEffort,
            skillIds: [...habitSkillIds]
        }];
        
        // Reset form
        habitName = '';
        habitEffort = 'medium';
        habitSkillIds = [];
    }

    function removeHabit(tempId: number) {
        habits = habits.filter(h => h.tempId !== tempId);
    }
    
    function getSkillNames(ids: string[]) {
        return ids.map(id => skills.find(s => s.id === id)?.name).filter(Boolean).join(', ');
    }

    async function handleCompleteFormatted() {
        if (habits.length === 0) return;

        // Save habits
        for (const habit of habits) {
            await habitsRepository.create({
                name: habit.name,
                effort: habit.effort,
                skillIds: habit.skillIds
            });
        }
        
        // Mark onboarding as complete
        await userRepository.completeOnboarding();
        
        goto('/');
    }
</script>

{#if !loading}
<div in:fade={{ duration: 400 }} class="flex flex-col h-full">
    <div class="flex-1 max-w-sm mx-auto w-full pb-20">
        <h1 class="text-3xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
            Design Your Habits
        </h1>
        <p class="text-neutral-400 mb-8 leading-relaxed">
            Create daily actions that will help you level up your chosen skills.
        </p>

        <!-- New Habit Form -->
        <div class="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4 mb-8">
            <div class="mb-4">
                <label class="block text-xs font-medium text-neutral-500 mb-2 uppercase tracking-wider">Habit Name</label>
                <input
                    type="text"
                    bind:value={habitName}
                    class="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder:text-neutral-700"
                    placeholder="e.g. Morning Workout"
                />
            </div>
            
            <div class="mb-4">
                 <label class="block text-xs font-medium text-neutral-500 mb-2 uppercase tracking-wider">Effort Level</label>
                 <EffortSelector effort={habitEffort} onchange={e => habitEffort = e} />
            </div>

            <div class="mb-6">
                <HabitSkillLinker 
                    skills={skills} 
                    selectedSkillIds={habitSkillIds} 
                    onchange={ids => habitSkillIds = ids} 
                />
            </div>

            <button
                onclick={addHabit}
                disabled={!habitName.trim() || habitSkillIds.length === 0}
                class="w-full bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
                <Plus size={18} />
                Add Habit
            </button>
        </div>
        
        <!-- Habits List -->
        {#if habits.length > 0}
            <div class="space-y-3">
                <div class="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2">Your Habits ({habits.length})</div>
                {#each habits as habit (habit.tempId)}
                    <div transition:slide|local class="bg-neutral-900 border border-neutral-800 rounded-lg p-3 flex items-start gap-3">
                        <div class="flex-1">
                            <div class="font-medium text-white">{habit.name}</div>
                            <div class="text-xs text-neutral-500 mt-1">
                                {habit.effort} effort • {getSkillNames(habit.skillIds)}
                            </div>
                        </div>
                        <button 
                            onclick={() => removeHabit(habit.tempId)}
                            class="text-neutral-600 hover:text-red-400 p-1"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                {/each}
            </div>
        {/if}
    </div>

    <div class="mt-auto py-6 sticky bottom-0 bg-gradient-to-t from-neutral-950 to-transparent pt-8">
        <button
            onclick={handleCompleteFormatted}
            disabled={habits.length === 0}
            class="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3.5 rounded-xl shadow-[0_4px_12px_rgba(79,70,229,0.3)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.4)] transition-all duration-200"
        >
            Start Your Journey
        </button>
    </div>
</div>
{/if}
