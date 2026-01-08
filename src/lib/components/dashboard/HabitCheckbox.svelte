<script lang="ts">
    import { Check } from 'lucide-svelte';
    import { scale } from 'svelte/transition';
    import type { Habit } from '$lib/db/database';
    
    interface Props {
        habit: Habit;
        isCompleted: boolean;
        streak: number;
        oncomplete: (id: string) => void;
    }

    let { habit, isCompleted, streak, oncomplete } = $props<Props>();

    const effortColors = {
        low: 'bg-emerald-500',
        medium: 'bg-blue-500',
        high: 'bg-indigo-500'
    };
</script>

<button
    disabled={isCompleted}
    onclick={() => oncomplete(habit.id)}
    class="w-full bg-neutral-900 border border-neutral-800 p-4 rounded-xl flex items-center gap-4 group transition-all duration-200 text-left
    {isCompleted ? 'opacity-50' : 'hover:border-neutral-700 hover:bg-neutral-800/50 hover:translate-x-1 active:translate-y-0.5'}"
>
    <!-- Checkbox State -->
    <div 
        class="w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all duration-300 relative
        {isCompleted 
            ? 'bg-indigo-500 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.4)]' 
            : 'border-neutral-600 group-hover:border-indigo-400'}"
    >
        {#if isCompleted}
            <div in:scale={{duration: 250, start: 0.5}}>
                <Check size={18} strokeWidth={4} class="text-white" />
            </div>
        {/if}
    </div>

    <!-- Info -->
    <div class="flex-1">
        <h3 class="font-medium text-white transition-colors group-hover:text-indigo-200">
            {habit.name}
        </h3>
        <div class="flex items-center gap-2 mt-1">
            <span class="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400">
                {habit.effort}
            </span>
            {#if streak > 0}
            <span class="text-[10px] font-medium text-orange-400 flex items-center gap-1">
                🔥 {streak}
            </span>
            {/if}
        </div>
    </div>
</button>
