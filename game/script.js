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

// 往下滑動時，隱藏按鈕列
    let lastScrollTop = 0;
    const buttonBar = document.getElementById("buttonBar");

    window.addEventListener("scroll", function() {
        let currentScroll = window.scrollY;

        if (currentScroll > lastScrollTop) {
            // 向下滾動 -> 隱藏按鈕列
            buttonBar.classList.add("hidden");
        } else {
            // 向上滾動 -> 顯示按鈕列
            buttonBar.classList.remove("hidden");
        }

        lastScrollTop = currentScroll;
    });

// 返回上一頁
function goBack() {
    window.history.back(); 
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
    const playerType = localStorage.getItem("playerType");
    const playerCon = parseInt(localStorage.getItem("playerCon"));
    const playerStr = parseInt(localStorage.getItem("playerStr"));
    const playerDex = parseInt(localStorage.getItem("playerDex"));
    const playerMaxHP = parseInt(localStorage.getItem("playerMaxHP"));
    let playerHP = parseInt(localStorage.getItem("playerHP"));

    // 顯示主角資料
    if (document.getElementById("playerName")) {
        document.getElementById("playerName").textContent = playerName;
    }
    if (document.getElementById("playerType")) {
        document.getElementById("playerType").textContent = playerType;
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
            if (document.getElementById(`${compPrefix}-type`)) {
                document.getElementById(`${compPrefix}-type`).textContent = comp.type;
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

// 將隊伍加入出戰隊伍
function partyToTeamber(){
    let teamMember = []; // 出戰隊伍
    
    // 讀取主角資料
    const playerName = localStorage.getItem("playerName");
    const playerType = localStorage.getItem("playerType");
    const playerCon = parseInt(localStorage.getItem("playerCon"));
    const playerStr = parseInt(localStorage.getItem("playerStr"));
    const playerDex = parseInt(localStorage.getItem("playerDex"));
    const playerMaxHP = parseInt(localStorage.getItem("playerMaxHP"));
    let playerHP = parseInt(localStorage.getItem("playerHP"));

    // 讀取同伴資料
    let hiredCompanions = JSON.parse(localStorage.getItem("hiredCompanions")) || [];
    
    // 將主角加入出戰隊伍
    teamMember = [{
        name: playerName,
        id: "player",
        type: playerType,
        HPid: "playerHP",
        HP: playerHP,
        MaxHP: playerMaxHP,
        str: playerStr,
        dex: playerDex,
        con: playerCon,
        description: "",
    }];

    // 將所有同伴加入出戰隊伍
    hiredCompanions.forEach((companion, index) => {
        teamMember.push({
            name: companion.name,
            id: `companion${index + 1}`,
            type: companion.type,
            HPid: `companion${index + 1}-HP`,
            HP: companion.HP,
            MaxHP: companion.MaxHP,
            str: companion.Str,
            dex: companion.Dex,
            con: companion.Con,
            description: companion.description,
        });
    });

    // 儲存出戰成員
    localStorage.setItem("teamMember", JSON.stringify(teamMember));

    teamMember.forEach((member, index) => {
        let memberId = `member${index + 1}`;
        let memberItem = document.getElementById(memberId);

        // 顯示成員資料
        if (memberItem) {
            memberItem.style.display = "block"; // 顯示存在的成員區域
            if (document.getElementById(`${memberId}-name`)) {
                document.getElementById(`${memberId}-name`).textContent = member.name;
            }
            if (document.getElementById(`${memberId}-type`)) {
                document.getElementById(`${memberId}-type`).textContent = member.type;
            }
            if (document.getElementById(`${memberId}-MaxHP`)) {
                document.getElementById(`${memberId}-MaxHP`).textContent = member.MaxHP;
            }
            if (document.getElementById(`${memberId}-HP`)) {
                document.getElementById(`${memberId}-HP`).textContent = member.HP;
            }
            if (document.getElementById(`${memberId}-Con`)) {
                document.getElementById(`${memberId}-Con`).textContent = member.Con;
            }
            if (document.getElementById(`${memberId}-Str`)) {
                document.getElementById(`${memberId}-Str`).textContent = member.Str;
            }
            if (document.getElementById(`${memberId}-Dex`)) {
                document.getElementById(`${memberId}-Dex`).textContent = member.Dex;
            }
            if (document.getElementById(`${memberId}-description`)) {
                document.getElementById(`${memberId}-description`).textContent = member.description;
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

// 同伴加入隊伍
function addCompanion(companion) {
    // 讀取所有同伴的資料
    let hiredCompanions = JSON.parse(localStorage.getItem("hiredCompanions")) || [];

    // 如果有形容詞，則加到名字前面
    let companionName = companion.adj ? `${companion.adj}${companion.name}` : companion.name;

    // 添加同伴資料並設定初始的HP和MaxHP
    hiredCompanions.push({
        name: companionName, // 加入處理後的名字
        type: companion.type,
        description: companion.description,
        Con: companion.Con,
        Str: companion.Str,
        Dex: companion.Dex,
        MaxHP: companion.Con * 2, // MaxHP
        HP: companion.Con * 2, // 初始HP
    });

    // 儲存
    localStorage.setItem("hiredCompanions", JSON.stringify(hiredCompanions));
}

// 同伴離開隊伍
function removeCompanion(companionId) {
    // 讀取同伴資料
    let hiredCompanions = JSON.parse(localStorage.getItem("hiredCompanions")) || [];

    // 提取數字部分並減去 1，來取得在 hiredCompanions 的索引
    const companionIndex = parseInt(companionId.replace("companion", "")) - 1;

    // 確保索引有效
    if (companionIndex >= 0 && companionIndex < hiredCompanions.length) {
        // 刪除指定索引的同伴
        hiredCompanions.splice(companionIndex, 1);

        // 更新 localStorage
        localStorage.setItem("hiredCompanions", JSON.stringify(hiredCompanions));

        // 同時更新出戰成員，確保也能從隊伍中移除
        let teamMember = JSON.parse(localStorage.getItem("teamMember")) || [];
        teamMember = teamMember.filter(member => member.id !== companionId);
        localStorage.setItem("teamMember", JSON.stringify(teamMember));
    }
}

