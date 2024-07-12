<template>
  <div class="bg-blue-500">
    <h1>Testing Videos</h1>
    <div class="grid grid-cols-2 gap-2">
      <div class="flex flex-col items-center justify-center">
        <p>Webm Eagle</p>
        <video class="w-80" muted autoplay playsinline>
          <source src="/eagle.webm" type="video/webm">
          Your browser does not support the video tag webm.
        </video>
      </div>
      <div class="flex flex-col items-center justify-center">
        <p>Mov Eagle</p>

        <video class="w-80" muted autoplay playsinline>
          <source src="/eagle.mov">
        </video>
      </div>

      <div class="flex flex-col items-center justify-center">
        <p>Mov Eagle Compressed test</p>

        <video class="w-80" muted autoplay playsinline>
          <source src="/output_compressed.mov" type="video/quicktime">
        </video>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-2">
      <div class="flex flex-col items-center justify-center">
        <p>Webm Example Tranparency</p>
        <video class="w-80" muted autoplay playsinline>
          <source src="/sample.webm" type="video/webm">
          Your browser does not support the video tag webm.
        </video>
      </div>
      <div class="flex flex-col items-center justify-center">
        <p>Mov Example Tranparency</p>
        <video class="w-80" muted autoplay playsinline>
          <source src="/sample.mov" type="video/quicktime">
          Your browser does not support the video tag mov.
        </video>
      </div>
    </div>


  </div>
</template>

<script setup>

</script>
