// Fetch and display images from the server
fetch('/images')
  .then(response => response.json())
  .then(images => {
    const gallery = document.getElementById('image-gallery');
    images.forEach(image => {
      const img = document.createElement('img');
      img.src = `/uploads/${image.FileName}`;
      gallery.appendChild(img);
    });
  })
  .catch(error => console.error('Error fetching images:', error));