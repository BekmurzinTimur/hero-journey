<script lang="ts">
    import type { Skill } from '$lib/db/database';
    import { xpService } from '$lib/services/xp.service';
    
    interface Props {
        skill: Skill;
        isProgressable?: boolean;
    }

    let { skill, isProgressable = false } = $props<Props>();

    // Calculate progress
    let nextLevelXP = $derived(xpService.getXPForNextLevel(skill.level));
    let prevLevelXP = $derived(xpService.getXPForCurrentLevel(skill.level));
    let levelProgress = $derived((skill.currentXP - prevLevelXP) / (nextLevelXP - prevLevelXP));
    let percentage = $derived(Math.min(100, Math.max(0, levelProgress * 100)));
</script>

<div class="relative bg-neutral-900 border border-neutral-800 rounded-xl p-3 overflow-hidden group
    {isProgressable ? 'ring-1 ring-indigo-500/30' : ''}">
    
    <!-- Background Glow -->
    {#if isProgressable}
        <div class="absolute inset-0 bg-indigo-500/5 blur-xl animate-pulse"></div>
    {/if}

    <div class="relative z-10 flex flex-col gap-2">
        <div class="flex justify-between items-center">
            <h3 class="font-bold text-white tracking-wide text-sm flex items-center gap-2">
                <div class="w-2 h-2 rounded-full" style="background-color: {skill.color}"></div>
                {skill.name}
            </h3>
            <div class="text-xs font-mono font-medium text-neutral-400">
                Lvl <span class="text-white text-base">{skill.level}</span>
            </div>
        </div>

        <!-- Progress Bar Track -->
        <div class="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
            <!-- Progress Bar Fill -->
            <div 
                class="h-full rounded-full transition-all duration-700 ease-out"
                style="width: {percentage}%; background-color: {skill.color}; box-shadow: 0 0 10px {skill.color}80;"
            ></div>
        </div>
        
        <div class="flex justify-between text-[10px] text-neutral-600 font-medium">
            <span>{Math.floor(skill.currentXP)} XP</span>
            <span>{nextLevelXP} XP</span>
        </div>
    </div>
</div>
