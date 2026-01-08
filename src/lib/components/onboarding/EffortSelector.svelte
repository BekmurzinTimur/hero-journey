<script lang="ts">
    interface Props {
        effort: 'low' | 'medium' | 'high';
        onchange: (effort: 'low' | 'medium' | 'high') => void;
    }

    let { effort, onchange } = $props<Props>();

    const options = [
        { value: 'low', label: 'Low', xp: 0.1, color: 'bg-emerald-500' },
        { value: 'medium', label: 'Medium', xp: 0.2, color: 'bg-blue-500' },
        { value: 'high', label: 'High', xp: 0.3, color: 'bg-indigo-500' }
    ] as const;
</script>

<div class="flex bg-neutral-900 p-1 rounded-lg border border-neutral-800">
    {#each options as option}
        {@const selected = effort === option.value}
        <button
            class="flex-1 flex flex-col items-center py-2 rounded-md transition-all duration-200
            {selected ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-300'}"
            onclick={() => onchange(option.value)}
        >
            <span class="text-xs font-semibold uppercase tracking-wider">{option.label}</span>
            <span class="text-[10px] opacity-70">+{option.xp} XP</span>
        </button>
    {/each}
</div>
