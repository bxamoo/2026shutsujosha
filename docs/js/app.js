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

    const categoryOrder = new Map();
    data.forEach(item => {
      if (!categoryOrder.has(item.category)) {
        categoryOrder.set(item.category, item.category_no ?? Number.MAX_SAFE_INTEGER);
      }
    });

    const categories = Array.from(new Set(data.map(item => item.category)))
      .sort((a, b) => (categoryOrder.get(a) - categoryOrder.get(b)) || a.localeCompare(b));

    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      select.appendChild(option);
    });

    const columns = [
      { key: 'id', label: 'No.' },
      { key: 'name', label: '名前' },
      { key: 'kana', label: 'かな' },
      { key: 'dojo', label: '道場名' },
      { key: 'rank', label: 'ランク' },
      { key: 'height', label: '身長' },
      { key: 'weight', label: '体重' },
      { key: 'age', label: '年齢' },
      { key: 'grade', label: '学年' },
      { key: 'gender', label: '性別' },
      { key: 'category_no', label: 'カテゴリNo.' },
      { key: 'category', label: 'カテゴリ' }
    ].filter(column => data.some(item => item[column.key] !== undefined));

    function render(list) {
      if (!list.length) {
        results.innerHTML = '<div>該当する選手がいません。</div>';
        return;
      }

      const tableRows = list.map(item => {
        const cells = columns.map(column => `<td>${item[column.key] ?? ''}</td>`).join('');
        return `<tr>${cells}</tr>`;
      }).join('');

      results.innerHTML = `
        <table class="entrant-table">
          <thead>
            <tr>
              ${columns.map(column => `<th>${column.label}</th>`).join('')}
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
