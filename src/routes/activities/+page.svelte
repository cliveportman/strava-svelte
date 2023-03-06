<script lang="ts">
  import { goto } from "$app/navigation";
  import { authStore } from "$stores/strava-store";
  import { onMount } from "svelte";

  type SimpleActivity = {
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

  type DetailedActivity = {
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
    commute: boolean;
    start_date: string;
    start_latlng: number[];
    end_latlng: number[];
  };

  // mobilityways
  const mobilitywaysUrl = 1118159;

  // make a fetch request to the Strava API to get the club's activities
  const getClubActivities = async (
    clubId: number
  ): Promise<SimpleActivity[]> => {
    const url = `https://www.strava.com/api/v3/clubs/${clubId}/activities?per_page=100`;
    let returnValue: SimpleActivity[] = [];
    await fetch(url, {
      headers: {
        Authorization: `Bearer ${$authStore.accessToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        returnValue = data;
        // returnValue = data.filter(
        //   (activity: Activity) => activity.athlete.firstname === "Clive"
        // );
      })
      .catch((error) => {
        returnValue = [];
      });
    return returnValue;
  };

  // make a fetch request to the Strava API to get the authenticated athlete's activities
  const getAthleteActivities = async (): Promise<DetailedActivity[]> => {
    const url = `https://www.strava.com/api/v3/athlete/activities?per_page=10`;
    let returnValue: DetailedActivity[] = [];
    await fetch(url, {
      headers: {
        Authorization: `Bearer ${$authStore.accessToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        returnValue = data;
      })
      .catch((error) => {
        returnValue = [];
      });
    return returnValue;
  };

  onMount(async () => {
    if (!$authStore.accessToken) goto("/");
  });
</script>

<div class="grid grid-cols-2">
  {#await getClubActivities(mobilitywaysUrl)}
    <p>...loading</p>
  {:then activities}
    <div class="p-2 bg-pink-100">
      <h2>Club Activities - mobilityways</h2>
      <p>
        Simplified activities returned - no dates or IDs, commute mode, etc.
        But, we could try getting around this by creating our own activity at
        midnight and using that as a reference point.
      </p>
      <ul>
        {#each activities as activity}
          <li class="text-xs">
            <strong>{activity.athlete.firstname}:</strong>
            <span
              >{activity.name} ({(activity.distance / 1000).toFixed(1)}km, {activity.type})</span
            >
          </li>
        {/each}
      </ul>
    </div>
  {:catch error}
    <p>{error.message}</p>
  {/await}

  {#await getAthleteActivities()}
    <p>...loading</p>
  {:then activities}
    <div class="p-2 bg-green-100">
      <h2>
        Athlete Activities - {$authStore.athlete.firstname}
        {$authStore.athlete.lastname}
      </h2>
      <p>
        Detailed activities, all we need for a CO2e calculation are provided.
        Commute is returned, but not is it reliably updated by the user? Could
        geofence using end location, if not.
      </p>
      <ul>
        {#each activities as activity}
          <li class="text-xs">
            <strong>{activity.name}:</strong>
            <span class="block pl-2"
              >Distance: {(activity.distance / 1000).toFixed(1)}km</span
            >
            <span class="block pl-2">Type: {activity.type}</span>
            <span class="block pl-2">Commute: {activity.commute}</span>
            <span class="block pl-2">Start date: {activity.start_date}</span>
            <span class="block pl-2">Elapsed time: {activity.elapsed_time}</span
            >
            <span class="block pl-2"
              >Start location: {activity.start_latlng}</span
            >
            <span class="block pl-2">End location: {activity.end_latlng}</span>
          </li>
        {/each}
      </ul>
    </div>
  {:catch error}
    <p>{error.message}</p>
  {/await}
</div>
