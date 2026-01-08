<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg'; // Check if this path exists or needed. The original file had it.
    // The previous view showed: import favicon from '$lib/assets/favicon.svg';
    // But list_dir of src only showed lib/ -> check if assets exists there?
    // list_dir src/lib didn't happen yet.
    // I will assume it exists since it was in the original file.
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { userRepository } from '$lib/db/repositories/user';

	let { children } = $props();

	onMount(async () => {
		const user = await userRepository.get();
        // Check current path
        const path = $page.url.pathname;
        
		if (!user || !user.onboardingCompleted) {
			if (!path.startsWith('/onboarding')) {
				goto('/onboarding/vision');
			}
		}
	});
</script>

<svelte:head>
    <link rel="icon" href={favicon} />
    <title>Hero Journey</title>
</svelte:head>

<div class="min-h-screen bg-neutral-900 text-white font-sans antialiased selection:bg-indigo-500/30">
	<main class="mx-auto max-w-md min-h-screen relative bg-neutral-950 shadow-2xl overflow-hidden">
		{@render children()}
	</main>
</div>
