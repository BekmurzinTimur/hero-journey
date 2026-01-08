import Dexie, { type Table } from 'dexie';

export interface UserProfile {
	id: string;
	createdAt: Date;
	onboardingCompleted: boolean;
	vision: string | null;
}

export interface Skill {
	id: string;
	name: string;
	color: string;
	icon: string;
	currentXP: number;
	level: number;
	createdAt: Date;
	isFromTemplate: boolean;
}

export interface Habit {
	id: string;
	name: string;
	effort: 'low' | 'medium' | 'high';
	skillIds: string[];
	createdAt: Date;
	isActive: boolean;
}

export interface HabitCompletion {
	id: string;
	habitId: string;
	completedAt: Date;
	xpAwarded: Record<string, number>; // serialized JSON
	streakAtCompletion: number;
	bonusMultiplier: number;
}

export interface StreakRecord {
	habitId: string;
	currentStreak: number;
	lastCompletionDate: string; // ISO date YYYY-MM-DD
	longestStreak: number;
}

export class HeroDatabase extends Dexie {
	userProfile!: Table<UserProfile>;
	skills!: Table<Skill>;
	habits!: Table<Habit>;
	completions!: Table<HabitCompletion>;
	streaks!: Table<StreakRecord>;

	constructor() {
		super('HeroJourneyDB');
		this.version(1).stores({
			userProfile: 'id',
			skills: 'id, name',
			habits: 'id, name, isActive',
			completions: 'id, habitId, completedAt',
			streaks: 'habitId'
		});
	}
}

export const db = new HeroDatabase();
