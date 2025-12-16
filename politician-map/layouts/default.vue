<template>
  <div>
    <nav class="bg-white border-b border-gray-200 z-50 flex-shrink-0">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <NuxtLink to="/" class="flex items-center space-x-2 group">
            <div class="text-2xl">🏛️</div>
            <span class="text-xl font-bold text-gray-900">
              정치인 커뮤니티
            </span>
          </NuxtLink>

          <div class="flex items-center space-x-4">
            <NuxtLink
              to="/suggestions"
              class="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition-all"
            >
              건의사항 목록
            </NuxtLink>

            <NuxtLink
              v-if="!isAuthenticated"
              to="/auth/login"
              class="px-6 py-2 rounded-lg bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-all"
            >
              로그인
            </NuxtLink>

            <button
              v-else
              @click="handleSignOut"
              class="px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 font-medium transition-all"
            >
              로그아웃
            </button>
          </div>
        </div>
      </div>
    </nav>
    <main>
      <slot />
    </main>
  </div>
</template>

<script setup>
import { useAuth } from '~/composables/useAuth'

const { isAuthenticated, signOut } = useAuth()

const handleSignOut = async () => {
  await signOut()
}
</script>