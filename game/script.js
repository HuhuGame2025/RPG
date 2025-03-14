// 物品資料庫
const itemDatabase = [
    // 武器
    { id: "weapon01", type: "weapon", name: "🗡️ 匕首", str: 5, dex: 0, description: "適合隨身攜帶的短劍", price: 15 },
    { id: "weapon02", type: "weapon", name: "🗡️ 單手劍", str: 10, dex: 0, description: "戰士的標準配備", price: 30 },
    { id: "weapon03", type: "weapon", name: "🗡️ 巨劍", str: 15, dex: -1, description: "雙手持握的大型劍", price: 45 },
    { id: "weapon04", type: "weapon", name: "🗡️ 戰斧", str: 20, dex: -2, description: "殺傷力驚人的重型武器", price: 60 },
    { id: "weapon05", type: "weapon", name: "🛡️ 盾牌", str: 5, arm: 10, dex: -1, description: "能保護自身也能當鈍器使用", price: 45 },
    //{ id: "weapon06", type: "weapon", name: "🗡️ 弓", str: 10, dex: 2, description: "拉開距離而獲得敏捷優勢", price: 50 },
    
    { id: "lootWeapon01", type: "weapon", name: "🗡️ 棍棒", str: 1, dex: 0, description: "只是一根普通的樹枝", price: 1 },
    { id: "lootWeapon02", type: "weapon", name: "🗡️ 老舊的匕首", str: 4, dex: 0, description: "適合隨身攜帶的小刀", price: 12 },
    { id: "lootWeapon03", type: "weapon", name: "🗡️ 老舊的單手劍", str: 8, dex: 0, description: "戰士的標準配備", price: 24 },
    { id: "lootWeapon04", type: "weapon", name: "🗡️ 老舊的戰斧", str: 16, dex: -2, description: "殺傷力驚人的重型武器", price: 48 },
    { id: "lootWeapon05", type: "weapon", name: "🗡️ 巨大的狼牙棒", str: 20, dex: -5, description: "過於沉重，難以使用", price: 10 },
    { id: "lootWeapon06", type: "weapon", name: "🗡️ 尖銳的石頭", str: 2, dex: 0, description: "可以藏在衣服裡", price: 0 },

    { id: "npcWeapon01", type: "weapon", name: "🗡️ 雷納德的巨劍", str: 15, dex: -1, description: "雙手持握的大型劍", owner: "雷納德" },
    { id: "npcWeapon02", type: "weapon", name: "🗡️ 塔爾穆克的戰斧", str: 20, dex: -2, description: "殺傷力驚人的重型武器", owner: "塔爾穆克" },
    { id: "npcWeapon03", type: "weapon", name: "🗡️ 賽恩的雙匕首", str: 10, dex: 0, description: "一雙適合隨身攜帶的短劍", owner: "賽恩" },
    { id: "npcWeapon04", type: "weapon", name: "🗡️ 艾德蒙的劍", str: 10, dex: 0, description: "戰士的標準配備", owner: "艾德蒙" },
    { id: "npcWeapon05", type: "weapon", name: "🗡️ 諾伊爾的劍", str: 10, dex: 0, description: "戰士的標準配備", owner: "諾伊爾" },

    // 護具
    { id: "armor01", type: "armor", name: "🛡️ 皮革大衣", arm: 5, dex: 0, description: "提供基本的保護", price: 25 },
    { id: "armor02", type: "armor", name: "🛡️ 輕皮甲", arm: 10, dex: 0, description: "活動性佳的輕型盔甲", price: 50 },
    { id: "armor03", type: "armor", name: "🛡️ 鐵製胸甲", arm: 15, dex: -1, description: "能良好地保護要害", price: 75 },
    { id: "armor04", type: "armor", name: "🛡️ 全身板甲", arm: 20, dex: -2, description: "全面保護，但較為沉重", price: 100 },
    
    { id: "lootArmor01", type: "armor", name: "🛡️ 獸皮背心", arm: 1, dex: 0, description: "只能起到保暖的作用", price: 3 },
    { id: "lootArmor02", type: "armor", name: "🛡️ 老舊的皮革大衣", arm: 4, dex: 0, description: "提供基本的保護", price: 20 },
    { id: "lootArmor03", type: "armor", name: "🛡️ 老舊的輕皮甲", arm: 8, dex: 0, description: "活動性佳的輕型盔甲", price: 40 },
    { id: "lootArmor04", type: "armor", name: "🛡️ 老舊的鐵製胸甲", arm: 12, dex: -1, description: "包覆軀幹的堅固胸甲", price: 60 },
    { id: "lootArmor05", type: "armor", name: "🛡️ 巨大的腰布", arm: 1, dex: 0, description: "可以披在身上當斗篷", price: 0 },

    { id: "npcArmor01", type: "armor", name: "🛡️ 雷納德的胸甲", arm: 15, dex: 0, description: "包覆軀幹的堅固胸甲", owner: "雷納德" },
    { id: "npcArmor02", type: "armor", name: "🛡️ 塔爾穆克的輕皮甲", arm: 10, dex: 0, description: "活動性佳的輕型盔甲", owner: "塔爾穆克" },
    { id: "npcArmor03", type: "armor", name: "🛡️ 賽恩的大衣", arm: 5, dex: 0, description: "提供基本的保護", owner: "賽恩" },
    { id: "npcArmor04", type: "armor", name: "🛡️ 艾德蒙的輕皮甲", arm: 10, dex: 0, description: "活動性佳的輕型盔甲", owner: "艾德蒙" },
    { id: "npcArmor05", type: "armor", name: "🛡️ 諾伊爾的大衣", arm: 5, dex: 0, description: "提供基本的保護", owner: "諾伊爾" },

    // 服裝（也算護具，只是販售的商店不同）
    //{ id: "clothes01", type: "armor", name: "🧥 別緻休閒服", cha: 5, dex: 0, description: "低調奢華的襯衫背心，以多條皮帶裝飾，凸顯身材曲線", price: 50 },
    //{ id: "clothes02", type: "armor", name: "🧥 冒險家套裝", cha: 5, arm: 5, dex: 0, description: "美觀兼具實用性，帥氣的披風在身後飄揚，還原人們心目中的勇者形象", price: 100 },
    //{ id: "clothes03", type: "armor", name: "🧥 優雅正裝", cha: 10, dex: -1, description: "能襯托出高貴身分的正式服裝", price: 100 },
    //{ id: "clothes04", type: "armor", name: "🧥 貴族晚禮服", cha: 15, dex: -2, description: "極為華麗，能成為目光焦點，但穿起來十分緊繃", price: 150 },

    { id: "clothes01", type: "armor", name: "🧥 別緻休閒服", cha: 5, dex: 0, 
      description: "低調奢華的襯衫背心。選用細緻的布料，提供極佳的舒適度。多條皮帶巧妙點綴，勾勒出身材線條，讓人既自在又不失魅力。",
      price: 50 },

    { id: "clothes02", type: "armor", name: "🧥 冒險家套裝", cha: 5, arm: 5, dex: 0, 
      description: "以堅固的皮革縫製，兼具美觀與實用性。帥氣的披風隨風飄揚，宛如傳說中的勇者。無論走在街上或身處戰場，都能讓你在人群中脫穎而出。",
      price: 100 },

    { id: "clothes03", type: "armor", name: "🧥 優雅正裝", cha: 10, dex: -1, 
      description: "奢華天鵝絨外套搭配蕾絲內襯，剪裁合身，襯托出尊爵不凡的氣質，使你舉手投足間散發領袖魅力，你的發言將會具有令人無法抗拒的說服力。",
      price: 100 },

    { id: "clothes04", type: "armor", name: "🧥 貴族晚禮服", cha: 15, dex: -2, 
      description: "由上等絲綢與金線刺繡製成，無論在哪個場合都能成為眾人矚目的焦點。但緊身設計稍嫌束縛，對大幅度的動作來說不方便。",
      price: 150 },


    // 道具
    { id: "supply01", type: "supply", name: "🫙 治療藥水", heal:5, description: "治療 5 HP", price: 5, usable: "true", consumable: "true"},
    { id: "supply02", type: "supply", name: "🫙 中級治療藥水", heal:10, description: "治療 10 HP", price: 10, usable: "true", consumable: "true" },
    { id: "supply03", type: "supply", name: "🫙 高級治療藥水", heal:20, description: "治療 20 HP", price: 20, usable: "true", consumable: "true" },
    { id: "lootSupply01", type: "supply", name: "🫙 蟲血", heal:1, description: "富含營養，能稍微恢復 1 HP", price: 1, usable: "true", consumable: "true" },

    // 戰利品
    { id: "loot01", type: "loot", name: "💰 堅硬羽毛", description: "獅鷲的羽毛，可以販賣", price: 50 },
    { id: "loot02", type: "loot", name: "💰 鱗片", description: "火蜥蜴的鱗片，可以販賣", price: 8 },
    { id: "loot03", type: "loot", name: "💰 仙粉", description: "仙子的魔法粉末，可以販賣", price: 5 },
    { id: "loot04", type: "loot", name: "💰 狼皮", description: "野狼的毛皮，可以販賣", price: 12 },
    { id: "loot05", type: "loot", name: "💰 狐狸皮", description: "狐狸的毛皮，可以販賣", price: 6 },
    { id: "loot06", type: "loot", name: "💰 蜘蛛絲", description: "巨型蜘蛛的絲線，可以販賣", price: 18 },
    { id: "loot07", type: "loot", name: "💰 木材", description: "樹妖的木材，可以販賣", price: 10 },
    { id: "loot08", type: "loot", name: "🫘 食人花種子", description: "蘊藏著蠢蠢欲動的生命，一般商人不願意買，但某人願意出高價收購", price: 0 },
    

    // 任務物品
    { id: "specialItem01", type: "specialItem", name: "📦 包裹", description: "要送到晨曦鎮的包裹", price: 20 },
    { id: "specialItem02", type: "specialItem", name: "📦 破損包裹", description: "要送到晨曦鎮的包裹，被之前遇到的敵人破壞了", price: 0 },
    { id: "specialItem03", type: "specialItem", name: "📦 包裹", description: "要送到鐵石鎮的包裹", price: 20 },
    { id: "specialItem04", type: "specialItem", name: "📦 破損包裹", description: "要送到鐵石鎮的包裹，被之前遇到的敵人破壞了", price: 0 },

    { id: "specialItem11", type: "specialItem", name: "📦 包好的武器", description: "向哥布林商人買來的，不知道裡面裝著什麼", price: 0, usable: "true", consumable: "true" },
    { id: "specialItem12", type: "specialItem", name: "📦 包好的護具", description: "向哥布林商人買來的，不知道裡面裝著什麼", price: 0, usable: "true", consumable: "true" },
    { id: "specialItem13", type: "specialItem", name: "♦️ 紅寶石", description: "當你盯著這顆紅寶石時，一個聲音在你腦中響起，要你把它拿近一點", price: 666, investigable: "true" },
    { id: "specialItem14", type: "specialItem", name: "♦️ 紅寶石", description: "封印著惡魔的紅寶石", price: 666, investigable: "true", usable: "true" },
    { id: "specialItem15", type: "specialItem", name: "🗝️ 鐵絲", description: "可以用來撬鎖", price: 0 },
    { id: "specialItem16", type: "specialItem", name: "🗝️ 牢房鑰匙", description: "可以打開任何一間牢房", price: 50 },

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
function loadBackground() {
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
        if (document.getElementById(`companion${index + 1}-HP`)) {
            document.getElementById(`companion${index + 1}-HP`).textContent = companion.HP;
        }
    });

    partyToTeamMember();
}

