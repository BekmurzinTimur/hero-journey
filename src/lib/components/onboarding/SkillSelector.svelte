<script lang="ts">
	import { Check, Plus, X } from 'lucide-svelte';
	import { fade, scale } from 'svelte/transition';

    interface Props {
        selectedSkillNames: string[];
        onchange: (skills: string[]) => void;
    }

	let { selectedSkillNames, onchange } = $props<Props>();

	const templates = [
		{ name: 'Strength', color: 'bg-red-500' },
		{ name: 'Focus', color: 'bg-blue-500' },
		{ name: 'Creativity', color: 'bg-purple-500' },
		{ name: 'Knowledge', color: 'bg-sky-500' },
		{ name: 'Discipline', color: 'bg-slate-500' },
		{ name: 'Social', color: 'bg-pink-500' },
		{ name: 'Craft', color: 'bg-amber-500' },
		{ name: 'Wellness', color: 'bg-emerald-500' }
	];

	let customInput = $state('');

	function toggleSkill(name: string) {
		if (selectedSkillNames.includes(name)) {
			onchange(selectedSkillNames.filter((s) => s !== name));
		} else {
			onchange([...selectedSkillNames, name]);
		}
	}

	function addCustomSkill() {
		if (customInput.trim() && !selectedSkillNames.includes(customInput.trim())) {
			onchange([...selectedSkillNames, customInput.trim()]);
			customInput = '';
		}
	}

    function handleKeydown(e: KeyboardEvent) {
        if (e.key === 'Enter') {
            addCustomSkill();
        }
    }
</script>

<div class="space-y-6">
	<!-- Templates -->
	<div class="grid grid-cols-2 gap-3">
		{#each templates as template}
			{@const isSelected = selectedSkillNames.includes(template.name)}
			<button
				class="relative p-4 rounded-xl text-left transition-all duration-200 border-2 flex items-center justify-between group
                {isSelected
					? 'bg-indigo-900/20 border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.2)]'
					: 'bg-neutral-900 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800/50'}"
				onclick={() => toggleSkill(template.name)}
			>
				<span class="font-medium text-neutral-200 group-hover:text-white transition-colors">{template.name}</span>
                {#if isSelected}
				    <div in:scale={{duration: 200}} class="text-indigo-400">
                        <Check size={18} strokeWidth={3} />
                    </div>
                {/if}
			</button>
		{/each}
	</div>

	<!-- Custom Input -->
	<div class="pt-2">
		<label class="block text-xs font-medium text-neutral-500 mb-2 uppercase tracking-wider">Add Custom Skill</label>
		<div class="flex gap-2">
			<input
				type="text"
				bind:value={customInput}
                onkeydown={handleKeydown}
				class="flex-1 bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder:text-neutral-700"
				placeholder="e.g. Coding, Meditation..."
			/>
			<button
				onclick={addCustomSkill}
				disabled={!customInput.trim()}
				class="bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 rounded-lg transition-colors"
			>
				<Plus />
			</button>
		</div>
	</div>

    <!-- Selected Pills (for custom ones mostly, but showing all helps confirmation) -->
    {#if selectedSkillNames.length > 0}
        <div class="flex flex-wrap gap-2 pt-2">
             {#each selectedSkillNames as skill}
                <div  transition:scale={{duration: 150}} class="bg-neutral-800 text-neutral-300 px-3 py-1 rounded-full text-sm flex items-center gap-2 border border-neutral-700">
                    {skill}
                    <button onclick={() => toggleSkill(skill)} class="hover:text-white">
                        <X size={14} />
                    </button>
                </div>
             {/each}
        </div>
    {/if}
</div>
