<script lang="ts">
    import { onMount } from 'svelte';
    import { fetchBtyList } from '$lib/supabaseFunction';
  
    interface Bty {
      id: number;
      name: string;
    }
  
    let btyList: Bty[] = [];
    let isLoading = true;
  
    const getBtyList = async () => {
      isLoading = true;
      try {
        const data = await fetchBtyList();
        btyList = data || [];
      } catch (error) {
        console.error('履歴の取得中にエラーが発生しました:', error);
      } finally {
        isLoading = false;
      }
    };
  
    onMount(getBtyList);
  </script>
  
  <style>
    .bty-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 1rem;
    }
  
    .bty-card {
      border: 1px solid #e2e8f0;
      border-radius: 0.5rem;
      padding: 1rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s ease-in-out;
    }
  
    .bty-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }
  
    .bty-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }
  
    .name-title {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 600;
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
  
  <div class="bty-list">
    {#if isLoading}
      <div class="loading">読み込み中...</div>
    {:else if btyList.length > 0}
      {#each btyList as bty (bty.id)}
        <div class="bty-card">
          <div class="bty-header">
            <h2 class="name-title">{bty.name}</h2>
          </div>
        </div>
      {/each}
    {:else}
      <div class="no-results">履歴が見つかりませんでした。</div>
    {/if}
  </div>
  