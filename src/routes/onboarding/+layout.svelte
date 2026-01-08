<script lang="ts">
	import { page } from '$app/stores';

	let { children } = $props();

	// Define steps
	const steps = [
		{ path: '/onboarding/vision', label: 'Vision' },
		{ path: '/onboarding/skills', label: 'Skills' },
		{ path: '/onboarding/habits', label: 'Habits' }
	];

    // Determine current step index
    let currentStepIndex = $derived(steps.findIndex(s => $page.url.pathname.includes(s.path)));
</script>

<div class="flex flex-col h-screen bg-neutral-950">
	<!-- Progress Header -->
	<header class="p-6 pb-2">
		<div class="flex justify-between items-center mb-4">
			{#each steps as step, i}
				<div class="flex flex-col items-center z-10 relative">
					<div 
                        class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-300
                        {i <= currentStepIndex ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'bg-neutral-800 text-neutral-500'}"
                    >
						{i + 1}
					</div>
					<span class="text-xs mt-2 font-medium {i <= currentStepIndex ? 'text-indigo-300' : 'text-neutral-600'}">
                        {step.label}
                    </span>
				</div>
                {#if i < steps.length - 1}
                     <!-- Connector Line -->
                    <div class="flex-1 h-0.5 mx-2 -mt-4 bg-neutral-800 overflow-hidden relative">
                         <div class="absolute inset-0 bg-indigo-500 transition-all duration-500 origin-left"
                              style="transform: scaleX({i < currentStepIndex ? 1 : 0})">
                         </div>
                    </div>
                {/if}
			{/each}
		</div>
	</header>

	<!-- Content Area -->
	<div class="flex-1 overflow-y-auto px-6 py-4">
		{@render children()}
	</div>
</div>
