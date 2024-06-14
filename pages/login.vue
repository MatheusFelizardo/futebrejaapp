
<template>
  <div class="text-white flex flex-col items-center justify-center min-h-svh">
   
    <div class="w-80 flex flex-col items-center justify-center">
      
      <img class="w-32 mb-10" src="/logo.png" alt="">

      <div class="flex flex-col w-full">
        <input
        class="p-1 px-2 mb-2 bg-gray-800 text-white w-full"
          v-model="email"
          type="email"
          placeholder="E-mail"
        />

        <input
        class="p-1 px-2 mb-2 bg-gray-800 text-white w-full"
          v-model="password"
          type="password"
          placeholder="Senha"
        />
        <button class="text-xs p-1 bg-[#ffd504] text-black font-bold" @click="signIn">
          Login
        </button>
      </div>
     
    </div>
  </div>
</template>

<script setup>
const supabase = useSupabaseClient()
const email = ref('admin@futebreja.com')
const password = ref('FutebrejaPorto123')
const message = ref('')

const signIn = async () => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  })

  if (error) {
    message.value = error.message
  }

  if (data.user) {
    navigateTo('/')
  }
}
</script>