// 讀取隊伍資料
function loadPartyData(){
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
    const playerHP = parseInt(localStorage.getItem("playerHP"));

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

    // 顯示金錢
    const playerMoney = parseInt(localStorage.getItem("playerMoney")) || 0;
    if (document.getElementById("playerMoney")) {
        document.getElementById('playerMoney').textContent = playerMoney;
    }

    // 顯示名聲
    const playerFame = parseInt(localStorage.getItem("playerFame")) || 0;
    if (document.getElementById("playerFame")) {
        document.getElementById('playerFame').textContent = playerFame;
    }

    // 顯示通緝等級
    const wantedLevel = parseInt(localStorage.getItem("wantedLevel")) || 0;
    if (document.getElementById("wantedLevel")) {
        document.getElementById('wantedLevel').textContent = wantedLevel;
    }
}

// 將角色資料更新到隊伍
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
    console.log(teamMember);

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
        MaxHP: companion.con * 3, // MaxHP
        HP: companion.con * 3, // 初始HP
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
    // 讀取所有同伴資料
    let teamMember = JSON.parse(localStorage.getItem("teamMember")) || [];
    let hiredCompanions = JSON.parse(localStorage.getItem("hiredCompanions")) || [];

    // 找到這名同伴的資料
    let companion = teamMember.find(m => m.id === companionId);
    if (!companion) {
        return; // 找不到就不執行
    }

    // 脫下同伴的裝備
    equip(companionId, "noWeapon");
    equip(companionId, "noArmor");

    // 從主角物品中移除同伴專屬裝備
    const companionItems = itemDatabase.filter(i => i.owner === companion.name); // 找到專屬裝備
    let playerItems = JSON.parse(localStorage.getItem("playerItems")) || [];
    let newPlayerItems = playerItems.filter(i => i !== companionItems.id);
    localStorage.setItem("playerItems", JSON.stringify(playerItems));

    // 提取數字部分並減去 1，來取得在 hiredCompanions 的索引
    const companionIndex = parseInt(companionId.replace("companion", "")) - 1;

    // 確保索引有效
    if (companionIndex >= 0 && companionIndex < hiredCompanions.length) {
        // 刪除指定索引的同伴
        hiredCompanions.splice(companionIndex, 1);

        // 更新 localStorage
        localStorage.setItem("hiredCompanions", JSON.stringify(hiredCompanions));

        // 同時更新隊伍成員
        teamMember = teamMember.filter(member => member.id !== companionId);
        localStorage.setItem("teamMember", JSON.stringify(teamMember));
    }
}

