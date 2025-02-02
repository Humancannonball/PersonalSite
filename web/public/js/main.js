(function() {
  const canvas = document.getElementById('hacker-bg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let fontSize = 20; // increased font size for Matrix effect
  let columns, drops;
  // Updated to include Matrix-style Katakana characters along with numbers and symbols
  const chars = "アァカサタナハマヤャラワン0123456789@#$%^&*";
  const charArr = chars.split("");

  // Resize and reinitialize drops based on window size
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    columns = Math.floor(canvas.width / fontSize);
    drops = new Array(columns).fill(0);
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  function draw() {
    // Darker background fill for stronger trailing effect
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#0F0";
    ctx.font = fontSize + "px monospace";
    for (let i = 0; i < drops.length; i++) {
      const text = charArr[Math.floor(Math.random() * charArr.length)];
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);
      // Reset drop randomly if it passes the bottom
      drops[i] = (drops[i] * fontSize > canvas.height && Math.random() > 0.975) ? 0 : drops[i] + 1;
    }
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
})();