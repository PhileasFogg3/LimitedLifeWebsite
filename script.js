// --- UUID → Player Name mapping ---
function uuidToName(uuid) {
    switch (uuid) {
      case "47815705-19f5-4fee-851b-2d6e828a41f4": return "Mewhen123";
      case "28545a7d-257a-47b5-99aa-aed33aea1faf": return "ItsGeppy";
      case "ce5a9196-e1ac-4418-aae1-5608998b4292": return "Nikatto";
      case "a97c8875-fbaf-4028-9c20-641e009fbec7": return "fandome";
      case "13b48133-34e3-4549-aa66-a314a2580af8": return "PhileasFogg3";
      case "e74f7336-21b5-4ff7-8924-cae6d6ebc8b8": return "willfreckles";
      case "baceb77d-8bb4-45c6-8d54-1a0d352366ac": return "FatArmadillo";
      case "9efe16d0-0fce-4d4c-9c6b-e057b6df53f6": return "OweeWan";
      case "c660b9d5-3ad2-4090-b871-da945a2c68a1": return "jbk1000009";
      case "ce652404-6b3b-4395-b60e-14ad894e623d": return "Sweetlittlebee02";
      case "dbd73e85-fb0b-4d38-92e6-5cf42c192813": return "JHWAFC";
      case "0f830996-e88c-43cc-96ef-88a821924692": return "miguelrde";
      default: return uuid;
    }
  }
  
  async function loadPlayers() {
    const res = await fetch("players.yml");
    const yamlText = await res.text();
    const data = jsyaml.load(yamlText);

    const players = [];
    for (const [uuid, p] of Object.entries(data.players)) {
      const name = uuidToName(uuid);
      players.push({
        uuid,
        name,
        time: p.Time,
        life: p.Life,
        deaths: p.Deaths || [],
        kills: p.Kills || []
      });
    }    
  
    render(players);
  }
  
  function formatTime(seconds) {
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  }
  
  function render(players) {
    // --- TROPHIES ---
    const mostTime = players.reduce((a,b) => a.time > b.time ? a : b);
    const leastTime = players.reduce((a,b) => a.time < b.time ? a : b);
    const mostKills = players.reduce((a,b) => a.kills.length > b.kills.length ? a : b);
    const mostDeaths = players.reduce((a,b) => a.deaths.length > b.deaths.length ? a : b);
  
    const trophiesDiv = document.getElementById("trophies");
    trophiesDiv.innerHTML = `
      <div class="trophy">
        🏆 Most Time Left: ${mostTime.name}
        <img src="resources/player_heads/${mostTime.name}.png" alt="${mostTime.name}" width="24" height="24">
      </div>
      <div class="trophy">
        🏆 Most Kills: ${mostKills.name}
        <img src="resources/player_heads/${mostKills.name}.png" alt="${mostKills.name}" width="24" height="24">
      </div>
      <div class="trophy">
        🏆 Most Deaths: ${mostDeaths.name}
        <img src="resources/player_heads/${mostDeaths.name}.png" alt="${mostDeaths.name}" width="24" height="24">
      </div>
      <div class="trophy">
        🏆 Least Time Left: ${leastTime.name}
        <img src="resources/player_heads/${leastTime.name}.png" alt="${leastTime.name}" width="24" height="24">
      </div>
    `;    
  
    // --- PLAYERS ---
    const playersDiv = document.getElementById("players");
    playersDiv.innerHTML = "";
  
    players.forEach(p => {
      const div = document.createElement("div");
      div.className = `player-card life-${p.life}`;
      div.innerHTML = `
      <div class="player-header">
        <img src="resources/player_heads/${p.name}.png" alt="${p.name}" width="48" height="48">
        <h2>${p.name}</h2>
      </div>
      <div class="player-body">
        <div class="player-left">
          <p>${formatTime(p.time)}</p>
          <p>Deaths: ${p.deaths.length}</p>
          <p>Kills: ${p.kills.length}</p>
        </div>
        <div class="player-right">
          ${p.deaths.length ? `<p><b>Killed By:</b><br>${p.deaths.join("<br>")}</p>` : ""}
          ${p.kills.length ? `<p><b>Killed:</b><br>${p.kills.join("<br>")}</p>` : ""}
        </div>
      </div>
    `;    
      playersDiv.appendChild(div);
    });
  }
  
  loadPlayers();
  