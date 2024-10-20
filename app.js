document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('themeToggle');
  const customUpload = document.getElementById('customUpload');
  const imagePreview = document.getElementById('imagePreview');
  const processBtn = document.getElementById('processBtn');

  let images = [];
  let isDarkMode = false;

  themeToggle.addEventListener('click', () => {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark-mode');
    document.querySelector('.card').classList.toggle('dark-mode');
    themeToggle.textContent = isDarkMode ? '🌙' : '🌞';
  });

  customUpload.addEventListener('change', (event) => {
    images = Array.from(event.target.files);
    imagePreview.innerHTML = '';

    if (images.length > 0) {
      images.forEach((file) => {
        const reader = new FileReader();
        reader.onload = function(e) {
          const imgElement = document.createElement('img');
          imgElement.src = e.target.result;
          imgElement.classList.add('preview-image');
          imagePreview.appendChild(imgElement);
        };
        reader.readAsDataURL(file);
      });
    } else {
      imagePreview.innerHTML = '';
    }
  });

  processBtn.addEventListener('click', () => {
    if (images.length === 0) {
      alert('Пожалуйста, загрузите хотя бы одно изображение.');
      return;
    }

    processBtn.disabled = true;
    processBtn.textContent = 'Обработка...';
    const spinner = document.createElement('span');
    spinner.classList.add('spinner');
    processBtn.appendChild(spinner);

    const zip = new JSZip();
    const promises = images.map((file, index) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(e) {
          const img = new Image();
          img.src = e.target.result;
          img.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const minDimension = Math.min(img.width, img.height);
            canvas.width = minDimension;
            canvas.height = minDimension;
            ctx.drawImage(
              img,
              (img.width - minDimension) / 2,
              (img.height - minDimension) / 2,
              minDimension,
              minDimension,
              0,
              0,
              minDimension,
              minDimension
            );
            canvas.toBlob(function(blob) {
              zip.file(`image${index + 1}.png`, blob);
              resolve();
            }, 'image/png');
          };
          img.onerror = function() {
            reject(new Error('Не удалось загрузить изображение'));
          };
        };
        reader.onerror = function() {
          reject(new Error('Не удалось прочитать файл'));
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises)
      .then(() => {
        zip.generateAsync({ type: 'blob' }).then(function(content) {
          const link = document.createElement('a');
          link.href = URL.createObjectURL(content);
          link.download = 'images.zip';
          link.click();
          URL.revokeObjectURL(link.href);
          processBtn.disabled = false;
          processBtn.textContent = 'Обработать изображения';
          images = [];
          imagePreview.innerHTML = '';
          customUpload.value = '';
        });
      })
      .catch((error) => {
        alert('Произошла ошибка при обработке изображений: ' + error.message);
        processBtn.disabled = false;
        processBtn.textContent = 'Обработать изображения';
      });
  });
});
