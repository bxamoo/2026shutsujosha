fetch('../data/entrants.json')
  .then(res => res.json())
  .then(data => {
    const select = document.getElementById('category');
    const results = document.getElementById('results');

    const categories = Array.from(new Set(data.map(item => item.category))).sort();
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      select.appendChild(option);
    });

    function render(list) {
      results.innerHTML = list
        .map(item => `<div>${item.id}. ${item.name} - ${item.category}</div>`)
        .join('');
    }

    render(data);

    select.addEventListener('change', () => {
      const selected = select.value;
      const filtered = selected
        ? data.filter(item => item.category === selected)
        : data;
      render(filtered);
    });
  });
