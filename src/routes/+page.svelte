<script lang="ts">
  const host = import.meta.env.VITE_HOST;
  const url = `https://www.strava.com/oauth/authorize?client_id=17771&response_type=code&redirect_uri=${host}auth/token&approval_prompt=force&scope=read,activity:read`;
</script>

<div class=" flex justify-center p-4">
  <a class="m-2 p-4 bg-orange-500 text-white" href={url}
    >Authenticate with your Strava account</a
  >
</div>
