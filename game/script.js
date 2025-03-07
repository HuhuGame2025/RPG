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
    { id: "supply01", type: "supply", name: "🫙 治療藥水", description: "治療 5 HP", price: 5 },
    { id: "supply02", type: "supply", name: "🫙 中級治療藥水", description: "治療 10 HP", price: 10 },
    { id: "supply03", type: "supply", name: "🫙 高級治療藥水", description: "治療 20 HP", price: 20 },

    // 戰利品
    { id: "loot01", type: "loot", name: "💰 小棍棒", description: "脆弱的木棍，回收也不值錢", price: 1 },
    { id: "loot02", type: "loot", name: "💰 巨型狼牙棒", description: "太重了，無法當武器使用，只能回收", price: 5 },
    { id: "loot03", type: "loot", name: "💰 仙粉", description: "仙子的魔法粉末，可以販賣", price: 10 },
    { id: "loot04", type: "loot", name: "💰 狼皮", description: "野狼的毛皮，可以販賣", price: 12 },
    { id: "loot05", type: "loot", name: "💰 狐狸皮", description: "狐狸的毛皮，可以販賣", price: 6 },
    { id: "loot06", type: "loot", name: "💰 蜘蛛絲", description: "巨型蜘蛛的絲線，可以販賣", price: 24 },
    { id: "loot07", type: "loot", name: "💰 木材", description: "樹妖的木材，可以販賣", price: 18 },

    // 任務物品
    { id: "specialItem01", type: "specialItem", name: "📦 包裹", description: "要送到晨曦鎮的包裹", price: 20 },
    { id: "specialItem02", type: "specialItem", name: "📦 破損包裹", description: "要送到晨曦鎮的包裹，被之前遇到的敵人破壞了", price: 0 },
    { id: "specialItem03", type: "specialItem", name: "📦 包裹", description: "要送到鐵石鎮的包裹", price: 20 },
    { id: "specialItem04", type: "specialItem", name: "📦 破損包裹", description: "要送到鐵石鎮的包裹，被之前遇到的敵人破壞了", price: 0 },
    { id: "specialItem10", type: "specialItem", name: "📜 食人花種子", description: "蘊藏著蠢蠢欲動的生命，某人願意高價購買", price: 0 },
    { id: "specialItem11", type: "specialItem", name: "📦 包好的武器", description: "向哥布林商人買來的，不知道裡面裝著什麼", price: 0 },
    { id: "specialItem12", type: "specialItem", name: "📦 包好的護具", description: "向哥布林商人買來的，不知道裡面裝著什麼", price: 0 },
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

// 跳轉到城鎮
function toTown() {
    window.location.href = '../town.html';
}

// 滑到頁面最上方
function goTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
}

