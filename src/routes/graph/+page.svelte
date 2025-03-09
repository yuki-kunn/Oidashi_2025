<script lang="ts">
  import { onMount } from 'svelte';
  import Header from "../../lib/Header.svelte";
  import Footer from "../../lib/Footer.svelte";
  import "../../app.css";
  import { fetchHistoryList } from '$lib/supabaseFunction';

  // 型定義
  interface History {
    id: number;
    event: string;
    detail: string;
    safety_level: string | number; // 部活動状態レベル
    day: string; 
  }

  interface MarkerInfo {
    name: string;
    description: string;
    level: string | number;
    currentScore: number;
  }

  // 状態変数
  let historyList: History[] = [];
  let isLoading = true;
  let chart: any;
  let chartElement: HTMLElement;
  let markers: MarkerInfo[] = [];
  const initialScore = 4; // 初期持ち点を4点に修正

  // グラフデータ準備と表示
  function setupChartData(data: History[]) {
    // 日付でソートしたデータを準備
    const sortedData = [...data].sort((a, b) => 
      new Date(a.day).getTime() - new Date(b.day).getTime()
    );
    
    // 初期データを追加
    const initialData: History = {
      id: 0,
      event: "活動の始まり",
      detail: "何から始めよう・・・",
      safety_level: 0,
      day: sortedData.length > 0 ? 
        new Date(Math.min(...sortedData.map(d => new Date(d.day).getTime())) - 86400000).toISOString().split('T')[0] : 
        new Date().toISOString().split('T')[0]
    };
    
    // 初期データを配列の先頭に追加
    sortedData.unshift(initialData);
    
    let currentScore = 0; // 初期スコアを0に設定（初期データのため）
    const scores = [currentScore]; // 初期スコアを記録
    const categories = [formatDate(initialData.day)]; // 初期データの日付を記録
    
    // 2番目のデータ以降の処理
    for (let i = 1; i < sortedData.length; i++) {
      const item = sortedData[i];
      categories.push(formatDate(item.day));

      // safety_level を数値に変換
      const safetyLevel = typeof item.safety_level === 'string'
        ? parseFloat(item.safety_level)
        : Number(item.safety_level);
      
      // 値をそのまま加算（プラスの値は加算、マイナスの値は減算）
      currentScore += safetyLevel;
      
      // スコアを上限・下限に制限
      currentScore = Math.max(-10, Math.min(10, currentScore));
      
      // スコアを記録
      scores.push(currentScore);
    }

    // イベント詳細のためのマーカー情報
    markers = sortedData.map((item, index) => ({
      name: item.event || '不明なイベント',
      description: item.detail || '詳細なし',
      level: item.safety_level,
      currentScore: scores[index]
    }));

    return { categories, scores };
  }

  // グラフ設定を生成する関数
  function getChartOptions(categories: string[], scores: number[]) {
    return {
      series: [{
        name: '部活動の状態',
        data: scores
      }],
      chart: {
        height: 400,
        type: 'line',
        zoom: { enabled: false },
        toolbar: { show: false },
        animations: { enabled: true, easing: 'easeinout', speed: 800 },
        background: '#f8f9fa'
      },
      colors: ['#5361AA'],
      stroke: { curve: 'smooth', width: 3 },
      title: {
        text: '部活動状態変動チャート',
        align: 'center',
        style: { fontSize: '18px', fontWeight: 600 }
      },
      grid: {
        row: { colors: ['#f3f3f3', 'transparent'], opacity: 0.5 },
        borderColor: '#e0e0e0',
        strokeDashArray: 5
      },
      markers: {
        size: 6,
        strokeWidth: 0,
        hover: { size: 8 }
      },
      xaxis: {
        categories,
        labels: { style: { fontSize: '12px' } }
      },
      yaxis: {
        title: { text: '部活動スコア' },
        min: -10,  // 下限を-5に固定
        max: 10,   // 上限を5に固定
        tickAmount: 5,
        forceNiceScale: false,
        axisBorder: { show: true },
        axisTicks: { show: true },
        crosshairs: { show: true }
      },
      tooltip: {
        shared: true,
        intersect: false,
        custom: (options: any) => {
          const idx = options.dataPointIndex;
          if (idx >= 0 && idx < markers.length) {
            const marker = markers[idx];
            const date = options.w.globals.labels[idx];
            const changeText = Number(marker.level) > 0 ? `+${marker.level}` : marker.level;
            
            return `
              <div class="custom-tooltip">
                <div class="tooltip-title">${marker.name}</div>
                <div class="tooltip-date">${date}</div>
                <div class="tooltip-level">変動: ${changeText}</div>
                <div class="tooltip-score">部活動スコア: ${marker.currentScore}</div>
                <div class="tooltip-detail">${marker.description}</div>
              </div>
            `;
          }
          return '';
        }
      },
      annotations: {
        yaxis: [{
          y: 0,
          borderColor: '#999',
          label: {
            text: '初期スコア (0点)',
            style: { color: '#333', background: '#ffeb3b' }
          }
        }]
      },
      theme: {
        mode: 'light',
        palette: 'palette1'
      }
    };
  }

  // データを取得してグラフを更新
  const getHistoryList = async () => {
    isLoading = true;
    try {
      // Supabaseからすべてのデータを取得
      const data = await fetchHistoryList();
      
      if (data && data.length > 0) {
        historyList = data;
        setTimeout(updateChartData, 100);
      } else {
        console.error('データが見つかりませんでした');
      }
    } catch (error) {
      console.error('履歴の取得中にエラーが発生しました:', error);
    } finally {
      isLoading = false;
    }
  };

  // グラフを更新
  const updateChartData = () => {
    if (typeof window === 'undefined') return;
    
    import('apexcharts').then((ApexChartsModule) => {
      const ApexCharts = ApexChartsModule.default;
      const { categories, scores } = setupChartData(historyList);
      const options = getChartOptions(categories, scores);

      if (chart) chart.destroy();
      
      if (chartElement) {
        chart = new ApexCharts(chartElement, options);
        chart.render();
      }
    }).catch(err => {
      console.error("ApexChartsのロード中にエラーが発生しました:", err);
    });
  };

  // 日付フォーマット
  const formatDate = (dateString: string) => {
    try {
      return new Intl.DateTimeFormat('ja-JP', {
        year: 'numeric', month: 'numeric', day: 'numeric'
      }).format(new Date(dateString));
    } catch (e) {
      return dateString; 
    }
  };

  onMount(() => {
    getHistoryList();
    return () => { if (chart) chart.destroy(); };
  });
