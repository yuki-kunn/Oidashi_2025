<script>
  import "../app.css";
  import Header from "../lib/Header.svelte";
  import Footer from "../lib/Footer.svelte";
</script>

<div class="page-container">
  <Header />
  <main>
    <div class="main-content">
      <div class="content-sections">
        {#each Array(12) as _, i}
          <div class="vertical-line" style="left: {(i + 1) * 8.33}%"></div>
        {/each}
        <div class="section light-gray"></div>
        <div class="section medium-gray"></div>
        <div class="section light-gray"></div>
      </div>
      <div class="side-panel">
        <div class="panel-section blue"></div>
        <div class="panel-section green"></div>
        <div class="panel-section red"></div>
      </div>
    </div>
  </main>
  <Footer />
</div>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    height: 100vh;
    overflow: hidden;
  }

  .page-container {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    overflow: hidden;
  }

  main {
    flex: 1;
    display: flex;
    margin: 0;
    padding: 0;
  }

  .main-content {
    display: flex;
    flex-direction: row;
    width: 100%;
  }

  .content-sections {
    flex: 1.25;
    display: flex;
    flex-direction: column;
    margin: 0;
    padding: 0;
    position: relative;
  }

  .vertical-line {
    position: absolute;
    width: 1px;
    height: 100%;
    background-color: #A0A0A0;
    z-index: 1;
  }

  .section {
    flex: 1;
    margin: 0;
    padding: 0;
  }

  .side-panel {
    flex: 0.25;
    background-color: #343434;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
  }
  
  .light-gray {
    background-color: #F5F5F5;
  }
  
  .medium-gray {
    background-color: #E6E6E6;
  }

  .panel-section {
    flex: 1;
    margin: 7px;
  }

  .blue {
    background-color: #0000ff;
  }

  .green {
    background-color: #00FF00;
  }

  .red {
    background-color: #FF0000;
  }
</style>