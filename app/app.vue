<template>
  <div>
    <NuxtLoadingIndicator color="#00dc82" :height="3" />
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage :transition="{ name: 'page', mode: 'out-in' }" />
    </NuxtLayout>
  </div>
</template>
