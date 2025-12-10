document.addEventListener('DOMContentLoaded', () => {
  const paths = document.querySelectorAll('svg g.map-layer path');
  const regionNames = [];
  paths.forEach(path => {
    const name = path.getAttribute('name');
    if (name) {
      regionNames.push(name);
    }
  });
  console.log('추출된 지역명:', regionNames);
});
