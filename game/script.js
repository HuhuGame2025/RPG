// 切換側邊欄顯示
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');

    if (sidebar.style.left === "0px") {
        sidebar.style.left = "-300px"; // 隱藏
        sidebarToggle.innerHTML = "="; // 顯示開啟圖示
    } else {
        sidebar.style.left = "0"; // 顯示
        sidebarToggle.innerHTML = "="; // 顯示關閉圖示
    }
}

// 返回上一頁
function goBack() {
    window.history.back(); 
}

// 增加 HP
function increaseHP(amount) {
    const playerHP = parseInt(document.getElementById("playerHP").textContent);
    const maxHP = parseInt(document.getElementById("playerMaxHP").textContent);
    let newHP = playerHP + amount;
    // 確保不會超過最大 HP
    if (newHP > playerMaxHP) {
        newHP = playerMaxHP;
    }
    document.getElementById("playerHP").textContent = newHP; // 更新頁面上的 HP
    localStorage.setItem("playerHP", newHP); // 儲存 HP
}

// 減少 HP
function decreaseHP(amount) {
    const playerHP = parseInt(document.getElementById("playerHP").textContent);
    let newHP = playerHP - amount;
    // 確保 HP 不會低於 0
    if (newHP < 0) {
        newHP = 0;
    }
    document.getElementById("playerHP").textContent = newHP; // 更新頁面上的 HP
    localStorage.setItem("playerHP", newHP); // 儲存 HP
}

// 回滿隊伍 HP
function resetHP() {
    const playerMaxHP = parseInt(document.getElementById("playerMaxHP").textContent);
    document.getElementById("playerHP").textContent = playerMaxHP; // 設置為最大 HP
    localStorage.setItem("playerHP", playerMaxHP); // 儲存玩家的 HP

    // 讀取所有已雇用的同伴
    let hiredCompanions = JSON.parse(localStorage.getItem("hiredCompanions")) || [];

    // 遍歷所有同伴，將每個同伴的 HP 設置為最大 HP
    hiredCompanions.forEach((companion, index) => {
        companion.HP = companion.MaxHP; // 將同伴的 HP 設為最大 HP
        localStorage.setItem("hiredCompanions", JSON.stringify(hiredCompanions)); // 儲存更新後的同伴資料
        
        // 更新頁面上對應同伴的 HP 顯示
        document.getElementById(`companion${index + 1}-HP`).textContent = companion.HP;
    });
}

// 讀取隊伍資料
function getPartyData(){
    // 讀取主角資料
    const playerName = localStorage.getItem("playerName");
    const playerCon = parseInt(localStorage.getItem("playerCon"));
    const playerStr = parseInt(localStorage.getItem("playerStr"));
    const playerDex = parseInt(localStorage.getItem("playerDex"));
    const playerMaxHP = parseInt(localStorage.getItem("playerMaxHP"));
    let playerHP = parseInt(localStorage.getItem("playerHP"));

    // 顯示主角資料
    if (document.getElementById("playerName")) {
        document.getElementById("playerName").textContent = playerName;
    }
    if (document.getElementById("playerHP")) {
    document.getElementById("playerHP").textContent = playerHP;
    }
    if (document.getElementById("playerMaxHP")) {
    document.getElementById("playerMaxHP").textContent = playerMaxHP;
    }
    if (document.getElementById("playerStr")) {
        document.getElementById("playerStr").textContent = playerStr;
    }
    if (document.getElementById("playerDex")) {
        document.getElementById("playerDex").textContent = playerDex;
    }
    if (document.getElementById("playerCon")) {
        document.getElementById("playerCon").textContent = playerCon;
    }

    // 讀取已雇用的同伴資料
    let hiredCompanions = JSON.parse(localStorage.getItem("hiredCompanions")) || [];

    hiredCompanions.forEach((comp, index) => {
        let compPrefix = `companion${index + 1}`;
        let compItem = document.getElementById(compPrefix);

        // 顯示同伴資料
        if (compItem) {
            compItem.style.display = "block"; // 顯示已雇用的同伴區域
            if (document.getElementById(`${compPrefix}-name`)) {
                document.getElementById(`${compPrefix}-name`).textContent = comp.name;
            }
            if (document.getElementById(`${compPrefix}-MaxHP`)) {
                document.getElementById(`${compPrefix}-MaxHP`).textContent = comp.MaxHP;
            }
            if (document.getElementById(`${compPrefix}-HP`)) {
                document.getElementById(`${compPrefix}-HP`).textContent = comp.HP;
            }
            if (document.getElementById(`${compPrefix}-Str`)) {
                document.getElementById(`${compPrefix}-Str`).textContent = comp.Str;
            }
            if (document.getElementById(`${compPrefix}-Dex`)) {
                document.getElementById(`${compPrefix}-Dex`).textContent = comp.Dex;
            }
            if (document.getElementById(`${compPrefix}-Con`)) {
                document.getElementById(`${compPrefix}-Con`).textContent = comp.Con;
            }
        }
    });
}

// 讀取資金
function getPlayerMoney() {
    let playerMoney = parseInt(localStorage.getItem("playerMoney")) || 0;
    document.getElementById('playerMoney').textContent = playerMoney;
}

// 讀取名聲
function getPlayerFame() {
    let playerFame = parseInt(localStorage.getItem("playerFame"));
    document.getElementById("playerFame").textContent = playerFame;
}