// 穿上或脫下裝備（脫下：equip("player", "noWeapon")、equip("player", "noArmor")）
function equip(memberId, itemId) {
    // 讀取所有成員的資料
    const hiredCompanions = JSON.parse(localStorage.getItem("hiredCompanions")) || [];
    const teamMember = JSON.parse(localStorage.getItem("teamMember")) || [];

    // 取得該成員的資料
    let member = teamMember.find(m => m.id === memberId);

    // 讀取玩家的物品
    let playerItems = JSON.parse(localStorage.getItem("playerItems")) || [];

    // 如果脫下裝備
    if (itemId === "noWeapon") {
        if (member.weapon) playerItems.push(member.weapon.id); // 將原本的武器放回主角物品
        member.weapon = null; // 清空武器
    } else if (itemId === "noArmor") {
        if (member.armor) playerItems.push(member.armor.id); // 將原本的護具放回主角物品
        member.armor = null; // 清空護具

    // 如果穿上裝備
    } else {
        let item = itemDatabase.find(i => i.id === itemId); // 找到這件裝備的資料

        if (item.type === "weapon") {
            if (member.weapon) playerItems.push(member.weapon.id); // 將原本的武器放回主角物品
            member.weapon = item; // 更換武器
        } else if (item.type === "armor") {
            if (member.armor) playerItems.push(member.armor.id); // 先將原本的護具放回主角物品
            member.armor = item; // 更換護具
        }

        // 從主角物品中移除穿上的裝備
        const itemIndex = playerItems.findIndex(i => i === itemId);
        if (itemIndex !== -1) {
            playerItems.splice(itemIndex, 1);
        }
    }

    // 確保裝備物品的屬性正確
    let weapon = member.weapon ? member.weapon : { str: 0, arm: 0, dex: 0, cha: 0 };
    let armor = member.armor ? member.armor : { str: 0, arm: 0, dex: 0, cha: 0 };
            
    // 計算角色的總屬性，確保基礎屬性不受影響
    member.totalStr = (member.str || 0) + (weapon.str || 0) + (armor.str || 0);
    member.totalArm = (member.arm || 0) + (weapon.arm || 0) + (armor.arm || 0);
    member.totalDex = (member.dex || 0) + (weapon.dex || 0) + (armor.dex || 0);
    member.totalCha = (member.cha || 0) + (weapon.cha || 0) + (armor.cha || 0);

    // 更新 localStorage
    localStorage.setItem("teamMember", JSON.stringify(teamMember));
    localStorage.setItem("playerItems", JSON.stringify(playerItems));

    // 同步儲存到角色和同伴資料
    if (member.id === "player") {
        localStorage.setItem("playerWeapon", JSON.stringify(member.weapon));
        localStorage.setItem("playerArmor", JSON.stringify(member.armor));
        localStorage.setItem("playerTotalStr", member.totalStr);
        localStorage.setItem("playerTotalArm", member.totalArm);
        localStorage.setItem("playerTotalDex", member.totalDex);
        localStorage.setItem("playerTotalCha", member.totalCha);
    } else {
        let companionIndex = parseInt(member.id.match(/\d+/)[0]) - 1;
        if (hiredCompanions[companionIndex]) {
            hiredCompanions[companionIndex] = member
            localStorage.setItem("hiredCompanions", JSON.stringify(hiredCompanions));
        }
    }
}

