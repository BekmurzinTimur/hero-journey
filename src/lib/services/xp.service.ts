export const xpService = {
	/**
	 * Calculates level based on total XP.
	 * Formula: level = floor(sqrt(xp / 10))
	 */
	calculateLevel(xp: number): number {
		if (xp < 0) return 0;
		return Math.floor(Math.sqrt(xp / 10));
	},

	/**
	 * Calculates XP required to reach the next level.
	 * Next level L+1 requires: 10 * (L+1)^2 XP.
	 */
	getXPForNextLevel(currentLevel: number): number {
		const nextLevel = currentLevel + 1;
		return 10 * Math.pow(nextLevel, 2);
	},

	/**
	 * Calculates XP required to reach current level.
	 */
	getXPForCurrentLevel(currentLevel: number): number {
		return 10 * Math.pow(currentLevel, 2);
	},

	/**
	 * Calculates actual XP award based on effort and streak.
	 * Base XP: Low=0.1, Medium=0.2, High=0.3
	 * Bonus: +10% per streak day
	 */
	calculateXPGain(effort: 'low' | 'medium' | 'high', currentStreak: number): number {
		const baseMap = {
			low: 0.1,
			medium: 0.2,
			high: 0.3
		};
		const base = baseMap[effort];
		// Bonus multiplier: 1 + (streak * 0.10)
		// Example: Streak 0 -> 1.0x
		// Example: Streak 5 -> 1.5x
		const multiplier = 1 + currentStreak * 0.1;

		// Round to 2 decimals
		return Math.round(base * multiplier * 100) / 100;
	}
};
