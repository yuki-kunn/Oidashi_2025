<script lang="ts">
    import { onMount } from 'svelte';
    import { fetchOrgList } from '$lib/supabaseFunction';
  
    interface Org {
      id: number;
      name: string;
    }
  
    let orgList: Org[] = [];
    let isLoading = true;
  
    const getOrgList = async () => {
      isLoading = true;
      try {
        const data = await fetchOrgList();
        orgList = data || [];
      } catch (error) {
        console.error('履歴の取得中にエラーが発生しました:', error);
      } finally {
        isLoading = false;
      }
    };
  
    onMount(getOrgList);
  </script>
  
  <style>
    .org-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 1rem;
    }
  
    .org-card {
      border: 1px solid #e2e8f0;
      border-radius: 0.5rem;
      padding: 1rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s ease-in-out;
    }
  
    .org-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }
  
    .org-header {
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
  
  <div class="org-list">
    {#if isLoading}
      <div class="loading">読み込み中...</div>
    {:else if orgList.length > 0}
      {#each orgList as org (org.id)}
        <div class="org-card">
          <div class="org-header">
            <h2 class="name-title">{org.name}</h2>
          </div>
        </div>
      {/each}
    {:else}
      <div class="no-results">履歴が見つかりませんでした。</div>
    {/if}
  </div>
  