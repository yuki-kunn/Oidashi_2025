<script lang="ts">
  import { onMount } from 'svelte';

  // 型定義
  interface History {
    id: number;
    event: string;
    detail: string;
    safety_level: string | number;
    day: string; 
  }

  interface MarkerInfo {
    name: string;
    description: string;
    level: string | number;
    currentScore: number;
  }

  export let historyList: History[] = [];
  let chart: any;
  let chartElement: HTMLElement;
  let markers: MarkerInfo[] = [];

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
    
    let currentScore = 0; // 初期スコアを0に設定
    const scores = [currentScore];
    const categories = [formatDate(initialData.day)];
    
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
      currentScore = Math.max(-5, Math.min(5, currentScore));
      
      // スコアを記録
      scores.push(currentScore);
    }

    // マーカー情報を設定
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
        height: '100%',
        type: 'line',
        zoom: { enabled: false },
        toolbar: { show: false },
        animations: { enabled: true, easing: 'easeinout', speed: 800 },
        background: 'transparent'
      },
      colors: ['#FF00FF'], // ビビッドな赤紫（マゼンタ）に変更
      stroke: { 
        curve: 'smooth', 
        width: 8  // 線の太さを8に増加
      },
      title: {
        text: '',  // タイトルを削除
        align: 'center',
        style: { fontSize: '18px', fontWeight: 600 }
      },
      grid: {
        show: false,
        padding: {
          top: 0,
          right: 20,
          bottom: 0,
          left: 20
        },
        row: { colors: ['#f3f3f3', 'transparent'], opacity: 0.5 },
        borderColor: '#e0e0e0',
        strokeDashArray: 5
      },
      markers: {
        size: 8,
        colors: ['#FF00FF'],
        strokeWidth: 2,
        strokeColors: '#FFFFFF',
        hover: {
          size: 10,
          sizeOffset: 3
        }
      },
      xaxis: {
        categories,
        labels: { 
          show: false  // X軸の日付を完全に非表示に
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
        crosshairs: { show: false }  // X軸のクロスヘアも非表示に
      },
      yaxis: {
        title: { text: '' }, // Y軸のタイトルを削除
        min: -5,
        max: 5,
        tickAmount: 5,
        forceNiceScale: false,
        axisBorder: { show: false },
        axisTicks: { show: false },
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
                <div class="tooltip-level">変動: ${changeText}</div>
                <div class="tooltip-score">部活動スコア: ${marker.currentScore}</div>
                <div class="tooltip-detail">${marker.description}</div>
                <div class="tooltip-date">${date}</div>
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

  $: if (historyList.length > 0) {
    setTimeout(updateChartData, 100);
  }

  onMount(() => {
    return () => { if (chart) chart.destroy(); };
  });
</script>

<div class="chart-container">
  <div bind:this={chartElement} id="activity-chart"></div>
</div>

<style>
  .chart-container {
    background-color: transparent;
    width: 100%;
    height: 100%;
    min-width: 5000px;  /* さらに横幅を拡大 */
    padding: 0;
    margin: 0;
    display: flex;
    align-items: stretch;
    overflow: hidden;  /* スクロールバーを非表示に */
  }
  
  #activity-chart { 
    flex: 1;
    margin: 0;
    padding: 0;
    overflow: hidden;  /* スクロールバーを非表示に */
  }

  /* カスタムツールチップ */
  :global(.custom-tooltip) {
    background: #fff;
    border-radius: 5px;
    padding: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    max-width: 250px;
    border-left: 4px solid #FF00FF;
  }
  :global(.tooltip-title) { font-weight: bold; margin-bottom: 5px; color: #333; }
  :global(.tooltip-date) { font-size: 12px; color: #666; margin-bottom: 5px; }
  :global(.tooltip-level) { font-weight: bold; color: #FF00FF; margin-bottom: 5px; }
  :global(.tooltip-detail) { font-size: 12px; line-height: 1.4; }
  :global(.tooltip-score) { font-weight: bold; color: #FF00FF; margin-bottom: 5px; }
</style>