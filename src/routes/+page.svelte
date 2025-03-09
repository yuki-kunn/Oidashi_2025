<script>
  import "../app.css";
  import Header from "../lib/Header.svelte";
  import Footer from "../lib/Footer.svelte";
  import SidePanel from "../lib/SidePanel.svelte";
</script>

<div class="page-container">
  <Header />
  <div class="content-wrapper">
    <main class="horizontal-scroll">
      <div class="content-sections">
        {#each Array(24) as _, i}
          <div class="vertical-line" style="left: {(i + 1) * 4.16}%"></div>
        {/each}
        <div class="month-labels">
          {#each ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'] as month, i}
            <div class="month-label" style="left: {(i * 8.33) + 4.16}%">{month}</div>
          {/each}
        </div>
        <div class="section light-gray">
          <div class="event-item" style="left: 10%; width: 15%;">
            <div class="event-content">イベント1</div>
          </div>
          <div class="event-item" style="left: 35%; width: 20%;">
            <div class="event-content">イベント2</div>
          </div>
        </div>
        <div class="section medium-gray">
          <div class="event-item" style="left: 55%; width: 25%;">
            <div class="event-content">イベント3</div>
          </div>
        </div>
        <div class="section light-gray">
          <div class="event-item" style="left: 85%; width: 10%;">
            <div class="event-content">イベント4</div>
          </div>
        </div>
      </div>
    </main>
    <SidePanel />
  </div>
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

  .content-wrapper {
    flex: 1;
    display: flex;
    overflow: hidden;
  }

  main.horizontal-scroll {
    flex: 1.25;
    overflow-x: auto;
    overflow-y: hidden;
    white-space: nowrap;
  }

  .content-sections {
    display: inline-flex;
    flex-direction: column;
    height: 100%;
    width: 300%; /* さらに横幅を広げる */
    position: relative;
    min-width: 1500px; /* 最低限の幅を確保 */
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
    width: 100%;
  }
  
  .light-gray {
    background-color: #F5F5F5;
  }
  
  .medium-gray {
    background-color: #E6E6E6;
  }

  .month-labels {
    position: absolute;
    top: 5px;
    width: 100%;
    height: 20px;
    z-index: 2;
  }

  .month-label {
    position: absolute;
    font-size: 12px;
    font-weight: bold;
    color: #555;
  }

  .event-item {
    position: absolute;
    background-color: rgba(83, 97, 170, 0.7);
    height: 80%;
    top: 10%;
    border-radius: 4px;
    z-index: 3;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .event-content {
    color: white;
    font-weight: bold;
    padding: 5px;
    text-align: center;
  }
</style>