// 獲得物品或金錢
function getItem(itemId, count = 1) {
    if (!itemId) {
        return; // 找不到物品就不執行
    }

    if (itemId.startsWith("$")) {
        // 如果是 $ 開頭，代表金幣
        let money = parseInt(itemId.slice(1), 10);
        let playerMoney = parseInt(localStorage.getItem("playerMoney")) || 0;
        playerMoney += money;
        localStorage.setItem("playerMoney", playerMoney);
    } else {
        // 如果是物品
        let playerItems = JSON.parse(localStorage.getItem("playerItems")) || [];

        // 將物品加入陣列 count 次
        for (let i = 0; i < count; i++) {
            playerItems.push(itemId);
        }

        localStorage.setItem("playerItems", JSON.stringify(playerItems));
    }
}

// 失去物品或金錢
function loseItem(itemId, count = 1) {
    if (itemId.startsWith("$")) {
        // 如果是金錢
        let money = parseInt(itemId.slice(1), 10);
        let playerMoney = parseInt(localStorage.getItem("playerMoney")) || 0;
        playerMoney = Math.max(0, playerMoney - money * count); // 金錢不得小於 0
        localStorage.setItem("playerMoney", playerMoney);
    } else {
        // 如果是物品
        let playerItems = JSON.parse(localStorage.getItem("playerItems")) || [];

        // 移除 `count` 次指定物品
        for (let i = 0; i < count; i++) {
            let index = playerItems.indexOf(itemId);
            if (index !== -1) {
                playerItems.splice(index, 1); // 移除該物品
            } else {
                break; // 沒有該物品就停止移除
            }
        }

        // 存回 localStorage
        localStorage.setItem("playerItems", JSON.stringify(playerItems));
    }
}

