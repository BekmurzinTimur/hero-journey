<script lang="ts">
    import type { Skill } from '$lib/db/database';
    import { Check } from 'lucide-svelte';

    interface Props {
        skills: Skill[];
        selectedSkillIds: string[];
        onchange: (ids: string[]) => void;
    }

    let { skills, selectedSkillIds, onchange } = $props<Props>();

    function toggleSkill(id: string) {
        if (selectedSkillIds.includes(id)) {
            onchange(selectedSkillIds.filter(s => s !== id));
        } else {
            onchange([...selectedSkillIds, id]);
        }
    }
</script>

<div class="space-y-2">
    <label class="block text-xs font-medium text-neutral-500 uppercase tracking-wider">
        Linked Skills
    </label>
    <div class="flex flex-wrap gap-2">
        {#each skills as skill}
            {@const isSelected = selectedSkillIds.includes(skill.id)}
            <button
                class="px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 flex items-center gap-1.5
                {isSelected 
                    ? 'bg-neutral-800 border-indigo-500/50 text-white shadow-[0_0_10px_rgba(99,102,241,0.2)]'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700'}"
                style="border-color: {isSelected ? skill.color : ''}"
                onclick={() => toggleSkill(skill.id)}
            >
                {skill.name}
                {#if isSelected}
                    <Check size={12} />
                {/if}
            </button>
        {/each}
        {#if skills.length === 0}
            <span class="text-neutral-600 text-sm">No skills found. Go back to add some!</span>
        {/if}
    </div>
</div>
