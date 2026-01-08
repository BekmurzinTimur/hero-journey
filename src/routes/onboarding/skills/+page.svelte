<script lang="ts">
	import { goto } from '$app/navigation';
	import { skillsRepository } from '$lib/db/repositories/skills';
    import { userRepository } from '$lib/db/repositories/user';
	import SkillSelector from '$lib/components/onboarding/SkillSelector.svelte';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	let selectedSkillNames = $state<string[]>([]);
	let loading = $state(true);

	onMount(async () => {
		const skills = await skillsRepository.getAll();
		if (skills.length > 0) {
			selectedSkillNames = skills.map((s) => s.name);
		}
		loading = false;
	});

	async function handleSubmit() {
        if (selectedSkillNames.length === 0) return;

		const existingSkills = await skillsRepository.getAll();
        const existingNames = existingSkills.map(s => s.name);

        // Add new skills
        for (const name of selectedSkillNames) {
            if (!existingNames.includes(name)) {
                // Determine color/icon based on template matching or random fallback
                // For MVP, just using a default color or random from palette
                const colors = ['#f87171', '#60a5fa', '#c084fc', '#38bdf8', '#94a3b8', '#f472b6', '#fbbf24', '#34d399'];
                const randomColor = colors[Math.floor(Math.random() * colors.length)];
                
                await skillsRepository.create({
                    name,
                    color: randomColor, // Ideally match template color if exists
                    icon: 'star', // Default icon
                    isFromTemplate: true // Simply marking all as template-ish for now or could check against template list
                });
            }
        }

        // Remove unselected skills
        for (const skill of existingSkills) {
            if (!selectedSkillNames.includes(skill.name)) {
                await skillsRepository.delete(skill.id);
            }
        }
        
        // Ensure user exists (in case they navigated directly here, though layout guards it)
        const user = await userRepository.get();
        if (!user) {
             await userRepository.create({ vision: null });
        }

		goto('/onboarding/habits');
	}
</script>

{#if !loading}
<div in:fade={{ duration: 400 }} class="flex flex-col h-full">
	<div class="flex-1 max-w-sm mx-auto w-full">
		<h1 class="text-3xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
            Choose Your Skills
        </h1>
		<p class="text-neutral-400 mb-6 leading-relaxed">
			Select the attributes you want to level up in your life.
		</p>
        
        <SkillSelector 
            selectedSkillNames={selectedSkillNames} 
            onchange={(skills) => selectedSkillNames = skills} 
        />
	</div>
    
    <!-- Spacer for scrolling content -->
    <div class="h-8"></div>

	<div class="mt-auto py-6 sticky bottom-0 bg-gradient-to-t from-neutral-950 to-transparent pt-8">
		<button
			onclick={handleSubmit}
            disabled={selectedSkillNames.length === 0}
			class="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3.5 rounded-xl shadow-[0_4px_12px_rgba(79,70,229,0.3)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.4)] transition-all duration-200"
		>
			Continue
		</button>
	</div>
</div>
{/if}
