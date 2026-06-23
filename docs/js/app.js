fetch('../data/entrants.json')
  .then(res => res.json())
  .then(data => {
    const input = document.getElementById('search');
    const results = document.getElementById('results');

    function render(list) {
      results.innerHTML = list
        .map(item => `<div>${item.no}. ${item.name} - ${item.category}</div>`)
        .join('');
    }

    render(data);

    input.addEventListener('input', () => {
      const keyword = input.value.trim();
      const filtered = data.filter(item =>
        item.category.includes(keyword)
      );
      render(filtered);
    });
  });
