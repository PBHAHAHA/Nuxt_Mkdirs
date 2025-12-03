<script setup lang="ts">
import { LogOut, FileText, Settings } from 'lucide-vue-next';

const { user, signOut, isLoading } = useAuth();

const menuItems = [
  { title: 'My Submissions', href: '/dashboard/submissions', icon: FileText },
  { title: 'Settings', href: '/dashboard/settings', icon: Settings },
];

async function handleSignOut() {
  await signOut();
}

// 获取用户头像的首字母
function getInitials(name?: string) {
  if (!name) return 'U';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}
</script>

<template>
  <!-- Loading state -->
  <div v-if="isLoading" class="size-8 animate-pulse rounded-full border bg-muted" />
  
  <!-- User button with dropdown -->
  <UiDropdownMenu v-else-if="user">
    <UiDropdownMenuTrigger as-child>
      <button class="flex items-center outline-none cursor-pointer">
        <!-- Avatar -->
        <div class="relative size-8 rounded-full border overflow-hidden bg-muted">
          <img
            v-if="user.image"
            :src="user.image"
            :alt="user.name || 'User'"
            class="size-full object-cover"
          />
          <div
            v-else
            class="size-full flex items-center justify-center bg-primary text-primary-foreground text-xs font-medium"
          >
            {{ getInitials(user.name) }}
          </div>
        </div>
      </button>
    </UiDropdownMenuTrigger>
    
    <UiDropdownMenuContent
      align="end"
      :side-offset="4"
      class="z-50 min-w-56 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
    >
      <!-- User info -->
      <div class="flex items-center justify-start gap-2 p-2">
        <div class="flex flex-col space-y-1 leading-none">
          <p v-if="user.name" class="font-medium">{{ user.name }}</p>
          <p v-if="user.email" class="w-[200px] truncate text-sm text-muted-foreground">
            {{ user.email }}
          </p>
        </div>
      </div>
      
      <UiDropdownMenuSeparator class="-mx-1 my-1 h-px bg-muted" />
      
      <!-- Menu items -->
      <UiDropdownMenuItem
        v-for="item in menuItems"
        :key="item.href"
        as-child
        class="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
      >
        <NuxtLink :to="item.href" class="flex items-center space-x-2.5 w-full">
          <component :is="item.icon" class="size-4" />
          <span class="text-sm">{{ item.title }}</span>
        </NuxtLink>
      </UiDropdownMenuItem>
      
      <UiDropdownMenuSeparator class="-mx-1 my-1 h-px bg-muted" />
      
      <!-- Logout -->
      <UiDropdownMenuItem
        class="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
        @click="handleSignOut"
      >
        <div class="flex items-center space-x-2.5">
          <LogOut class="size-4" />
          <span class="text-sm">Log out</span>
        </div>
      </UiDropdownMenuItem>
    </UiDropdownMenuContent>
  </UiDropdownMenu>
</template>
