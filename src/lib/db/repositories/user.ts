import { db, type UserProfile } from '../database';
import { v4 as uuidv4 } from 'uuid';

export const userRepository = {
	async get(): Promise<UserProfile | undefined> {
		return await db.userProfile.toCollection().first();
	},

	async create(
		profile: Omit<UserProfile, 'id' | 'createdAt' | 'onboardingCompleted'>
	): Promise<string> {
		const id = uuidv4();
		await db.userProfile.add({
			...profile,
			id,
			createdAt: new Date(),
			onboardingCompleted: false
		});
		return id;
	},

	async update(updates: Partial<UserProfile>): Promise<void> {
		const profile = await this.get();
		if (profile) {
			await db.userProfile.update(profile.id, updates);
		}
	},

	async completeOnboarding(): Promise<void> {
		const profile = await this.get();
		if (profile) {
			await db.userProfile.update(profile.id, { onboardingCompleted: true });
		}
	}
};
