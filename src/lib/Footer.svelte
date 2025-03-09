<script>
  import { goto } from '$app/navigation';

  function handlePlusClick() {
    goto('/add-event');
  }
</script>

<!-- フッターセクション -->
<footer>
  <div class="footer-content">
    <div class="section green"></div>
    <div class="section yellow"></div>
    <div class="section orange"></div>
    <div class="section red"></div>
    <button class="plus-button" on:click={handlePlusClick}>
      <span>+</span>
    </button>
  </div>
</footer>

<style>
  footer {
    width: 100%;
    height: 50px;
    background-color: rgb(200, 200, 200);
    padding: 10px 0;
  }

  .footer-content {
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 0 20px;
    height: 100%;
    max-height: 60px;
  }

  .section {
    flex: 1;
    height: 30px;
    margin: 0 px;
    border: 2px solid black;
  }

  .green {
    background-color: #73b075;
  }

  .yellow {
    background-color: #FFEB3B;
  }

  .orange {
    background-color: #FF9800;
  }

  .red {
    background-color: #F44336;
  }

  .plus-button {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #07d400;
    color: white;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    margin-left: 60px;
  }
</style>