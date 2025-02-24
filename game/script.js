// 物品資料庫
const itemDatabase = [
    // 武器
    { id: "weapon01", type: "weapon", name: "🗡️ 匕首", str: 1, arm: 0, dex: 0, description: "適合隨身攜帶的小刀<br>力量 + 1", price: 20 },
    { id: "weapon02", type: "weapon", name: "🗡️ 短劍", str: 2, arm: 0, dex: 0, description: "士兵配備的武器<br>力量 + 2", price: 40 },
    { id: "weapon03", type: "weapon", name: "🗡️ 戰斧", str: 3, arm: 0, dex: -1, description: "殺傷力大但是沉重的長柄武器<br>力量 + 3<br>敏捷 - 1", price: 50 },

    // 裝備
    { id: "armor01", type: "armor", name: "🛡️ 皮製大衣", str: 0, arm: 1, dex: 0, description: "提供基本的保護<br>護甲 + 1", price: 20 },
    { id: "armor02", type: "armor", name: "🛡️ 皮甲", str: 0, arm: 2, dex: 0, description: "輕型盔甲，能保護身體的要害<br>護甲 + 2", price: 40 },
    { id: "armor03", type: "armor", name: "🛡️ 鐵甲", str: 0, arm: 3, dex: -1, description: "保護力完善，但活動性較差的盔甲<br>護甲 + 3<br>敏捷 - 1", price: 50 },

    // 道具
    { id: "supply01", type: "supply", name: "🔹 道具 1", description: "這是一個示範道具", price: 100 },
    { id: "supply02", type: "supply", name: "🔹 道具 2", description: "這是一個示範道具", price: 100 },
    { id: "supply03", type: "supply", name: "🔹 道具 3", description: "這是一個示範道具", price: 100 },
    { id: "supply04", type: "supply", name: "🔹 道具 4", description: "這是一個示範道具", price: 100 },

    // 戰利品
    { id: "loot01", type: "loot", name: "💰 小棍棒", description: "脆弱的木棍，回收也不值錢", price: 1 },
    { id: "loot02", type: "loot", name: "💰 巨型狼牙棒", description: "太重了，無法當武器使用，只能回收", price: 5 },
    { id: "loot03", type: "loot", name: "💰 仙粉", description: "仙子的魔法粉末，可以販賣", price: 10 },
    { id: "loot04", type: "loot", name: "💰 狼皮", description: "野狼的毛皮，可以販賣", price: 12 },
    { id: "loot05", type: "loot", name: "💰 狐狸皮", description: "狐狸的毛皮，可以販賣", price: 6 },
    { id: "loot06", type: "loot", name: "💰 蜘蛛絲", description: "巨型蜘蛛的絲線，可以販賣", price: 24 },
    { id: "loot07", type: "loot", name: "💰 木材", description: "樹妖的木材，可以販賣", price: 18 },

    // 任務物品
    { id: "specialItems01", type: "specialItem", name: "📦 包裹", description: "要送到下一座城鎮的貨物", price: 0 },
    { id: "specialItems02", type: "specialItem", name: "📜 食人花種子", description: "蘊藏著蠢蠢欲動的生命，某人願意高價購買", price: 0 },
];


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
    // 將主角 HP 設為最大值
    const playerMaxHP = parseInt(document.getElementById("playerMaxHP").textContent);
    document.getElementById("playerHP").textContent = playerMaxHP;
    localStorage.setItem("playerHP", playerMaxHP);

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
    const playerWeapon = JSON.parse(localStorage.getItem("playerWeapon")) || [];
    const playerArmor = JSON.parse(localStorage.getItem("playerArmor")) || [];
    const playerCon = parseInt(localStorage.getItem("playerCon"));
    const playerStr = parseInt(localStorage.getItem("playerStr"));
    const playerDex = parseInt(localStorage.getItem("playerDex"));
    const playerTotalStr = parseInt(localStorage.getItem("playerTotalStr"));
    const playerTotalDex = parseInt(localStorage.getItem("playerTotalDex"));
    const playerTotalArm = parseInt(localStorage.getItem("playerTotalArm"));
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
        }
    });
}