// 主角 HP 增減
function addPlayerHP(amount) {
    let playerHP = parseInt(localStorage.getItem("playerHP"));
    playerHP += amount;
    localStorage.setItem("playerHP", playerHP);

    partyToTeamMember();
}

// 名聲增減
function addPlayerFame(amount) {
    let playerFame = parseInt(localStorage.getItem("playerFame")) || 0;
    playerFame += amount; // 名聲有可能為 0
    localStorage.setItem("playerFame", playerFame); 
}

// 通緝等級增減
function addWantedLevel(amount) {
    let wantedLevel = parseInt(localStorage.getItem("wantedLevel")) || 0;
    wantedLevel = Math.max(0, wantedLevel + amount); // 通緝等級不會低於 0
    localStorage.setItem("wantedLevel", wantedLevel);
    
    // 犯罪值會跟著增加，但不會跟著減少
    if (amount > 0) {
        let playerCrime = parseInt(localStorage.getItem("playerCrime")) || 0;
        playerCrime += amount; 
        localStorage.setItem("playerCrime", playerCrime); 
    }
}

// 顯示對話
function showDialogue(key, price, speaker) {
    // 隱藏主要內容
    document.getElementById("main").style.display = "none";

    // 清空物品容器
    if (document.getElementById("item-list")) {
        document.getElementById("item-list").innerHTML = "";
    }
    
    // 讀取主角的名字
    const playerName = localStorage.getItem("playerName");

    // 讀取NPC名字
    let npcName = localStorage.getItem("npcName");

    // 使用NPC名字來找到對話資料（只要指定的名字中包含資料庫中的名字即可）
    let matchName = Object.keys(dialogueData).find(name => npcName.includes(name));

    // 檢查是不是在執行副本
    let dungeon = localStorage.getItem("inDungeon");
    if (npcName === dungeon) {
        // 如果沒指定 key，就讀取儲存的 key，繼續之前的進度
        if (!key) {
            key = localStorage.getItem("currentKey") || "start"; // 如果沒有儲存，就從start開始
        } else {
            localStorage.setItem("currentKey", key); // 儲存當前的 key 以便刷新頁面後能繼續，在要重置進度時清除
        }
    }

    // 如果沒有讀取到對話資料，就保持空白（next為空的時候）
    if (!matchName || !dialogueData[matchName][key]) {
        return;
    }

    // 讀取對話資料庫
    let dialogue = dialogueData[matchName][key];

    // 顯示對話 UI
    document.getElementById("dialogue").style.display = "block";
    const dialogueContainer = document.getElementById("dialogue");
    if (dialogue.npc) { // 如果副本中有指定NPC
        // 對話的格式
        dialogueContainer.innerHTML = `
            <br>
            <h4><span id="npc-name"></span>：</h4>
            <div class="dialogue-text"><span id="npc-text"></span></div>
            <br><br>
            <h4>${playerName}：</h4>
            <div id="choices" class="menu"></div>
        `;
        
    } else {
        // 副本的格式
        dialogueContainer.innerHTML = `
            <br>
            <div class="dialogue-text"><span id="npc-text"></span></div>
            <div id="choices" class="menu"></div>
        `;
    }

    // 如果有指定 price，儲存以備下次使用
    if (price) {
        localStorage.setItem("dialoguePrice", price);
    } else {
        // 如果沒有指定，就讀取上次的 price
        price = parseInt(localStorage.getItem("dialoguePrice")); 
    }

    // 替換佔位符
    let dialogueText = dialogue.text
        .replace(/{playerName}/g, playerName) // 主角名字
        .replace(/{npcName}/g, npcName) // 對話者名字
        .replace(/{price}/g, price); // 金額

    // 如果有指定 npc 名字
    if (dialogue.npc === "npc") {
        npcName = npcName; // 如果資料庫只打 "npc"，預設為對話者名字
    } else if (dialogue === "speaker") {
        npcName = speaker; // 如果資料庫只打 "speaker"，使用函式指定的 speaker 為名字
    } else if (dialogue.npc) {
        npcName = dialogue.npc; // 如果資料庫有指定名字，使用此名字
    }

    // 顯示對方的名字和台詞
    if (document.getElementById("npc-name")) {
        document.getElementById("npc-name").textContent = npcName;
    }
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
    // 清除交談資料
    localStorage.removeItem("npcId"); // 清除戰鬥中指定的交談對象
    localStorage.removeItem("persuadeResult");
    localStorage.removeItem("intimidateResult");

    // 清除對話
    document.getElementById("dialogue").innerHTML = "";
    //document.getElementById("dialogue").style.display = "none";

    // 顯示主要內容
    document.getElementById("main").style.display = "block";

    loadPartyData();
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

// 指定戰鬥
function battle(situation, enemyName, enemyCount, destination) {
    let encounter;

    // 如果是和對話者戰鬥
    if (enemyName === "npcName") {
        const npcName = localStorage.getItem("npcName");
        const teamMember = JSON.parse(localStorage.getItem("teamMember")) || [];
        const member = teamMember.find(m => m.name === npcName);

        // 如果對方是隨從或俘虜
        if (member && (member.type === "隨從" || member.type === "俘虜")) {
            removeCompanion(member.id); // 先讓對方離隊
            encounter = {
                situation: situation,
                enemyAdj: npcName, // 從對話者名字取出形容詞
                enemyName: npcName, // 對話者名字
                enemyCount: enemyCount,
                destination: destination
            };
        }

    // 預設戰鬥，將隨機抽形容詞
    } else {
        encounter = {
            situation: situation,
            enemyName: enemyName,
            enemyCount: enemyCount,
            destination: destination
        };
    }

    localStorage.setItem("encounter", JSON.stringify(encounter));
    console.log(encounter);

    // 跳轉到遭遇頁面（根據當前頁面判斷路徑）
    const pageName = window.location.pathname.split("/").pop();
    if (pageName === "map.html" || pageName === "town.html") {
        window.location.href = "encounter.html";
    } else {
        window.location.href = "../encounter.html";
    }
}

// 被逮捕
function arrested() {
    // 所有同伴退出隊伍
    removeCompanion("companion3");
    removeCompanion("companion2");
    removeCompanion("companion1");

    // 脫下主角的裝備
    equip("player", "noWeapon");
    equip("player", "noArmor");

    // 讀取主角的金錢、物品
    const playerMoney = parseInt(localStorage.getItem("playerMoney")) || 0;
    const playerItems = JSON.parse(localStorage.getItem("playerItems")) || [];

    // 讀取之前備份的金錢、物品
    const backupMoney = parseInt(localStorage.getItem("playerMoney-backup")) || 0;
    const backupItems = JSON.parse(localStorage.getItem("playerItems-backup")) || [];

    // 合併後儲存到備份
    const newBackupMoney = backupMoney + playerMoney;
    const newBackupItems = backupItems.concat(playerItems);
    localStorage.setItem("playerMoney-backup", newBackupMoney);
    localStorage.setItem("playerItems-backup", JSON.stringify(newBackupItems));

    // 移除主角的金錢、物品
    localStorage.removeItem("playerMoney");
    localStorage.removeItem("playerItems");

    // 主角的身分改為囚犯
    localStorage.setItem("playerType", "囚犯");
    partyToTeamMember();

    // 計算刑期
    const playerCrime = parseInt(localStorage.getItem("playerCrime")) || 0;
    if (playerCrime < 5) {
        // 犯罪值不到 5
        localStorage.setItem("prisonCountDown", playerCrime);
    } else {
        // 犯罪值達到 5
        localStorage.setItem("prisonCountDown", 5); // 最多關 5 天
        localStorage.setItem("deathPenalty", true); // 判處死刑
    }
    localStorage.removeItem("wantedLevel"); // 重置通緝等級

    // 重置監獄內變數
    localStorage.removeItem("timesCount");
    localStorage.removeItem("guardAction");
    localStorage.removeItem("searchResult");
    localStorage.removeItem("findMoney");
    localStorage.removeItem("unlockCell1");
    localStorage.removeItem("unlockCell2");
    localStorage.removeItem("unlockCell3");
    localStorage.removeItem("unlockCell4");
    localStorage.removeItem("currentKey") // 清除key，重置一天進度

    // 設定副本
    let dungeon = "坐牢";
    localStorage.setItem("inDungeon", dungeon); // 儲存副本
    localStorage.setItem("npcName", dungeon); // 用對話系統執行副本

    // 跳轉到監獄頁面（根據當前頁面判斷路徑）
    const pageName = window.location.pathname.split("/").pop();
    if (pageName === "map.html") {
        window.location.href = "town/prison.html";
    } else {
        window.location.href = "prison.html";
    }
}

// 出獄
function released() {
    // 主角的身分改為冒險者
    localStorage.setItem("playerType", "冒險者");
    partyToTeamMember();

    itemsBack();
}

// 還原被沒收的物品
function itemsBack() {
    // 讀取主角的金錢、物品
    const playerMoney = parseInt(localStorage.getItem("playerMoney")) || 0;
    const playerItems = JSON.parse(localStorage.getItem("playerItems")) || [];

    // 讀取之前備份的金錢、物品
    const backupMoney = parseInt(localStorage.getItem("playerMoney-backup")) || 0;
    const backupItems = JSON.parse(localStorage.getItem("playerItems-backup")) || [];

    // 合併後儲存到當前資料
    const newBackupMoney = backupMoney + playerMoney;
    const newBackupItems = backupItems.concat(playerItems);
    localStorage.setItem("playerMoney", newBackupMoney);
    localStorage.setItem("playerItems", JSON.stringify(newBackupItems));

    // 刪除備份
    localStorage.removeItem("playerMoney-backup");
    localStorage.removeItem("playerItems-backup");

    // 讀取所有同伴資料
    //let teamMember = JSON.parse(localStorage.getItem("teamMember")) || [];
    
    // 如果艾德蒙在隊伍裡，就取得他的專屬裝備
    //let companion = teamMember.find(m => m.name === "艾德蒙");
    //if (companion) {
    //    getItem(companion.weaponid);
    //    getItem(companion.armorid);
    //}
}

// 顯示商品列表
function showShop(itemType, itemIds) {
    let itemData = [];

    // 依商店篩選物品，並顯示商店說明
    if (itemType === "equipment") { // 鐵匠鋪
        itemData = itemDatabase.filter(i => i.id.startsWith("weapon") || i.id.startsWith("armor")); 
        document.getElementById("text").textContent = texts.equipments;
    } else if (itemType === "supply") { // 雜貨店
        itemData = itemDatabase.filter(i => i.id.startsWith(itemType));
        document.getElementById("text").textContent = texts.supplies;
    } else if (itemType === "clothes") { // 服飾店
        itemData = itemDatabase.filter(i => i.id.startsWith(itemType));
        document.getElementById("text").textContent = texts.clothes;
    } else { // 沒有商店，只顯示指定商品
        if (!Array.isArray(itemIds)) {
            itemIds = [itemIds]; // 如果只輸入單一字串，轉成陣列
        }
        itemData = itemDatabase.filter(i => itemIds.includes(i.id));

        // 單個商品：
        // showShop(null, 'weapon01');
        
        // 多個商品：
        // showShop(null, ['weapon01', 'armor03', 'supply05']);
    }

    // 插入到對話區域
    let container = document.getElementById("dialogue"); 

    // 顯示金錢
    const playerMoney = parseInt(localStorage.getItem("playerMoney")) || 0;
    let moneyDiv = document.getElementById("playerMoney");
    if (!moneyDiv) { // 如果沒有欄位就建立
        moneyDiv = document.createElement("div");
        moneyDiv.innerHTML = `
            <p class="small">🪙 $<span id="playerMoney">${playerMoney}</span></p>
        `
        container.appendChild(moneyDiv);
    }

    // 檢查並建立 item-list 容器
    let itemList = document.getElementById("item-list");
    if (!itemList) { // 如果沒有容器就建立
        itemList = document.createElement("div");
        itemList.id = "item-list";
        container.appendChild(itemList);
    }

    // 顯示列表
    itemList.innerHTML = "";

    itemData.forEach(item => {
        let itemDiv = document.createElement("div");
        let buyPrice = item.price * 2; // 顯示 2 倍價格
        itemDiv.classList.add("item", "background");
            
        itemDiv.innerHTML = `
            <div class="column-container" style="cursor: pointer;">
                <span class="column">${item.name}</span>
                <span class="column-small">$${buyPrice}</span>
                <button onclick="buyItem('${item.id}')">
                    <span class="small">購買</span>
                </button>
            </div>
            <div class="hided" style="display: none;">
                <div class="column-container">
                    <p class="column small note">
                        ${item.description}<br>
                        ${item.str ? `力量 ${(item.str > 0 ? `+${item.str}` : item.str)}<br>` : ""}
                        ${item.cha ? `魅力 ${(item.cha > 0 ? `+${item.cha}` : item.cha)}<br>` : ""}
                        ${item.arm ? `護甲 ${(item.arm > 0 ? `+${item.arm}` : item.arm)}<br>` : ""}
                        ${item.dex ? `敏捷 ${(item.dex > 0 ? `+${item.dex}` : item.dex)}` : ""}
                    </p>
                    <!-- 如果是商店，顯示偷竊按鈕 -->
                    ${itemType ? `<button onclick="stealItem('${item.id}')" style="margin: auto;">
                        <span class="small warn">偷竊</span>
                    </button>` : ""}
                </div>
            </div>

        `;
        // 點擊物品時，顯示或隱藏詳細資訊
        let itemElement = itemDiv.querySelector(".column-container");
        let hidedElement = itemDiv.querySelector(".hided");

        itemElement.addEventListener("click", () => {
            hidedElement.style.display = (hidedElement.style.display === "none") ? "block" : "none";
        });

        itemList.appendChild(itemDiv);
    });
    window.scrollTo({ top: 0, behavior: "smooth" }); // 跳到畫面上方
}

// 購買
function buyItem(itemId) {
    let playerMoney = parseInt(localStorage.getItem("playerMoney")) || 0;
    let playerItems = JSON.parse(localStorage.getItem("playerItems")) || [];

    // 找到這件商品的資料
    let item = itemDatabase.find(i => i.id === itemId);

    if (item) {
        let buyAmount; // 購買數量

        // 讓玩家輸入數量
        let input = prompt(`目前金錢有 $${playerMoney}，要購買幾件？`, "1");

        // 如果玩家按「取消」，則直接結束函式
        if (input === null) {
            return;
        }

        buyAmount = parseInt(input);

        // 驗證輸入是否有效
        if (isNaN(buyAmount) || buyAmount <= 0) {
            alert("請輸入有效的數量");
            return;
        }

        let buyPrice = item.price * 2; // 設定購買價格為 2 倍
        let totalCost = buyPrice * buyAmount; // 計算總價格

        if (playerMoney >= totalCost) {
            // 扣除金錢
            playerMoney -= totalCost;

            // 把物品加入玩家背包 (考慮數量)
            for (let i = 0; i < buyAmount; i++) {
                playerItems.push(itemId);
            }

            // 存回 localStorage
            localStorage.setItem("playerItems", JSON.stringify(playerItems));
            localStorage.setItem("playerMoney", playerMoney);

            // 更新顯示的金錢
            loadPartyData();
        } else {
            alert("金錢不足");
        }
    }
}

    