<template>
  <div class="election-map-wrapper">
    <!-- 줌 컨트롤 버튼 -->
    <div class="map-controls">
      <button class="zoom-btn zoom-in" @click="handleZoomIn">+</button>
      <button class="zoom-btn zoom-out" @click="handleZoomOut">−</button>
      <button class="zoom-btn zoom-reset" @click="handleZoomReset">Reset</button>
    </div>

    <!-- SVG 지도 -->
    <div ref="mapContainer" class="map-container" v-html="svgContent"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'

// Props
const props = defineProps({
  width: { type: Number, default: 691.2 },
  height: { type: Number, default: 552.96 }
})

// Template refs
const mapContainer = ref(null)
let d3 = null
let svg = null
let zoom = null

// SVG content will be loaded from the original HTML
const svgContent = ref('')

// Lifecycle
onMounted(async () => {
  // D3는 클라이언트 사이드에서만 로드
  if (process.client) {
    d3 = await import('d3')
    await loadSVGContent()
    setupZoom()
    setupRegionClick()
  }
})

onBeforeUnmount(() => {
  // Cleanup D3 event listeners
  if (svg) {
    svg.on('.zoom', null)
    svg.selectAll('path').on('click', null)
  }
})

// Methods
async function loadSVGContent() {
  try {
    // 원본 HTML에서 추출한 SVG 파일 로드
    const response = await fetch('/election-map.svg')
    svgContent.value = await response.text()

    // SVG가 DOM에 추가될 때까지 대기
    await nextTick()
  } catch (error) {
    console.error('SVG 로드 실패:', error)
    // 폴백: 기본 SVG 표시
    svgContent.value = `
      <svg height="${props.height}" width="${props.width}" viewBox="0 0 864 691.2" preserveAspectRatio="xMidYMid meet">
        <g class="map-layers">
          <text x="432" y="345" text-anchor="middle" style="font-size: 20px; fill: #666;">
            지도 데이터를 불러올 수 없습니다.
          </text>
        </g>
      </svg>
    `
    await nextTick()
  }
}

function setupZoom() {
  if (!d3 || !mapContainer.value) return

  svg = d3.select(mapContainer.value).select('svg')
  const mapLayers = svg.select('.map-layers')

  zoom = d3.zoom()
    .scaleExtent([0.5, 20])
    .translateExtent([[0, 0], [864, 691.2]])
    .on('zoom', (event) => {
      mapLayers.attr('transform', event.transform)
    })

  svg.call(zoom)
}

function setupRegionClick() {
  if (!d3 || !mapContainer.value) return

  svg = d3.select(mapContainer.value).select('svg')

  svg.selectAll('path').on('click', function() {
    // 모든 지역 초기화
    svg.selectAll('path')
      .style('stroke', 'white')
      .style('stroke-width', '0.5')

    // 클릭한 지역 하이라이트
    d3.select(this)
      .style('stroke', 'yellow')
      .style('stroke-width', '2')
  })
}

function handleZoomIn() {
  if (!svg || !zoom) return
  svg.transition().duration(750).call(zoom.scaleBy, 2)
}

function handleZoomOut() {
  if (!svg || !zoom) return
  svg.transition().duration(750).call(zoom.scaleBy, 0.5)
}

function handleZoomReset() {
  if (!svg || !zoom || !d3) return
  svg.transition().duration(750).call(zoom.transform, d3.zoomIdentity)
}
</script>

<style scoped>
.election-map-wrapper {
  position: relative;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.map-container {
  width: 100%;
  background: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
}

.map-container :deep(svg) {
  width: 100%;
  height: auto;
  display: block;
}

.map-controls {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 10;
}

.zoom-btn {
  width: 40px;
  height: 40px;
  border: 2px solid #333;
  background: white;
  border-radius: 4px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.zoom-btn:hover {
  background: #333;
  color: white;
  transform: scale(1.05);
}

.zoom-btn:active {
  transform: scale(0.95);
}

.zoom-reset {
  font-size: 10px;
}

/* SVG 스타일 */
.map-container :deep(svg path) {
  fill: #cccccc;
  stroke: white;
  stroke-width: 0.5;
  vector-effect: non-scaling-stroke;
  cursor: pointer;
  transition: fill 0.2s;
}

.map-container :deep(svg path:hover) {
  fill: #b0b0b0;
}

.map-container :deep(.map-arrow) {
  vector-effect: non-scaling-stroke;
}
</style>
