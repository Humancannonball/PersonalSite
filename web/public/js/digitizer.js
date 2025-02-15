document.addEventListener('DOMContentLoaded', () => {
    const uploadInput = document.getElementById('graphUpload');
    const preview = document.getElementById('preview');
    const processBtn = document.getElementById('processGraph');
    const output = document.getElementById('output');
    const downloadBtn = document.getElementById('download');
  
    uploadInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        preview.innerHTML = '';
        preview.appendChild(img);
      };
      
      reader.readAsDataURL(file);
    });
  
    processBtn.addEventListener('click', async () => {
      const settings = {
        scaleType: document.getElementById('scaleType').value,
        precision: parseInt(document.getElementById('precision').value)
      };
  
      const formData = new FormData();
      formData.append('image', uploadInput.files[0]);
      formData.append('settings', JSON.stringify(settings));
  
      try {
        const response = await fetch('/processGraph', {
          method: 'POST',
          body: formData
        });
        
        const data = await response.json();
        output.textContent = JSON.stringify(data.points, null, 2);
        downloadBtn.style.display = 'block';
      } catch (error) {
        output.textContent = `Error: ${error.message}`;
      }
    });
  
    downloadBtn.addEventListener('click', () => {
      const blob = new Blob([output.textContent], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'graph_data.json';
      a.click();
    });
  });