// 讀取背景圖
function getBackground() {
    const savedBackground = localStorage.getItem("backgroundStyle");
    if (savedBackground) {
        document.body.style.backgroundImage = savedBackground;
    } else {
        document.body.style.backgroundImage = "url('images/field.jpg')"; // 預設為原野背景
    }
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
    const playerWis = parseInt(localStorage.getItem("playerWis"));
    const playerCha = parseInt(localStorage.getItem("playerCha"));
    const playerTotalStr = parseInt(localStorage.getItem("playerTotalStr"));
    const playerTotalDex = parseInt(localStorage.getItem("playerTotalDex"));
    const playerTotalCha = parseInt(localStorage.getItem("playerTotalCha"));
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

// 將主角和同伴更新到隊伍
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
    const playerWis = parseInt(localStorage.getItem("playerWis"));
    const playerCha = parseInt(localStorage.getItem("playerCha"));
    const playerTotalStr = parseInt(localStorage.getItem("playerTotalStr"));
    const playerTotalDex = parseInt(localStorage.getItem("playerTotalDex"));
    const playerTotalCha = parseInt(localStorage.getItem("playerTotalCha"));
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
        wis: playerWis,
        cha: playerCha,
        totalStr: playerTotalStr,
        totalDex: playerTotalDex,
        totalCha: playerTotalCha,
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
            wis: companion.wis,
            cha: companion.cha,
            totalStr: companion.totalStr,
            totalDex: companion.totalDex,
            totalCha: companion.totalCha,
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
    companion.totalCha = (companion.cha || 0) + (weapon.cha || 0) + (armor.cha || 0);

    // 添加同伴資料並設定初始的HP和MaxHP
    hiredCompanions.push({
        name: companionName, // 加入處理後的名字
        type: companion.type,
        weapon: companion.weapon,
        armor: companion.armor,
        str: companion.str,
        dex: companion.dex,
        con: companion.con,
        wis: companion.wis,
        cha: companion.cha,
        totalStr: companion.totalStr,
        totalDex: companion.totalDex,
        totalCha: companion.totalCha,
        totalArm: companion.totalArm,
        MaxHP: companion.con * 2, // MaxHP
        HP: companion.con * 2, // 初始HP
        description: companion.description,
    });

    // 儲存
    localStorage.setItem("hiredCompanions", JSON.stringify(hiredCompanions));
    console.log("同伴加入", hiredCompanions);

    // 同時更新隊伍成員
    partyToTeamMember();
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

// 讀取資金
function getPlayerMoney() {
    let playerMoney = parseInt(localStorage.getItem("playerMoney")) || 0;
    if (document.getElementById("playerMoney")) {
        document.getElementById('playerMoney').textContent = playerMoney;
    }
}

// 讀取名聲
function getPlayerFame() {
    let playerFame = parseInt(localStorage.getItem("playerFame"));
    if (document.getElementById("playerFame")) {
        document.getElementById('playerFame').textContent = playerFame;
    }
}

// 顯示對話
function showDialogue(key, price, speaker) {
    // 隱藏主要內容
    document.getElementById("main").style.display = "none";

    // 顯示對話容器
    document.getElementById("dialogue").style.display = "block";

    // 讀取並顯示主角的名字
    const playerName = localStorage.getItem("playerName");
    document.getElementById("playerName").textContent = playerName;

    // 讀取NPC名字
    let npcName = localStorage.getItem("npcName");

    // 使用NPC名字來找到對話資料（只要名字中包含資料庫中的名字即可）
    let matchName = Object.keys(dialogueData).find(name => npcName.includes(name));

    // 如果沒有讀取到，就保持空白
    if (!matchName || !dialogueData[matchName][key]) {
        document.getElementById("npc-name").textContent = "";
        document.getElementById("npc-text").textContent = "";
        return;
    }

    // 讀取對話資料庫
    let dialogue = dialogueData[matchName][key];
    
    // 如果有指定 price，儲存以備下次使用
    if (price) {
        localStorage.setItem("dialoguePrice", price);
    } else {
        // 如果沒有指定，就讀取上次的 price
        price = parseInt(localStorage.getItem("dialoguePrice")); 
    }

    // 將 {playerName} 替換為主角名字，{price} 替換為金額
    let dialogueText = dialogue.text
        .replace(/{playerName}/g, playerName)
        .replace(/{price}/g, price);

    // 如果對話中有指定npc
    if (dialogue.npc === "npc") {
        npcName = speaker; // 如果只打"npc"，使用函式指定的 NPC 名字
    } else if (dialogue.npc) {
        npcName = dialogue.npc; // 如果有指定名字，使用對話內指定的 NPC 名字
    }

    // 顯示NPC名字與對話
    document.getElementById("npc-name").textContent = npcName;
    document.getElementById("npc-text").innerHTML = dialogueText; // 使用 innerHTML 來處理換行
    
    // 清空舊的選項
    const choicesContainer = document.getElementById("choices");
    choicesContainer.innerHTML = ""; 

    // 建立選項按鈕
    dialogue.choices.forEach(choice => {
        const button = document.createElement("button");
        button.textContent = choice.text;
        button.onclick = () => {
            showDialogue(choice.next); // 顯示下一個對話

            // 如果選項有 action，執行它
            if (choice.action) {
                new Function(`return ${choice.action}`)();
            }
        };
        choicesContainer.appendChild(button);
    });

    goTop();
}

// 清除對話
function removeDialogue() {
    document.getElementById("npc-name").textContent = "";
    document.getElementById("npc-text").innerHTML = "";
    document.getElementById("playerName").textContent = "";
    document.getElementById("choices").innerHTML = "";
    document.getElementById("dialogue").style.display = "none";

    // 顯示主要內容
    document.getElementById("main").style.display = "block";

    getPlayerMoney();  // 更新金錢
    getPlayerFame();  // 更新名聲
}

// 快速旅行
function fastTravel() {
    // 讀取最近的城鎮位置
    const townPos = JSON.parse(localStorage.getItem("townPos"));

    // 更新主角的位置
    localStorage.setItem("playerPos", JSON.stringify(townPos));

    // 跳轉到城鎮頁面
    window.location.href = 'town.html';
}