</script>

<div class="page-container">
  <Header />
  <main class="main-content">
    <div class="graph-container">
      <h1>部活動状態グラフ</h1>
      
      {#if isLoading}
        <div class="loading">
          <p>データを読み込み中...</p>
          <div class="spinner"></div>
        </div>
      {:else if historyList.length > 0}
        <div bind:this={chartElement} id="activity-chart"></div>
        <div class="legend">
          {#each [['好調 (3~5)', 'good'], ['通常 (0~2)', 'normal'], ['不調 (-5~-1)', 'bad']] as [label, className]}
            <div class="legend-item">
              <div class="legend-color {className}"></div>
              <span>{label}</span>
            </div>
          {/each}
        </div>
      {:else}
        <div class="no-data">
          <p>グラフを表示するデータがありません。</p>
        </div>
      {/if}
    </div>
  </main>
  <Footer />
</div>

<style>
  .page-container { width: 100vw; height: 100vh; display: flex; flex-direction: column; overflow: hidden; }
  .main-content { flex: 1; background-color: #f5f5f5; padding: 20px; overflow-y: auto; }
  .graph-container {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 20px;
    max-width: 1000px;
    margin: 0 auto;
  }
  h1 { text-align: center; color: #333; margin-bottom: 20px; font-size: 1.5rem; }
  
  .loading { display: flex; flex-direction: column; align-items: center; padding: 40px 0; }
  .spinner {
    border: 4px solid rgba(0, 0, 0, 0.1);
    width: 36px; height: 36px;
    border-radius: 50%;
    border-left-color: #5361AA;
    animation: spin 1s linear infinite;
    margin-top: 10px;
  }
  @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  
  .no-data { text-align: center; padding: 40px 0; color: #666; }
  .legend { display: flex; justify-content: center; gap: 20px; margin-top: 20px; }
  .legend-item { display: flex; align-items: center; gap: 5px; }
  .legend-color { width: 16px; height: 16px; border-radius: 4px; }
  .good { background-color: #69db7c; }
  .normal { background-color: #ffa94d; }
  .bad { background-color: #ff6b6b; }
  
  /* カスタムツールチップ */
  :global(.custom-tooltip) {
    background: #fff;
    border-radius: 5px;
    padding: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    max-width: 250px;
  }
  :global(.tooltip-title) { font-weight: bold; margin-bottom: 5px; color: #333; }
  :global(.tooltip-date) { font-size: 12px; color: #666; margin-bottom: 5px; }
  :global(.tooltip-level) { font-weight: bold; color: #5361AA; margin-bottom: 5px; }
  :global(.tooltip-detail) { font-size: 12px; line-height: 1.4; }
  :global(.tooltip-score) { font-weight: bold; color: #5361AA; margin-bottom: 5px; }
  
  #activity-chart { width: 100%; margin: 0 auto; }
</style>