<script>
  import "../app.css";
  import Header from "../lib/Header.svelte";
  import Footer from "../lib/Footer.svelte";
  import SidePanel from "../lib/SidePanel.svelte";
  import ActivityChart from "../lib/ActivityChart.svelte";
  import { fetchHistoryList } from '$lib/supabaseFunction';
  import { onMount } from 'svelte';

  let historyList = [];
  let isLoading = true;

  const getHistoryList = async () => {
    try {
      const data = await fetchHistoryList();
      if (data && data.length > 0) {
        historyList = data;
      }
    } catch (error) {
      console.error('履歴の取得中にエラーが発生しました:', error);
    } finally {
      isLoading = false;
    }
  };

  onMount(getHistoryList);
</script>

<div class="page-container">
  <Header />
  <div class="content-wrapper">
    <main class="horizontal-scroll">
      <div class="content-sections">
        {#if isLoading}
          <div class="loading">
            <p>データを読み込み中...</p>
            <div class="spinner"></div>
          </div>
        {:else}
          <ActivityChart {historyList} />
        {/if}
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
  }

  .content-sections {
    height: 100%;
    width: 100%;
    display: flex;
    padding: 0;
    margin: 0;
  }

  .loading { 
    display: flex; 
    flex-direction: column; 
    align-items: center; 
    justify-content: center;
    height: 100%;
    width: 100%;
  }

  .spinner {
    border: 4px solid rgba(0, 0, 0, 0.1);
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border-left-color: #5361AA;
    animation: spin 1s linear infinite;
    margin-top: 10px;
  }

  @keyframes spin { 
    0% { transform: rotate(0deg); } 
    100% { transform: rotate(360deg); } 
  }
</style>