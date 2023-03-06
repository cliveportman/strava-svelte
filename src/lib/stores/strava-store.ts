import { writable } from "svelte/store";

// Auth store
type authStore = {
  accessToken: null | string;
  accessTokenExpiresAt: null | number;
  refreshToken: null | string;
  athlete: null | any;
};
export const authStore = writable<authStore>({
  accessToken: null,
  accessTokenExpiresAt: null,
  refreshToken: null,
  athlete: null,
});

// Strava store
type StravaStore = {};
export const stravaStore = writable<StravaStore>({});
