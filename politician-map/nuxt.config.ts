export default defineNuxtConfig({
  devtools: { enabled: true },

  compatibilityDate: '2024-12-15',

  app: {
    head: {
      title: '제22대 국회의원 선거 결과',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '지난 대선과 이번 총선의 민심은 어떻게 달라졌을까요? 네가지 지도를 통해 살펴보는 제22대 국회의원 선거 결과를 살펴보실 수 있습니다.' }
      ],
      link: [
        { rel: 'stylesheet', href: '/app.css' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/earlyaccess/notosanskr.css' }
      ],
      script: [
        { src: 'https://www.khan.co.kr/spko/js/plugin/jquery-1.11.3.min.js', type: 'text/javascript', tagPosition: 'bodyClose' },
        { src: 'https://cdnjs.cloudflare.com/ajax/libs/d3/5.16.0/d3.min.js', type: 'text/javascript', tagPosition: 'bodyClose' },
        { src: '/map_zoom.js', defer: true, tagPosition: 'bodyClose' },
        { src: '/count.js', defer: true, tagPosition: 'bodyClose' }
      ]
    }
  },

  // D3.js가 클라이언트 사이드에서만 동작하도록
  build: {
    transpile: ['d3']
  }
})
