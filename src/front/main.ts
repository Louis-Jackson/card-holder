import { initializeEditableTracking, setupExportButton } from '../shared/exporter';

document.addEventListener('DOMContentLoaded', () => {
  initializeEditableTracking(document);
  setupExportButton('export-button', 'sim-card-front-highlighted');
});




