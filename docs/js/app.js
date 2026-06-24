fetch(new URL('data/entrants.json', window.location.href))
  .then(res => {
    if (!res.ok) {
      throw new Error(`データの読み込みに失敗しました: ${res.status}`);
    }
    return res.json();
  })
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
      if (!list.length) {
        results.innerHTML = '<div>該当する選手がいません。</div>';
        return;
      }

      const headers = Array.from(
        new Set(list.flatMap(item => Object.keys(item)))
      ).sort((a, b) => {
        const order = ['id', 'name', 'dojo', 'rank', 'height', 'weight', 'age', 'grade', 'gender', 'category'];
        return (order.indexOf(a) - order.indexOf(b)) || a.localeCompare(b);
      });

      const tableRows = list.map(item => {
        const cells = headers.map(header => `<td>${item[header] ?? ''}</td>`).join('');
        return `<tr><td>${item.id}</td>${cells.replace(`<td>${item.id}</td>`, '')}</tr>`;
      }).join('');

      results.innerHTML = `
        <table class="entrant-table">
          <thead>
            <tr>
              <th>No.</th>
              ${headers.map(header => `<th>${header}</th>`).join('')}
            </tr>
          </thead>
          <tbody>${tableRows}</tbody>
        </table>
      `;
    }

    render(data);

    select.addEventListener('change', () => {
      const selected = select.value;
      const filtered = selected
        ? data.filter(item => item.category === selected)
        : data;
      render(filtered);
    });
  })
  .catch(error => {
    document.getElementById('results').innerHTML = `<div>${error.message}</div>`;
  });
