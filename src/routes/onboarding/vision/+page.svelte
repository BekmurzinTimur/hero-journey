<script lang="ts">
	import { goto } from '$app/navigation';
	import { userRepository } from '$lib/db/repositories/user';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	let vision = $state('');
    let loading = $state(true);

	onMount(async () => {
		const user = await userRepository.get();
		if (user && user.vision) {
			vision = user.vision;
		}
        loading = false;
	});

	async function handleSubmit() {
		const user = await userRepository.get();
		if (user) {
			await userRepository.update({ vision });
		} else {
			await userRepository.create({
				vision: vision || null // Allow null if empty
			});
		}
		goto('/onboarding/skills');
	}

    async function handleSkip() {
        // Same as submit but vision is whatever it is (likely empty)
        await handleSubmit();
    }
</script>

{#if !loading}
<div in:fade={{ duration: 400 }} class="flex flex-col h-full">
	<div class="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
		<h1 class="text-3xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
            Define Your Vision
        </h1>
		<p class="text-neutral-400 mb-8 leading-relaxed">
			Who is the hero you are becoming? Describe your ideal self one year from now.
		</p>

		<textarea
			bind:value={vision}
			class="w-full h-48 bg-neutral-900 border border-neutral-800 rounded-xl p-4 text-neutral-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none transition-all placeholder:text-neutral-700"
			placeholder="I am consistent, focused, and physically strong..."
		></textarea>

        <div class="mt-4 flex justify-end">
             <button 
                onclick={handleSkip} 
                class="text-neutral-500 text-sm hover:text-neutral-300 transition-colors px-4 py-2"
            >
                Skip for now
            </button>
        </div>
	</div>

	<div class="mt-auto py-6">
		<button
			onclick={handleSubmit}
			class="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3.5 rounded-xl shadow-[0_4px_12px_rgba(79,70,229,0.3)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.4)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
		>
			Continue
		</button>
	</div>
</div>
{/if}
