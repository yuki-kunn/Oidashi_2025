<script lang="ts">
  import { onMount } from 'svelte';
  import { fetchHistoryList } from '$lib/supabaseFunction';

  interface History {
    id: number;
    event: string;
    detail: string;
    safety_level: string | number;
    day: string; 
  }

  let historyList: History[] = [];
  let isLoading = true;

  const getHistoryList = async () => {
    isLoading = true;
    try {
      const data = await fetchHistoryList();
      historyList = data || [];
    } catch (error) {
      console.error('履歴の取得中にエラーが発生しました:', error);
    } finally {
      isLoading = false;
    }
  };


  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(date);
    } catch (e) {
      return dateString; 
    }
  };

  const getSafetyLevelColor = (level: string | number) => {
    const numLevel = typeof level === 'string' ? parseInt(level, 10) : level;
    
    if (isNaN(numLevel)) return 'gray';
    
    if (numLevel >= 8) return 'red';
    if (numLevel >= 5) return 'orange';
    if (numLevel >= 3) return 'yellow';
    return 'green';
  };

  onMount(getHistoryList);
</script>

<style>
  .history-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }

  .history-card {
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    padding: 1rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease-in-out;
  }

  .history-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  .history-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .event-title {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
  }

  .history-date {
    font-size: 0.875rem;
    color: #64748b;
  }

  .history-detail {
    margin-top: 0.5rem;
    font-size: 0.9375rem;
    line-height: 1.5;
  }

  .safety-level {
    display: inline-block;
    padding: 0.25rem 0.5rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 500;
    color: white;
  }

  .loading {
    text-align: center;
    padding: 2rem;
    color: #64748b;
  }

  .no-results {
    text-align: center;
    padding: 2rem;
    color: #64748b;
    font-style: italic;
  }
</style>

<div class="history-list">
  {#if isLoading}
    <div class="loading">読み込み中...</div>
  {:else if historyList.length > 0}
    {#each historyList as history (history.id)}
      <div class="history-card">
        <div class="history-header">
          <h2 class="event-title">{history.event}</h2>
          <span 
            class="safety-level" 
            style="background-color: {getSafetyLevelColor(history.safety_level)}">
            安全レベル: {history.safety_level}
          </span>
        </div>
        <div class="history-date">{formatDate(history.day)}</div>
        <p class="history-detail">{history.detail}</p>
      </div>
    {/each}
  {:else}
    <div class="no-results">履歴が見つかりませんでした。</div>
  {/if}
</div>
