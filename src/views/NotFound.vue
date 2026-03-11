<template>
  <div class="page-404">
    <div class="spotlight" />

    <div class="content">
      <h1>404</h1>
      <h2>THE TRAIL HAS GONE COLD</h2>

      <p class="detective-note">
        We’ve searched in all rooms but this page is nowhere to be found.
      </p>

      <router-link
        to="/"
        class="btn-back"
      >
        Return to the game
      </router-link>
    </div>
  </div>
</template>

<style scoped lang="scss">
.page-404 {
  height: 100vh;
  background-color: #1a1a1a; /* Очень темный фон */
  color: #ecf0f1;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.spotlight {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(44, 62, 80, 0.8) 0%, rgba(26, 26, 26, 1) 70%);
  z-index: 1;
  pointer-events: none;
}

.content {
  position: relative;
  z-index: 2;
  max-width: 500px;
  padding: 20px;
}

.code {
  font-size: 8rem;
  font-weight: 900;
  color: #c0392b;
  opacity: 0.8;
  letter-spacing: 5px;
  text-shadow: 2px 2px 0px #000;
  margin-bottom: -20px;
}

h1 {
  font-size: 2rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 20px;
  border-bottom: 2px solid #7f8c8d;
  display: inline-block;
  padding-bottom: 10px;
}

h2 {
  padding: 50px;
}

.detective-note {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #bdc3c7;
  margin-bottom: 40px;
  background: rgba(0, 0, 0, 0.3);
  padding: 15px;
  border-left: 4px solid #c0392b; /* Красная полоска как в досье */
}

.btn-back {
  display: inline-block;
  background: linear-gradient(to bottom, #5a9ad1 0%, #326891 100%);
  border: 2px solid #204663;
  color: white;
  padding: 12px 30px;
  font-weight: 700;
  text-decoration: none;
  border-radius: 8px;
  text-transform: uppercase;
  box-shadow: 0 4px 0 #1a3b55;
  transition: transform 0.1s;

  &:active {
    transform: translateY(2px);
    box-shadow: 0 2px 0 #1a3b55;
  }
}
</style>
