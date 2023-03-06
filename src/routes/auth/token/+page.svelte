<script lang="ts">
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { authStore } from "$stores/strava-store";

  type Activity = {
    resource_state: number;
    athlete: {
      resource_state: number;
      firstname: string;
      lastname: string;
    };
    name: string;
    distance: number;
    moving_time: number;
    elapsed_time: number;
    total_elevation_gain: number;
    type: string;
    sport_type: string;
    workout_type: number;
  };

  // get the token from the url
  const authCode = $page.url.searchParams.get("code");
  const clientId = import.meta.env.VITE_STRAVA_APP_CLIENT_ID;
  const clientSecret = import.meta.env.VITE_STRAVA_APP_CLIENT_SECRET;

  // make a fetch request to the Strava API
  const fetchAccessToken = async (authCode: string) => {
    const url = `https://www.strava.com/oauth/token`;
    const data = {
      client_id: clientId,
      client_secret: clientSecret,
      code: authCode,
      grant_type: "authorization_code",
    };
    let returnValue: Activity[] = [];
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then(({ access_token, refresh_token, expires_at, athlete }) => {
        $authStore.accessToken = access_token;
        $authStore.accessTokenExpiresAt = expires_at;
        $authStore.refreshToken = refresh_token;
        $authStore.athlete = athlete;
        goto("/activities");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  onMount(() => {
    if (authCode != null) fetchAccessToken(authCode);
  });
</script>
