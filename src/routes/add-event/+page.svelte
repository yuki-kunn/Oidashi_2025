<script lang="ts">
  import "../../app.css";
  import Header from "../../lib/Header.svelte";
  import Footer from "../../lib/Footer.svelte";
  import { goto } from '$app/navigation';

  interface ExternalOrganization {
    id: number;
    name: string;
  }

  // テスト用の外部団体データ
  const externalOrganizations: ExternalOrganization[] = [
    { id: 1, name: "テスト団体A" },
    { id: 2, name: "テスト団体B" },
    { id: 3, name: "テスト団体C" },
    { id: 4, name: "テスト団体D" },
  ];

  let eventName = "";
  let eventDate = "";
  let eventDescription = ""; // 追加
  let eventPhoto: File | null = null;
  let selectedOrganizations: number[] = [];
  let memberScale = "";
  let isBadEvent = false;

  function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    // TODO: フォームの送信処理を実装
    console.log({
      eventName,
      eventDate,
      eventDescription, // 追加
      eventPhoto,
      selectedOrganizations,
      memberScale,
      isBadEvent
    });
  }

  function handleFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      eventPhoto = input.files[0];
    }
  }

  function handleGoBack() {
    goto('/');
  }
</script>

<div class="page-container">
  <main class="main-content">
    <div class="content">
      <h1>イベント追加</h1>
      <form on:submit={handleSubmit} class="event-form">
        <div class="form-group">
          <div class="form-row">
            <label for="eventName">イベント名</label>
            <div class="input-container">
              <input 
                type="text" 
                id="eventName" 
                bind:value={eventName} 
                required
              >
            </div>
          </div>
        </div>

        <div class="form-group">
          <div class="form-row">
            <label for="eventDate">イベントの日付</label>
            <div class="input-container">
              <input 
                type="date" 
                id="eventDate" 
                bind:value={eventDate} 
                required
              >
            </div>
          </div>
        </div>

        <div class="form-group">
          <div class="form-row">
            <label for="eventDescription">イベント概要</label>
            <div class="input-container">
              <textarea
                id="eventDescription"
                bind:value={eventDescription}
                rows="4"
                placeholder="イベントの詳細を入力してください"
                required
              ></textarea>
            </div>
          </div>
        </div>

        <div class="form-group">
          <div class="form-row">
            <label for="eventPhoto">イベントの写真</label>
            <div class="input-container">
              <input 
                type="file" 
                id="eventPhoto" 
                accept="image/*"
                on:change={handleFileChange}
              >
            </div>
          </div>
        </div>

        <div class="form-group">
          <div class="form-row">
            <span id="organizations-label">関わった外部団体<br>（複数選択可）</span>
            <div class="input-container">
              <div class="checkbox-group" role="group" aria-labelledby="organizations-label">
                {#each externalOrganizations as org}
                  <label class="checkbox-label">
                    <input
                      type="checkbox"
                      value={org.id}
                      bind:group={selectedOrganizations}
                    >
                    {org.name}
                  </label>
                {/each}
              </div>
            </div>
          </div>
        </div>

        <div class="form-group">
          <div class="form-row">
            <label for="memberScale">部員規模</label>
            <div class="input-container">
              <select 
                id="memberScale" 
                bind:value={memberScale} 
                required
              >
                <option value="">選択してください</option>
                <option value="1">1人</option>
                <option value="2-5">2〜5人</option>
                <option value="6-10">6〜10人</option>
                <option value="11-20">11〜20人</option>
                <option value="21-50">21〜50人</option>
                <option value="50+">50人以上</option>
              </select>
            </div>
          </div>
        </div>

        <div class="form-group">
          <div class="form-row">
            <label for="isBadEvent" class="checkbox-label-text">悪い出来事か？</label>
            <div class="input-container">
              <label class="checkbox-label">
                <input
                  type="checkbox"
                  id="isBadEvent"
                  bind:checked={isBadEvent}
                >
              </label>
            </div>
          </div>
        </div>

        <div class="button-group">
          <button type="button" class="back-button" on:click={handleGoBack}>戻る</button>
          <button type="submit" class="submit-button">登録</button>
        </div>
      </form>
    </div>
  </main>
</div>

<style>
  .page-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  .main-content {
    flex: 1;
    overflow-y: scroll;
    padding: 15px 0;
    background-color: #f5f5f5;
    scrollbar-gutter: stable;
  }

  .content {
    width: 100%;
    max-width: 700px;
    margin: 0 auto;
    padding: 0 15px;
  }

  h1 {
    color: #333;
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  .event-form {
    background-color: white;
    padding: 15px;
    border-radius: 6px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .form-group {
    margin-bottom: 12px;
  }

  .form-row {
    display: flex;
    align-items: flex-start;
    gap: 12px;
  }

  .form-row label,
  .form-row span {
    flex: 0 0 100px;
    padding-top: 4px;
    font-size: 0.85rem;
  }

  .input-container {
    flex: 1;
  }

  .checkbox-label-text {
    font-weight: bold;
    color: #333;
    font-size: 0.85rem;
  }

  label {
    display: block;
    margin-bottom: 4px;
    font-weight: bold;
    color: #333;
    font-size: 0.85rem;
  }

  input[type="text"],
  input[type="date"],
  select,
  textarea {
    width: 100%;
    padding: 4px 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 0.85rem;
  }

  input[type="file"] {
    width: 100%;
    padding: 4px 0;
    font-size: 0.85rem;
  }

  textarea {
    resize: vertical;
    min-height: 60px;
    max-height: 120px;
    font-family: inherit;
  }

  .checkbox-group {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .checkbox-label {
    display: flex;
    align-items: center;
    gap: 3px;
    font-weight: normal;
    font-size: 0.85rem;
  }

  .button-group {
    display: flex;
    gap: 10px;
    margin-top: 16px;
  }

  .submit-button, .back-button {
    flex: 1;
    padding: 6px 12px;
    border: none;
    border-radius: 4px;
    font-size: 0.85rem;
    cursor: pointer;
  }

  .submit-button {
    background-color: #07d400;
    color: white;
  }

  .submit-button:hover {
    background-color: #06b100;
  }

  .back-button {
    background-color: #e0e0e0;
    color: #333;
  }

  .back-button:hover {
    background-color: #d0d0d0;
  }
</style>
