/**
 * Exports lists of tasks to a CSV file.
 * @param {Array} tasks - Array of task objects.
 */
export function exportToCSV(tasks) {
  const headers = ['ID', 'Title', 'Description', 'Status', 'Priority', 'Category', 'Due Date', 'Created At'];
  
  const rows = tasks.map(t => {
    const escapedTitle = `"${(t.title || '').replace(/"/g, '""')}"`;
    const escapedDesc = `"${(t.description || '').replace(/"/g, '""')}"`;
    return [
      t.id,
      escapedTitle,
      escapedDesc,
      t.status,
      t.priority,
      t.category,
      t.dueDate,
      t.createdAt
    ];
  });
  
  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `FocusFlow_Tasks_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Creates a printable HTML layout containing tasks and triggers browser PDF printing.
 * @param {Array} tasks - Array of task objects.
 */
export function exportToPDF(tasks) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Popup blocker prevented generating the report. Please allow popups for this page.');
    return;
  }

  const taskRows = tasks.map(t => {
    let priorityClass = 'badge-medium';
    if (t.priority === 'high') priorityClass = 'badge-high';
    if (t.priority === 'low') priorityClass = 'badge-low';

    return `
      <tr>
        <td class="task-title">${t.title}</td>
        <td><span class="badge ${priorityClass}">${t.priority.toUpperCase()}</span></td>
        <td><span class="category">${t.category}</span></td>
        <td><span class="status ${t.status === 'completed' ? 'completed' : ''}">${t.status.replace('-', ' ').toUpperCase()}</span></td>
        <td>${t.dueDate || 'No Date'}</td>
      </tr>
    `;
  }).join('');

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>FocusFlowAI - Task Report</title>
        <style>
          body {
            font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
            color: #1e293b;
            padding: 32px;
            margin: 0;
            line-height: 1.5;
          }
          .header {
            border-bottom: 2px solid #7c3aed;
            padding-bottom: 16px;
            margin-bottom: 24px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
          }
          .title {
            font-size: 28px;
            font-weight: 700;
            color: #7c3aed;
          }
          .meta {
            font-size: 14px;
            color: #64748b;
            text-align: right;
          }
          .summary-cards {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 16px;
            margin-bottom: 32px;
          }
          .card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            padding: 16px;
            border-radius: 8px;
            text-align: center;
          }
          .card h4 {
            margin: 0 0 8px 0;
            color: #64748b;
            font-size: 12px;
            text-transform: uppercase;
          }
          .card p {
            margin: 0;
            font-size: 24px;
            font-weight: bold;
            color: #0f172a;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 16px;
          }
          th {
            background-color: #f1f5f9;
            color: #475569;
            font-weight: 600;
            text-transform: uppercase;
            font-size: 12px;
            border-bottom: 2px solid #cbd5e1;
          }
          th, td {
            padding: 12px 16px;
            text-align: left;
            border-bottom: 1px solid #e2e8f0;
          }
          .task-title {
            font-weight: 500;
            color: #0f172a;
          }
          .badge {
            display: inline-block;
            font-size: 10px;
            font-weight: 700;
            padding: 4px 8px;
            border-radius: 4px;
            text-align: center;
          }
          .badge-high { background-color: #fee2e2; color: #ef4444; }
          .badge-medium { background-color: #fef9c3; color: #ca8a04; }
          .badge-low { background-color: #dcfce7; color: #16a34a; }
          .category {
            background-color: #f1f5f9;
            color: #475569;
            font-size: 12px;
            padding: 4px 8px;
            border-radius: 4px;
          }
          .status {
            font-size: 11px;
            font-weight: 600;
            color: #f97316;
          }
          .status.completed {
            color: #16a34a;
          }
          @media print {
            body { padding: 0; }
            .card { background: #f8fafc !important; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="title">FocusFlowAI</div>
            <div style="font-size: 14px; color: #64748b;">Smart Task Manager & AI Productivity Hub</div>
          </div>
          <div class="meta">
            <div>Report Generated: ${new Date().toLocaleDateString()}</div>
            <div>FocusFlow Analytics</div>
          </div>
        </div>

        <div class="summary-cards">
          <div class="card">
            <h4>Total Tasks</h4>
            <p>${tasks.length}</p>
          </div>
          <div class="card">
            <h4>Completed</h4>
            <p>${tasks.filter(t => t.status === 'completed').length}</p>
          </div>
          <div class="card">
            <h4>Pending</h4>
            <p>${tasks.filter(t => t.status !== 'completed').length}</p>
          </div>
          <div class="card">
            <h4>High Priority</h4>
            <p>${tasks.filter(t => t.priority === 'high').length}</p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Task Title</th>
              <th>Priority</th>
              <th>Category</th>
              <th>Status</th>
              <th>Due Date</th>
            </tr>
          </thead>
          <tbody>
            ${taskRows}
          </tbody>
        </table>
        
        <script>
          window.onload = function() {
            setTimeout(() => {
              window.print();
              window.close();
            }, 500);
          }
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
