/*
  通用导出与可编辑追踪逻辑
  - 将原本 HTML 内联的脚本提取为 TypeScript 模块
  - 使用 WeakMap 可靠追踪原始内容，替代对象键的隐式字符串化
*/

const originalValues = new WeakMap<HTMLElement, string>();

function isHTMLElement(node: Element | null): node is HTMLElement {
  return !!node && node instanceof HTMLElement;
}

export function initializeEditableTracking(root: ParentNode = document): void {
  const editableElements = root.querySelectorAll<HTMLElement>('[contenteditable="true"]');
  editableElements.forEach((element, index) => {
    element.setAttribute('data-element-id', String(index));
    originalValues.set(element, element.innerHTML);

    element.addEventListener('input', () => {
      const initial = originalValues.get(element);
      if (initial !== undefined && element.innerHTML !== initial) {
        element.classList.add('modified');
      } else {
        element.classList.remove('modified');
      }
    });
  });
}

type SaveFilePicker = (options?: unknown) => Promise<any>;

function getStylesContent(): string {
  const stylesEl = document.getElementById('card-styles');
  if (!stylesEl) {
    throw new Error('未找到样式节点 #card-styles');
  }
  return stylesEl.innerHTML;
}

export async function exportHighlightedHtml(
  fileNameBase: string,
  cardContainerId = 'card-to-export',
): Promise<void> {
  const cardToExport = document.getElementById(cardContainerId);
  if (!isHTMLElement(cardToExport)) {
    alert('无法找到要导出的内容');
    return;
  }

  const exportCard = cardToExport.cloneNode(true) as HTMLElement;

  document.querySelectorAll<HTMLElement>('.modified').forEach((originalEl) => {
    const elementId = originalEl.getAttribute('data-element-id');
    if (!elementId) return;
    const target = exportCard.querySelector<HTMLElement>(`[data-element-id="${elementId}"]`);
    if (target) target.classList.add('highlight-changes');
  });

  const stylesContent = getStylesContent();
  const fullHTML = `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>导出 - 高亮修改</title>
  <style>
    ${stylesContent}
    body { display: flex; justify-content: center; align-items: center; min-height: 100vh; background-color: #f0f2f5; font-family: var(--font-family); margin: 0; padding: 40px 20px; box-sizing: border-box; }
    .print-controls { position: fixed; top: 20px; right: 20px; z-index: 1000; }
    .print-button { padding: 10px 20px; background-color: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 14px; margin-left: 10px; }
    .print-button:hover { background-color: #218838; }
    .view-mode [contenteditable="true"] { cursor: default; pointer-events: none; }
    .view-mode [contenteditable="true"]:hover { background-color: transparent; }
    .view-mode [contenteditable="true"]:focus { outline: none; box-shadow: none; background-color: transparent; }
    .highlight-changes { background-color: #ffeb3b !important; border-radius: 2px; padding: 1px 3px; font-weight: bold; }
  </style>
  </head>
  <body>
    <div class="print-controls">
      <button class="print-button" onclick="window.print()">打印</button>
    </div>
    ${exportCard.outerHTML}
    <script>document.addEventListener('DOMContentLoaded',function(){console.log('导出页面已加载，修改内容已高亮显示')});<\/script>
  </body>
 </html>`;

  const defaultFileName = `${fileNameBase}-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}`;
  const fileName = prompt('请输入导出文件名（不包含.html后缀）:', defaultFileName);
  if (!fileName) return;

  const maybePicker: SaveFilePicker | undefined = (window as any).showSaveFilePicker;
  if (maybePicker) {
    try {
      const fileHandle = await maybePicker({
        suggestedName: fileName + '.html',
        types: [
          {
            description: 'HTML files',
            accept: { 'text/html': ['.html'] }
          }
        ]
      });
      const writable = await fileHandle.createWritable();
      await writable.write(fullHTML);
      await writable.close();
      alert('导出成功！修改内容已用黄色高亮显示');
      return;
    } catch (e: unknown) {
      if ((e as any)?.name === 'AbortError') return; // 用户取消
      console.error('文件 API 导出失败:', e);
      // 回落到普通下载
    }
  }

  const blob = new Blob([fullHTML], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName + '.html';
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  alert('导出成功！修改内容已用黄色高亮显示');
}

export function setupExportButton(buttonId: string, fileNamePrefix: string): void {
  const exportButton = document.getElementById(buttonId);
  if (!isHTMLElement(exportButton)) return;
  exportButton.addEventListener('click', () => {
    exportHighlightedHtml(fileNamePrefix).catch((err) => {
      console.error('导出失败:', err);
      alert('导出失败，请检查控制台错误信息');
    });
  });
}




