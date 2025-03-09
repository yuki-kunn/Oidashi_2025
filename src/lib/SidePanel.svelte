<script>
</script>

<div class="side-panel">
  <div class="panel-section good">
    <span class="section-text">好調</span>
  </div>
  <div class="panel-section normal">
    <span class="section-text">通常</span>
  </div>
  <div class="panel-section bad">
    <span class="section-text">不調</span>
  </div>
</div>

<style>
  .side-panel {
    flex: 0.25;
    min-width: 200px;
    height: 100%;
    background-color: #2c2c2c;
    margin: 0;
    padding: 5px 0;
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .panel-section {
    flex: 1;
    margin: 0 7px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: all 0.3s ease;
    box-shadow: inset 0 -2px 0 rgba(0,0,0,0.15);
    position: relative;
    overflow: hidden;
  }

  .panel-section::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 50%;
    background: linear-gradient(to bottom, rgba(255,255,255,0.1), transparent);
    pointer-events: none;
  }

  .section-text {
    color: white;
    font-size: 1.2rem;
    font-weight: bold;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  }

  .good {
    background-color: #66bb6a;  /* より柔らかい緑色 */
  }

  .normal {
    background-color: #42a5f5;  /* より柔らかい青色 */
  }

  .bad {
    background-color: #ef5350;  /* より柔らかい赤色 */
  }

  .panel-section:hover {
    opacity: 0.9;
    transform: scale(0.98);
  }
</style>