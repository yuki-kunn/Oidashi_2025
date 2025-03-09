<script>
</script>

<div class="side-panel">
  <div class="panel-section blue"></div>
  <div class="panel-section green"></div>
  <div class="panel-section red"></div>
</div>

<style>
  .side-panel {
    flex: 0.25;
    min-width: 200px;
    height: 100%;
    background-color: #343434;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
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