// 將主角和同伴加入隊伍
function partyToTeamMember(){
    let teamMember = []; // 隊伍
    
    // 讀取主角資料
    const playerName = localStorage.getItem("playerName");
    const playerType = localStorage.getItem("playerType");
    const playerWeapon = JSON.parse(localStorage.getItem("playerWeapon")) || [];
    const playerArmor = JSON.parse(localStorage.getItem("playerArmor")) || [];
    const playerCon = parseInt(localStorage.getItem("playerCon"));
    const playerStr = parseInt(localStorage.getItem("playerStr"));
    const playerDex = parseInt(localStorage.getItem("playerDex"));
    const playerTotalStr = parseInt(localStorage.getItem("playerTotalStr"));
    const playerTotalDex = parseInt(localStorage.getItem("playerTotalDex"));
    const playerTotalArm = parseInt(localStorage.getItem("playerTotalArm"));
    const playerMaxHP = parseInt(localStorage.getItem("playerMaxHP"));
    let playerHP = parseInt(localStorage.getItem("playerHP"));

    // 讀取同伴資料
    let hiredCompanions = JSON.parse(localStorage.getItem("hiredCompanions")) || [];
    
    // 將主角加入隊伍
    teamMember = [{
        name: playerName,
        id: "player",
        type: playerType,
        weapon: playerWeapon,
        armor: playerArmor,
        HPid: "playerHP",
        HP: playerHP,
        MaxHP: playerMaxHP,
        str: playerStr,
        dex: playerDex,
        con: playerCon,
        totalStr: playerTotalStr,
        totalDex: playerTotalDex,
        totalArm: playerTotalArm,
        description: "",
    }];

    // 將所有同伴加入隊伍
    hiredCompanions.forEach((companion, index) => {
        teamMember.push({
            name: companion.name,
            id: `companion${index + 1}`,
            type: companion.type,
            weapon: companion.weapon,
            armor: companion.armor,
            HPid: `companion${index + 1}-HP`,
            HP: companion.HP,
            MaxHP: companion.MaxHP,
            str: companion.str,
            dex: companion.dex,
            con: companion.con,
            totalStr: companion.totalStr,
            totalDex: companion.totalDex,
            totalArm: companion.totalArm,
            description: companion.description,
        });
    });

    // 儲存隊伍成員
    localStorage.setItem("teamMember", JSON.stringify(teamMember));

    teamMember.forEach((member, index) => {
        let memberId = `member${index + 1}`;
        let memberItem = document.getElementById(memberId);
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

    // 根據裝備ID找到同伴的裝備資料
    const weapon = itemDatabase.find(item => item.id === companion.weaponId) || { str: 0, arm: 0, dex: 0 };
    const armor = itemDatabase.find(item => item.id === companion.armorId) || { str: 0, arm: 0, dex: 0 };

    companion.weapon = weapon;
    companion.armor = armor;

    // 計算角色穿戴裝備後的總屬性
    companion.totalStr = (companion.str || 0) + (weapon.str || 0) + (armor.str || 0);
    companion.totalArm = (companion.arm || 0) + (weapon.arm || 0) + (armor.arm || 0);
    companion.totalDex = (companion.dex || 0) + (weapon.dex || 0) + (armor.dex || 0);

    // 添加同伴資料並設定初始的HP和MaxHP
    hiredCompanions.push({
        name: companionName, // 加入處理後的名字
        type: companion.type,
        weapon: companion.weapon,
        armor: companion.armor,
        con: companion.con,
        str: companion.str,
        dex: companion.dex,
        totalStr: companion.totalStr,
        totalArm: companion.totalArm,
        totalDex: companion.totalDex,
        MaxHP: companion.con * 2, // MaxHP
        HP: companion.con * 2, // 初始HP
        description: companion.description,
    });

    // 儲存
    localStorage.setItem("hiredCompanions", JSON.stringify(hiredCompanions));
    console.log("同伴加入", hiredCompanions);
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

        // 同時更新隊伍成員
        let teamMember = JSON.parse(localStorage.getItem("teamMember")) || [];
        teamMember = teamMember.filter(member => member.id !== companionId);
        localStorage.setItem("teamMember", JSON.stringify(teamMember));
    }
}

