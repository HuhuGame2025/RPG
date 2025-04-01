// 顯示相關

    // 往下滑動時，隱藏按鈕列
        let lastScrollTop = 0;
        const buttonBar = document.getElementById("buttonBar");

        window.addEventListener("scroll", function() {
            let currentScroll = Math.max(window.scrollY, 0); // 避免 scrollY 變負數

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

    // 畫面置頂
    function goTop() {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // 讀取背景圖
    function loadBackground(image) {
        let savedBackground = localStorage.getItem("savedBackground");
        if (image) {
            // 直接指定
            localStorage.setItem("savedBackground", image);
        } else if (savedBackground) {
            // 沒有指定，就從存檔中讀取
            image = savedBackground;
        } else {
            image = "field"; // 預設為原野背景
        }

        // 根據目前頁面調整圖片路徑
        let folderName = window.location.pathname.split("/").slice(-2, -1)[0];
        if (folderName === "RPG") {
            imagePath = `url('images/${image}.jpg')`;
        } else {
            imagePath = `url('../images/${image}.jpg')`;
        }

        // 顯示背景圖
        document.body.style.backgroundImage = imagePath;
    }

    // 顯示對話
        // 返回上一段對話 next: "back"
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

        // 檢查是否返回上一段對話
        if (key === "back") {
            key = localStorage.getItem("previousKey");
        }

        // 檢查是不是在執行事件
        let event = localStorage.getItem("inEvent");
        if (npcName === event) {
            let lastKey = localStorage.getItem("currentKey"); // 讀取儲存的 key
            if (!key) {
                // 如果沒有指定 key（刷新頁面時）
                key = lastKey || "start"; // 讀取儲存的 key 以繼續進度（沒有儲存就從start開始）
            } else {
                // 如果有指定 key

                // 先將上次儲存的 key 存為「先前的 key」
                if (lastKey && lastKey !== key) {
                    localStorage.setItem("previousKey", lastKey);
                }

                // 再儲存新的 key ，以便刷新時能讀取（在睡覺時重置）
                localStorage.setItem("currentKey", key);
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
        if (dialogue.npc) { // 如果事件中有指定NPC
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
            // 事件的格式
            dialogueContainer.innerHTML = `
                <br>
                <div class="dialogue-text"><span id="npc-text"></span></div>
                <br>
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

        // 替換文字
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
            // 滿足條件才顯示選項
            if (!choice.condition || new Function(`return ${choice.condition}`)()) {
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
            }
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

    // 替換靜態文字
    function replaceText(oldWord, newWord) {
        // 立即替換頁面中的文字
        document.querySelectorAll("*:not(script):not(style)").forEach(node => {
            node.childNodes.forEach(child => {
                if (child.nodeType === 3) { // 只處理文字節點
                    child.textContent = child.textContent.replace(new RegExp(oldWord, "g"), newWord);
                }
            });
        });
    }

    // 替換動態文字
    function observeTextChanges(oldWord, newWord) {
        // 監聽 DOM 變更並自動替換
        const observer = new MutationObserver(() => replaceText(oldWord, newWord));
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // 根據偏好設定，替換 NPC 性別代詞和名字
    function npcPreferences() {
        // 替換性別代名詞
        const npcGender = localStorage.getItem("npcGender") || "he";
        if (npcGender === "he") {
            replaceText("她", "他");
            replaceText("少女", "少年");
        } else if (npcGender === "she") {
            replaceText("他", "她");
            replaceText("其她", "其他");
            replaceText("少年", "少女");
        }

        // 老練的冒險者
        const newReynald = localStorage.getItem("newReynald");
        if(newReynald) {
            replaceText("雷納德", newReynald);
            observeTextChanges("雷納德", newReynald);
        }

        // 獸人狂戰士
        const newTarmuk = localStorage.getItem("newTarmuk");
        if(newTarmuk) {
            replaceText("塔爾穆克", newTarmuk);
            observeTextChanges("塔爾穆克", newTarmuk);
        }
        
        // 吸血鬼刺客
        const newSain = localStorage.getItem("newSain");
        if(newSain) {
            replaceText("賽恩", newSain);
            observeTextChanges("賽恩", newSain);
        }
        
        // 小混混
        const newEdmund = localStorage.getItem("newEdmund");
        if(newEdmund) {
            replaceText("艾德蒙", newEdmund);
            observeTextChanges("艾德蒙", newEdmund);
        }
        
        // 精靈少年
        const newNoirel = localStorage.getItem("newNoirel");
        if(newNoirel) {
            replaceText("諾伊爾", newNoirel);
            observeTextChanges("諾伊爾", newNoirel);
        }

        // 公會NPC
        const newRowan = localStorage.getItem("newRowan");
        if(newRowan) {
            replaceText("羅文", newRowan);
            observeTextChanges("羅文", newRowan);
        }

        // 公會NPC
        const newWood = localStorage.getItem("newWood");
        if(newWood) {
            replaceText("伍德", newWood);
            observeTextChanges("伍德", newWood);
        }

        // 哥布林商人
        const newLazrik = localStorage.getItem("newLazrik");
        if(newLazrik) {
            replaceText("拉茲", newLazrik);
            observeTextChanges("拉茲", newLazrik);
        }

        // 哥布林商人
        const newZibber = localStorage.getItem("newZibber");
        if(newZibber) {
            replaceText("齊布", newZibber);
            observeTextChanges("齊布", newZibber);
        }

        // 吸血鬼抓走的小孩
        const newMarcus = localStorage.getItem("newMarcus");
        if(newMarcus) {
            replaceText("馬卡斯", newMarcus);
            observeTextChanges("馬卡斯", newMarcus);
        }

        // 吸血鬼領主
        const newSelreth = localStorage.getItem("newSelreth");
        if(newSelreth) {
            replaceText("賽爾瑞斯", newSelreth);
            observeTextChanges("賽爾瑞斯", newSelreth);
        }                
    }

// 事件相關

    // 屬性擲骰
        // 骰主角屬性：roll("dex");
        // 骰指定數值：roll("5");
        // 攻擊：roll(attaker.dex, target.dex);
    function roll(attribute1, attribute2 = 10, successKey, failKey) {
        // 讀取主角屬性
        const teamMembers = JSON.parse(localStorage.getItem("teamMembers")) || [];
        member = teamMembers.find(m => m.id === "player");

        const playerAttributes = {
            con: member.con.total,
            str: member.str.total,
            dex: member.dex.total,
            wis: member.wis.total,
            cha: member.cha.total,
        };
        
        // 如果是輸入屬性名稱，就用主角屬性值來骰
        if (attribute1 in playerAttributes) {
            attribute1 = playerAttributes[attribute1];
        }

        // 計算成功率
        let chance = (10 + (attribute1 - attribute2) / 2 ) / 20;

        // 顯示對話(如有指定)、回傳結果
        if (Math.random() <= chance) {
            if (successKey) showDialogue(successKey);
            return { success: true, chance: chance };
        } else {
            if (failKey) showDialogue(failKey);
            return { success: false, chance: chance };
        }
    }

    // 檢查同伴在不在
    function isCompanion(memberName) {
        const teamMembers = JSON.parse(localStorage.getItem("teamMembers")) || [];
        if (memberName) {
            // 如果有指定同伴，回傳該同伴是否在隊伍中
            let member = teamMembers.some(m => m.name === memberName);
            if (member) {
                return true;
            }
        } else {
            // 如果沒有指定，回傳是否有同伴
            if (teamMembers.length > 1) {
                return true;
            }
        }
    }

    // 檢查有沒有某個物品，或指定的金錢
    function isItem(itemId) {
        if (itemId.startsWith("$")) {
            // 如果是 $ 開頭，代表金幣
            let money = parseInt(itemId.slice(1), 10); // 取得 $ 後的金額
            let playerMoney = parseInt(localStorage.getItem("playerMoney")) || 0;
            return playerMoney >= money; // 回傳比較結果
        } else {
            // 如果是物品
            const playerItems = JSON.parse(localStorage.getItem("playerItems")) || [];
            return playerItems.some(i => i === itemId); // 回傳檢查結果
        }
    }

    // 檢查是否已打開開關（事件中的戰鬥或搜刮）
    function isTrue(switchId) {
        const endedSwitchs = JSON.parse(localStorage.getItem("endedSwitchs")) || [];
        return endedSwitchs.includes(switchId); // 如果完成，回傳true
    }

    // 觸發開關（事件中的戰鬥）
    function triggerSwitch(switchId) {
        // 先儲存id，等開關結束或戰鬥勝利後才標記完成
        localStorage.setItem("triggerSwitch", switchId);
    }

    // 打開開關（事件中的戰鬥或搜刮）
        // 打開：turnSwitch("bossFight");
        // 關閉：turnSwitch("chestLoot", false);
        // 讀取triggerSwitch並打開：turnSwitch();
        // 讀取triggerSwitch並關閉：turnSwitch(undefined, false);
    function turnSwitch(switchId, status = true) {
        // 如果沒有指定 switchId，就讀取目前觸發的開關
        if (!switchId) {
            switchId = localStorage.getItem("triggerSwitch");
            localStorage.removeItem("triggerSwitch"); // 清除觸發開關
        }

        // 讀取已結束的開關列表
        let endedSwitchs = JSON.parse(localStorage.getItem("endedSwitchs")) || [];

        if (status) {
            // 標記開關為完成（避免重複加入）
            if (!endedSwitchs.includes(switchId)) {
                endedSwitchs.push(switchId);
            }
        } else {
            // 取消標記開關（從已完成列表移除）
            endedSwitchs = endedSwitchs.filter(e => e !== switchId);
        }

        // 更新 localStorage
        localStorage.setItem("endedSwitchs", JSON.stringify(endedSwitchs));
    }

    // 退出事件
    function exitEvent() {
        localStorage.removeItem("inEvent"); // 清除事件
        removeDialogue(); // 清除對話
    
        // 如果有 showSituation 這個函式才執行
        if (typeof showSituation === "function") {
            showSituation();
        }
    }

    // 完成事件
    function completedEvents(event) {
        let completedEvents = JSON.parse(localStorage.getItem("completedEvents")) || [];
        completedEvents.push(event);
        localStorage.setItem("completedEvents", JSON.stringify(completedEvents));
    }

    // 讀取事件進度
    function loadEvent() {
        // 如果在事件中就讀取進度
        const inEvent = localStorage.getItem("inEvent");
        if (inEvent) {
            localStorage.setItem("npcName", inEvent); // 用對話系統執行事件
            showDialogue(); // 從上次的進度繼續
        }
        console.log(inEvent);
        return inEvent;
    }

// 隊伍相關

    // 傭兵資料庫
    const mercenaries = [
        { name: "雷納德", type: "傭兵", description: "老練的冒險者，飽經風霜的臉龐洋溢著溫暖的微笑。", cost: 0, con: 15, str: 15, dex: 12, wis: 14, cha: 12, weaponId: "npcWeapon01", armorId: "npcArmor01" },
        { name: "塔爾穆克", type: "傭兵", description: "身材魁武的獸人狂戰士，背著一把巨大的戰斧，眼神充滿怒火。", cost: 150, con: 18, str: 18, dex: 9, wis: 10, cha: 7, weaponId: "npcWeapon02", armorId: "npcArmor02" },
        { name: "賽恩", type: "傭兵", description: "蒙面的刺客，整張臉隱藏在面罩下，沉默寡言，散發著一絲危險氣息。", cost: 120, con: 12, str: 14, dex: 18, wis:14, cha: 10, weaponId: "npcWeapon03", armorId: "npcArmor03" },
        { name: "艾德蒙", type: "傭兵", description: "看起來像個小混混，不太正經，喜歡自吹自擂，給人感覺不怎麼可靠。", cost: 100, con: 12, str: 12, dex: 10, wis: 8, cha: 8, weaponId: "npcWeapon04", armorId: "npcArmor04" },
        { name: "諾伊爾", type: "傭兵", description: "初出茅廬的高等精靈少年，一臉純真，但比起協助你，他看起來更需要協助。", cost: 90, con: 9, str: 9, dex: 14, wis: 16, cha: 18, weaponId: "npcWeapon05", armorId: "npcArmor05" }
    ];

    // 讀取隊伍資料
    function loadPartyData() {
        // 讀取隊伍資料
        let teamMembers = JSON.parse(localStorage.getItem("teamMembers")) || [];

        teamMembers.forEach((member, index) => {
            let memberItem = document.getElementById(member.id);

            // 顯示成員資料
            if (memberItem) {
                memberItem.style.display = "block";
                if (document.getElementById(`${member.id}-name`)) {
                    document.getElementById(`${member.id}-name`).textContent = member.name;
                }
                if (document.getElementById(`${member.id}-type`)) {
                    document.getElementById(`${member.id}-type`).textContent = member.type;
                }
                if (document.getElementById(`${member.id}-MaxHP`)) {
                    document.getElementById(`${member.id}-MaxHP`).textContent = member.MaxHP;
                }
                if (document.getElementById(`${member.id}-HP`)) {
                    document.getElementById(`${member.id}-HP`).textContent = member.HP;
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

    // 主角加入隊伍（創角時）
    function playerToTeamMembers() {
        let teamMembers = JSON.parse(localStorage.getItem("teamMembers")) || [];

        // 讀取主角資料
        const playerData = {
            name: localStorage.getItem("playerName"),
            id: "player",
            type: localStorage.getItem("PlayerType"),
            HP: parseInt(localStorage.getItem("playerHP")),
            MaxHP: parseInt(localStorage.getItem("playerMaxHP")),
            str: { basic: parseInt(localStorage.getItem("playerStr")) },
            dex: { basic: parseInt(localStorage.getItem("playerDex")) },
            con: { basic: parseInt(localStorage.getItem("playerCon")) },
            wis: { basic: parseInt(localStorage.getItem("playerWis")) },
            cha: { basic: parseInt(localStorage.getItem("playerCha")) },
            arm: { basic: 0 },
            weapon: {},
            armor: {},
            MaxHP: parseInt(localStorage.getItem("playerMaxHP")),
            HP: parseInt(localStorage.getItem("playerMaxHP")),
            status: [], // 初始狀態
            mood: 0,
            emotion: [], // 初始狀態
            description: "",
        };

        // 加總屬性
        ["str", "dex", "con", "wis", "cha", "arm"].forEach(attr => {
            playerData[attr].total = Object.entries(playerData[attr])
                .filter(([key]) => key !== "total") // 過濾掉 "total"
                .reduce((sum, [, val]) => sum + val, 0); // 累加數值
        });

        // 檢查隊伍內是否已有主角
        let playerIndex = teamMembers.findIndex(member => member.id === "player");

        if (playerIndex !== -1) {
            // 如果找到主角，更新資料
            teamMembers[playerIndex] = playerData;
        } else {
            // 否則將主角加入隊伍
            teamMembers.push(playerData);
        }

        // 儲存隊伍成員
        localStorage.setItem("teamMembers", JSON.stringify(teamMembers));

        // 穿布衣
        equip("player", "clothes01"); 

        // 添加情緒
        getEmotion("player", "fullHP"); 


        console.log("隊伍更新:", teamMembers);
    }

    // 同伴加入隊伍
    function addCompanion(companion) {
        // 讀取隊伍資料
        let teamMembers = JSON.parse(localStorage.getItem("teamMembers")) || [];

        // 如果有形容詞，則加到名字前面
        let companionName = companion.adj ? `${companion.adj}${companion.name}` : companion.name;

        // 生成同伴的id
        const companionId = `companion${teamMembers.length}`;

        // 添加同伴資料並設定初始的HP和MaxHP
        teamMembers.push({
            name: companionName, // 加入處理後的名字
            id: companionId,  // 自動產生 id
            type: companion.type,
            str: { basic: companion.str, },
            dex: { basic: companion.dex, },
            con: { basic: companion.con, },
            wis: { basic: companion.wis, },
            cha: { basic: companion.cha, },
            arm: { basic: 0 },
            MaxHP: companion.con * 3, // MaxHP
            HP: companion.con * 3, // 初始HP
            status: [], // 初始狀態
            mood: 0,
            emotion: [], // 初始狀態
            description: companion.description,
        });

        // 儲存
        localStorage.setItem("teamMembers", JSON.stringify(teamMembers));

        // 將同伴裝備加入物品中並穿上
        if (companion.weaponId) {
            getItem(companion.weaponId);
            equip(companionId, companion.weaponId);
        }
        if (companion.armorId) {
            getItem(companion.armorId);
            equip(companionId, companion.armorId);
        }
        console.log("同伴加入", teamMembers);

        // 添加滿血情緒
        getEmotion(companionId, "fullHP"); 
    }

    // 同伴離開隊伍（輸入 id 或 name 都可以）
    function removeCompanion(companionId) {
        // 讀取所有同伴資料
        let teamMembers = JSON.parse(localStorage.getItem("teamMembers")) || [];

        // 找到這名同伴的索引
        let companionIndex = teamMembers.findIndex(m => m.id === companionId || m.name === companionId);
        if (companionIndex === -1) {
            return; // 找不到就不執行
        }

        let companion = teamMembers[companionIndex];

        // 脫下同伴的裝備
        equip(companion.id, "noWeapon");
        equip(companion.id, "noArmor");

        // 從主角物品中移除同伴專屬裝備
        const companionItems = itemDatabase.filter(i => i.owner === companion.name); // 找到專屬裝備
        let playerItems = JSON.parse(localStorage.getItem("playerItems")) || [];
        let newPlayerItems = playerItems.filter(i => !companionItems.some(item => item.id === i));
        localStorage.setItem("playerItems", JSON.stringify(newPlayerItems));

        // 移除該同伴
        teamMembers.splice(companionIndex, 1);

        // 重新排序 id，確保 companion1、companion2、companion3 依序排列
        let companionCount = 1;
        teamMembers.forEach(member => {
            if (member.id.startsWith("companion")) {
                member.id = `companion${companionCount++}`;
            }
        });

        // 更新 localStorage
        localStorage.setItem("teamMembers", JSON.stringify(teamMembers));

        // 如果是賽恩，取消「用血支付賽恩」的標記
        if (companion.name === "賽恩") {
            turnSwitch("用血支付賽恩", false);
        }
    }

    // 回滿隊伍 HP
    function resetHP() {
        // 讀取隊伍資訊
        const teamMembers = JSON.parse(localStorage.getItem("teamMembers")) || [];

        teamMembers.forEach(member => {
            member.HP = member.MaxHP; // 將 HP 設為最大值
        });
        
        localStorage.setItem("teamMembers", JSON.stringify(teamMembers));

        teamMembers.forEach(member => {
            getEmotion(member.id, "fullHP"); // 添加情緒
        });
    }

    // 顯示隊伍健康程度
    function showTeamHealth() {
        const texts = {
            good: "精力充沛",
            faint: "奄奄一息",
            bad: "非常疲憊",
            okay: "目前還有體力",
        };

        // 讀取隊伍資訊
        const teamMembers = JSON.parse(localStorage.getItem("teamMembers")) || [];

        // 顯示同伴
        const menu = document.getElementById("companion-list");
        menu.innerHTML = "";
    
        teamMembers.forEach(member => {
            let memberDiv = document.createElement("div");
            memberDiv.innerHTML = `
                <div class="column-container item background">
                    <div class="column-name">
                        <h4>${member.name}</h4>
                        <h4 class="hp">${member.HP} / ${member.MaxHP}</h4>
                    </div>
                    <div class="column">
                        <span id="${member.id}-action" class="battle-text"></span>
                    </div>
                </div>
            `;
            menu.appendChild(memberDiv);

            // 顯示文本
            let actionElement = document.getElementById(`${member.id}-action`);
            if (!actionElement) {
                console.warn(`找不到ID為 ${member.id}-action 的元素`);
                return;
            }

            if (member.HP === member.MaxHP) {
                actionElement.textContent = texts.good; // 滿血
            } else if (member.HP <= 0) {
                actionElement.textContent = texts.faint; // 昏迷
            } else if (member.HP <= member.MaxHP * 0.5) {
                actionElement.textContent = texts.bad; // 重傷
            } else {
                actionElement.textContent = texts.okay; // 輕傷
            }
        });
    }

// 主角相關

    // 主角 HP 增減
    function addPlayerHP(amount) {
        let teamMembers = JSON.parse(localStorage.getItem("teamMembers")) || [];
        let player = teamMembers.find(m => m.id === "player");
        player.HP += amount;
        player.HP = Math.min(player.HP, player.MaxHP); // 確保 HP 不超過最大 HP
        localStorage.setItem("teamMembers", JSON.stringify(teamMembers));
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

    // 主角的身分變更
    function changePlayerType(type) {
        let teamMembers = JSON.parse(localStorage.getItem("teamMembers")) || [];
        let player = teamMembers.find(m => m.id === "player");
        player.type = type;
        localStorage.setItem("teamMembers", JSON.stringify(teamMembers));
    }

    // 被囚禁
    function captured(type) {
        // 所有同伴退出隊伍
        removeCompanion("companion3");
        removeCompanion("companion2");
        removeCompanion("companion1");

        // 沒收物品
        itemsGone();

        // 主角的身分變更
        changePlayerType(type);

        // 主角穿上布衣
        equip("player", "lootclothes01");
    }

    // 被逮捕
    function arrested() {
        captured("囚犯");

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

        // 重置牢內變數
        localStorage.removeItem("timesCount");
        localStorage.removeItem("guardAction");
        localStorage.removeItem("searchResult");
        localStorage.removeItem("findMoney");
        localStorage.removeItem("unlockCell1");
        localStorage.removeItem("unlockCell2");
        localStorage.removeItem("unlockCell3");
        localStorage.removeItem("unlockCell4");
        localStorage.removeItem("currentKey") // 清除key，重置一天進度

        // 設定事件
        let event = "坐牢";
        localStorage.setItem("inEvent", event); // 儲存事件
        localStorage.setItem("npcName", event); // 用對話系統執行事件

        // 跳轉到監獄頁面（根據當前頁面判斷路徑）
        const pageName = window.location.pathname.split("/").pop();
        if (pageName === "map.html" || pageName === "battle.html") {
            window.location.href = "locations/prison.html";
        } else {
            window.location.href = "prison.html";
        }
    }

    // 被釋放（還沒用到）
    function released() {
        // 取回物品
        itemsBack();

        // 主角的身分改為冒險者
        changePlayerType("冒險者");
    }

// 物品相關

    // 物品資料庫
    const itemDatabase = [
        // 商店定價
            // 穿刺、遠程武器價格 = (str-3) * 10
            // 鈍擊武器價格 = (str-3) * 10 + 5
            // 揮砍武器架格 = (str-5) * 10 + 5
            // 盔甲價格 = arm * 10
            // 服裝價格 = cha * 15

        // 武器
            // 商店貨
            { type: "weapon", category: "穿刺", id: "dagger01", name: "🗡️ 匕首", str: 4, dex: 0, description: "適合隨身攜帶的短劍。", price: 10, shop: "blacksmith" },
            { type: "weapon", category: "穿刺", id: "spear01", name: "✒️ 長矛", str: 8, dex: -1, needStr: 10, description: "用來刺擊的長柄武器。", price: 50, shop: "blacksmith" },
            { type: "weapon", category: "鈍擊", id: "hammer01", name: "🔨 釘頭錘", str: 6, dex: 0, description: "單手捶打用的鈍器。", price: 35, shop: "blacksmith" },
            { type: "weapon", category: "鈍擊", id: "hammer02", name: "🔨 戰錘", str: 10, dex: -2, needStr: 14, description: "給予沉重打擊的長柄武器。", price: 75, shop: "blacksmith" },
            { type: "weapon", category: "揮砍", id: "sword01", name: "🗡️ 單手劍", str: 8, dex: 0, description: "戰士的標準配備。", price: 35, shop: "blacksmith" },
            { type: "weapon", category: "揮砍", id: "sword02", name: "🗡️ 巨劍", str: 12, dex: -1, needStr: 12, description: "雙手持握的大型劍。", price: 75, shop: "blacksmith" },
            { type: "weapon", category: "揮砍", id: "axe01", name: "🪓 戰斧", str: 14, dex: -2, needStr: 14, description: "殺傷力驚人的長柄武器。", price: 95, shop: "blacksmith" },
            { type: "weapon", category: "遠程", id: "bow01", name: "🏹 短弓", str: 6, dex: 0, description: "能瞄準地面與空中的敵人。", price: 30, shop: "blacksmith" },
            //{ type: "weapon", category: "穿刺", id: "arrow01", name: "➶ 箭矢", str: 1, dex: 0, description: "射擊用的箭矢，緊急時可以拿來防身。", price: 1, shop: "blacksmith" },
            { type: "weapon", category: "鈍擊", id: "sheild01", name: "🛡️ 木盾", str: 4, arm: 2, description: "輕型盾牌，能保護自身也能當鈍器使用。", price: 35, shop: "blacksmith" },
            
            // 戰利品
            { type: "weapon", category: "鈍擊", id: "stick01", name: "🔨 小棍棒", str: 1, dex: 0, description: "只是一根普通的樹枝。", price: 0 },
            { type: "weapon", category: "鈍擊", id: "stick02", name: "🔨 巨大的狼牙棒", str: 20, dex: -6, needStr: 20, description: "將樹幹和獸骨綁起來。", price: 10 },
            { type: "weapon", category: "鈍擊", id: "stone", name: "🪨 尖銳的石頭", str: 1, dex: 0, description: "可以藏在衣服裡。", price: 0 },

            // NPC專屬
            { type: "weapon", category: "揮砍", id: "npcWeapon01", name: "🗡️ 雷納德的巨劍", str: 13, dex: -1, needStr: 13, description: "雙手持握的大型長劍。", owner: "雷納德" },
            { type: "weapon", category: "揮砍", id: "npcWeapon02", name: "🪓 塔爾穆克的戰斧", str: 15, dex: -2, needStr: 15, description: "殺傷力驚人的長柄斧。", owner: "塔爾穆克" },
            { type: "weapon", category: "穿刺", id: "npcWeapon03", name: "🗡️ 賽恩的匕首", str: 5, dex: 0, description: "適合隨身攜帶的短劍。", owner: "賽恩" },
            { type: "weapon", category: "揮砍", id: "npcWeapon04", name: "🗡️ 艾德蒙的劍", str: 10, dex: 0, description: "戰士的標準配備。", owner: "艾德蒙" },
            { type: "weapon", category: "遠程", id: "npcWeapon05", name: "🏹 諾伊爾的短弓", str: 10, dex: 0, description: "能瞄準地面與空中的敵人。", owner: "諾伊爾" },

        // 盔甲
            // 商店貨
            { type: "armor", id: "armor01", name: "🛡️ 皮甲", arm: 2, dex: 0, description: "活動性佳的輕型盔甲。", price: 20, shop: "blacksmith" },
            { type: "armor", id: "armor02", name: "🛡️ 鱗甲", arm: 4, dex: 0, description: "以皮革和鐵片製成的鎧甲。", price: 40, shop: "blacksmith" },
            { type: "armor", id: "armor03", name: "🛡️ 鐵製胸甲", arm: 6, dex: 0, description: "包覆軀幹的堅固胸甲。", price: 60, shop: "blacksmith" },
            { type: "armor", id: "armor04", name: "🛡️ 鎖子甲", arm: 8, dex: -1, needStr: 12, description: "以鐵環相扣製成的鎧甲。", price: 80, shop: "blacksmith" },
            { type: "armor", id: "armor05", name: "🛡️ 全身板甲", arm: 10, dex: -2, needStr: 14, description: "完整保護全身的重型盔甲。", price: 100, shop: "blacksmith" },
    
            // NPC專屬
            { type: "armor", id: "npcArmor01", name: "🛡️ 雷納德的胸甲", arm: 6, dex: 0, description: "包覆軀幹的堅固胸甲。", owner: "雷納德" },
            { type: "armor", id: "npcArmor02", name: "🛡️ 塔爾穆克的胸甲", arm: 6, dex: 0, description: "包覆軀幹的堅固胸甲。", owner: "塔爾穆克" },
            { type: "armor", id: "npcArmor03", name: "🛡️ 賽恩的皮甲", arm: 2, dex: 0, description: "活動性佳的輕型盔甲。", owner: "賽恩" },
            { type: "armor", id: "npcArmor04", name: "🛡️ 艾德蒙的鱗甲", arm: 4, dex: 0, description: "以皮革和鐵片製成的鎧甲。", owner: "艾德蒙" },
            { type: "armor", id: "npcArmor05", name: "🛡️ 諾伊爾的皮甲", arm: 2, dex: 0, description: "活動性佳的輕型盔甲。", owner: "諾伊爾" },

        // 服裝（也算盔甲，只是在服飾店販售）
            // 商店貨
                { type: "armor", id: "fineClothes01", name: "🧥 別緻休閒服", cha: 2, dex: 0, 
                  description: "低調奢華的襯衫背心。選用細緻的布料，提供極佳的舒適度。多條皮帶巧妙點綴，勾勒出身材線條，讓人既自在又不失魅力。",
                  price: 30, shop: "clothes" },

                { type: "armor", id: "fineClothes02", name: "🧥 傳說勇者套裝", cha: 3, arm: 2, dex: 0, 
                  description: "以堅固的皮革縫製，兼具美觀與實用性。帥氣的披風隨風飄揚，宛如傳說中的勇者。無論走在街上或身處戰場，都能讓你在人群中脫穎而出。",
                  price: 65, shop: "clothes" },

                { type: "armor", id: "fineClothes03", name: "🧥 優雅貴族正裝", cha: 6, dex: -1, 
                  description: "奢華天鵝絨外套搭配蕾絲內襯，剪裁合身，襯托出尊爵不凡的氣質，使你舉手投足間散發領袖魅力，你的發言將會具有令人無法抗拒的說服力。但緊身設計稍嫌束縛。",
                  price: 90, shop: "clothes" },

                { type: "armor", id: "fineClothes04", name: "🧥 皇家儀式禮服", cha: 8, dex: -2, 
                  description: "由上等絲綢與金線刺繡製成，以璀璨珠寶點綴，象徵尊貴與權勢，無論在哪個場合都能成為萬眾矚目的焦點。穿上後必須保持儀態端莊，無法隨意活動。",
                  price: 120, shop: "clothes" },
            
            // 戰利品
            { type: "armor", id: "clothes01", name: "🧥 布衣", description: "以廉價布料製成的衣服，從一般平民到奴隸都會穿。", price: 1 },
            { type: "armor", id: "clothes02", name: "🧥 工作服", description: "有很多口袋的吊帶褲與襯衫。", price: 2 },
            { type: "armor", id: "clothes03", name: "🧥 旅行服", description: "耐磨、耐髒，適合長途旅行穿著。", price: 2 },

            { type: "armor", id: "lootClothes01", name: "🧥 獸皮背心", arm: 0, dex: 0, description: "粗糙縫合的獸皮，只能勉強遮蔽身體。", price: 0 },
            { type: "armor", id: "lootClothes02", name: "🧥 巨大的腰布", cha: -1, dex: 0, description: "如果不排斥臭味，可以披在身上當斗篷。", price: 0 },
            { type: "armor", id: "lootClothes03", name: "🧥 破爛衣服", cha: 0, dex: 0, description: "已經破到像是一串碎布了。", price: 0 },


        // 消耗品
            { type: "supply", id: "healPotion01", heal: 10, price: 5, name: "🫙 治療藥水", description:"立即恢復生命值。", usable: true, consumable: true, shop: "grocery" },
            { type: "supply", id: "healPotion02", heal: 20, price: 10, name: "🫙 中級治療藥水", description:"立即恢復生命值。", usable: true, consumable: true, shop: "grocery" },
            { type: "supply", id: "healPotion03", heal: 30, price: 15, name: "🫙 高級治療藥水", description:"立即恢復生命值。", usable: true, consumable: true, shop: "grocery" },
            { type: "supply", id: "bandage", price: 1, name: "💰 繃帶", description:"能止住一處流血的傷口。", usable: true, consumable: true, shop: "grocery" },

            { type: "supply", id: "bloodWine", heal: 5, price: 15, name: "🍾 血葡萄酒", description: "以生長在地底的血葡萄釀成的酒，味道像人血，是吸血鬼喜愛的飲品。", usable: true, consumable: true },

        // 料理
            { type: "meal", id: "meal01", heal: 10, price: 1, name: "🍺 啤酒", description: "最受旅人與戰士歡迎的經典佳釀。", shop: "tavern" },  
            { type: "meal", id: "meal02", heal: 10, price: 1, name: "🥧 莓果派", description: "內餡包滿了新鮮野莓的甜派，酸甜可口。", shop: "tavern" },  
            { type: "meal", id: "meal03", heal: 20, price: 2, name: "🥘 奶油蘑菇湯", description: "濃郁奶油加入蘑菇、洋蔥與數種鮮蔬熬煮，溫暖順口，最適合寒冷夜晚享用。", shop: "tavern" },  
            { type: "meal", id: "meal04", heal: 20, price: 2, name: "🍲 麵包配燉肉湯", description: "將肉塊與馬鈴薯、紅蘿蔔燉煮數小時，肉質入口即化，搭配現烤麵包更是絕配。", shop: "tavern" },  
            { type: "meal", id: "meal05", heal: 30, price: 3, name: "🍖 嫩煎羊肋排", description: "將羊肋排以秘製醬汁醃製後，煎至表面焦脆，內部鮮嫩多汁，最適合配上一杯啤酒。", shop: "tavern" },  
            { type: "meal", id: "meal06", heal: 30, price: 3, name: "🍗 香草烤野雞", description: "豪邁地將整隻野雞裹上迷迭香與辛香料，慢火炭烤至外皮金黃香酥，肉汁橫流，香氣四溢。", shop: "tavern" },

        // 戰利品
            { type: "loot", id: "wormLoot", heal: 1, price: 0, name: "💰 蠕蟲", description: "富含營養，但味道噁心，吃了會一整天不舒服。", usable: true, consumable: true },
            { type: "loot", id: "slimeLoot", name: "💰 黏液", description: "史萊姆的黏液。", price: 1 },
            { type: "loot", id: "fur", name: "💰 毛皮", description: "動物的毛皮。", price: 3 },
            { type: "loot", id: "meat", name: "💰 生肉", description: "動物的肉塊。", price: 3 },
            { type: "loot", id: "lizardLoot", name: "💰 斷尾", description: "巨蜥的尾巴。", price: 2 },
            { type: "loot", id: "tusk", name: "💰 獠牙", description: "野豬的獠牙。", price: 4 },
            { type: "loot", id: "spiderLoot", name: "💰 蜘蛛肉", description: "味道像蟹肉。", price: 5 },
            { type: "loot", id: "silk", name: "💰 蜘蛛絲", description: "巨型蜘蛛的絲線。", price: 5 },
            { type: "loot", id: "fairyDust", name: "💰 仙塵", description: "仙子的魔法粉末，通常會邊飛邊灑落。", price: 1 },
            { type: "loot", id: "batLoot", name: "💰 蝙蝠翅膀", description: "蝙蝠的翅膀。", price: 1 },
            { type: "loot", id: "gargoyleLoot", name: "💰 石塊", description: "石像鬼的碎塊。", price: 4 },
            { type: "loot", id: "eagleLoot", name: "💰 堅硬羽毛", description: "巨鷹的羽毛。", price: 10 },
            { type: "loot", id: "dragonLoot", name: "💰 龍鱗", description: "龍的鱗片。", price: 30 },
            { type: "loot", id: "vineLoot", name: "💰 植物莖", description: "切下來的藤蔓。", price: 3 },
            { type: "loot", id: "mushroomLoot", name: "💰 毒蘑菇", description: "不可食用的蘑菇。", price: 2 },
            { type: "loot", id: "manEaterSeed", name: "🫘 食人花種子", description: "蘊藏著蠢蠢欲動的生命，商人不願意買，但有人在公會高價收購。", price: 0 },
            { type: "loot", id: "wood", name: "💰 木材", description: "樹妖的木材。", price: 10 },

            { type: "loot", id: "cloth", name: "💰 布料", description: "拆解衣物得到的碎布。", price: 0 },
            { type: "loot", id: "ironＷire", name: "📎 鐵絲", description: "可以用來撬鎖。", price: 0 },
            { type: "loot", id: "MarcusRing", name: "💍 馬卡斯的戒指", description: "從馬卡斯手上取下的金戒指，看起來很名貴。", price: 200 },

        // 任務物品
            { type: "specialItem", id: "package01", name: "📦 包裹", description: "要送到晨曦鎮的包裹。", price: 20 },
            { type: "specialItem", id: "package01_damaged", name: "📦 破損包裹", description: "要送到晨曦鎮的包裹，被之前遇到的敵人破壞了。", price: 0 },
            { type: "specialItem", id: "package02", name: "📦 包裹", description: "要送到鐵石鎮的包裹。", price: 20 },
            { type: "specialItem", id: "package02_damaged", name: "📦 破損包裹", description: "要送到鐵石鎮的包裹，被之前遇到的敵人破壞了。", price: 0 },
            { type: "specialItem", id: "weaponPack", name: "📦 包好的武器", description: "向哥布林商人買來的，不知道裡面裝著什麼。", price: 0, usable: true, consumable: true },
            { type: "specialItem", id: "armorPack", name: "📦 包好的盔甲", description: "向哥布林商人買來的，不知道裡面裝著什麼。", price: 0, usable: true, consumable: true },
            { type: "specialItem", id: "devilGem01", name: "♦️ 紅寶石", description: "當你盯著這顆紅寶石時，一個聲音在你腦中響起，要你把它拿近一點。", price: 666, investigable: true },
            { type: "specialItem", id: "devilGem02", name: "♦️ 紅寶石", description: "封印著惡魔的紅寶石。", price: 666, investigable: true, usable: true },

            { type: "specialItem", id: "specialItem15", name: "💰 沾到綠血的玻璃", description: "這塊玻璃碎片沾了哥布林的血，讓吸血鬼覺得臭氣熏天。", price: 0 },
            { type: "specialItem", id: "specialItem16", name: "💰 幽靈菇", description: "吃下後不知道會變成怎麼樣的毒菇。", price: 0 },

            { type: "specialItem", id: "key01", name: "🗝️ 牢房鑰匙", description: "可以打開監獄裡任何一間牢房。", price: 50 },
            { type: "specialItem", id: "key02", name: "🗝️ 鐵鑰匙", description: "堅固的鐵製鑰匙。", price: 0 },

    ];

    // 獲得物品或金錢
    function getItem(itemId, count = 1) {
        if (!itemId) {
            return; // 找不到物品就不執行
        }

        if (itemId.startsWith("$")) {
            // 如果是 $ 開頭，代表金幣
            let money = parseInt(itemId.slice(1), 10); // 取得$後的金額
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
            let money = parseInt(itemId.slice(1), 10); // 取得$後的金額
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

    // 穿上或脫下裝備
        // 脫下武器 equip("player", "noWeapon")
        // 脫下盔甲 equip("player", "noArmor")
    function equip(memberId, itemId) {
        // 讀取所有成員的資料
        const teamMembers = JSON.parse(localStorage.getItem("teamMembers")) || [];
        
        // 取得該成員的資料
        let member = teamMembers.find(m => m.id === memberId);

        // 讀取玩家的物品
        let playerItems = JSON.parse(localStorage.getItem("playerItems")) || [];
        let itemType;

        // 如果脫下裝備
        if (itemId === "noWeapon") {
            if (member.weapon) playerItems.push(member.weapon.id); // 將原本的武器放回主角物品
            member.weapon = null; // 清空武器
            itemType = "weapon";
        } else if (itemId === "noArmor") {
            if (member.armor) playerItems.push(member.armor.id); // 將原本的盔甲放回主角物品
            member.armor = null; // 清空盔甲
            itemType = "armor";

        // 如果穿上裝備
        } else {
            //let item = itemDatabase.find(i => i.id === itemId); // 找到這件裝備的資料
            let item = findItemData(itemId); // 從資料庫查找物品
            itemType = item.type;
            if (member[itemType]) playerItems.push(member[itemType].id); // 將原本的裝備放回主角物品
            member[itemType] = item; // 更換裝備

            // 從主角物品中移除穿上的裝備
            const itemIndex = playerItems.findIndex(i => i === itemId);
            if (itemIndex !== -1) {
                playerItems.splice(itemIndex, 1);
            }
        }

        // 取得裝備資料，如果沒有裝備就都是 0
        let item = member[itemType] ? member[itemType] : { str: 0, dex: 0, cha: 0, arm: 0, needStr: 0 };
            
        // 將裝備屬性存入角色屬性中
        member.str[itemType] = item.str || 0;
        member.cha[itemType] = item.cha || 0;
        member.arm[itemType] = item.arm || 0;

        // 檢查力量是否足夠，足夠就不須承受敏捷減值
        if (member.str.basic >= item.needStr) {
            member.dex[itemType] = 0;
        } else {
            member.dex[itemType] = item.dex || 0;
        }

        // 加總屬性
        ["str", "dex", "con", "wis", "cha", "arm"].forEach(attr => {
            member[attr].total = Object.entries(member[attr])
                .filter(([key]) => key !== "total") // 過濾掉 "total"
                .reduce((sum, [, val]) => sum + val, 0); // 累加數值
        });

        // 更新 localStorage
        localStorage.setItem("teamMembers", JSON.stringify(teamMembers));
        localStorage.setItem("playerItems", JSON.stringify(playerItems));

        // 同步儲存到上場成員和可行動成員
        let presentMembers = JSON.parse(localStorage.getItem("presentMembers")) || [];
        let presentData = presentMembers.find(m => m.id === memberId);
        if (presentData) {
            presentData.str = member.str;
            presentData.arm = member.arm;
            presentData.dex = member.dex;
            presentData.cha = member.cha;
            presentData.weapon = member.weapon;
            presentData.armor = member.armor;
        }
        localStorage.setItem("presentMembers", JSON.stringify(presentMembers));

        let actableMembers = JSON.parse(localStorage.getItem("actableMembers")) || [];
        let actableData = actableMembers.find(m => m.id === memberId);
        if (actableData) {
            actableData.str = member.str;
            actableData.arm = member.arm;
            actableData.dex = member.dex;
            actableData.cha = member.cha;
            actableData.weapon = member.weapon;
            actableData.armor = member.armor;
        }
        localStorage.setItem("actableMembers", JSON.stringify(actableMembers));

        // 同步儲存到主角資料
        if (member.id === "player") {
            localStorage.setItem("playerWeapon", JSON.stringify(member.weapon));
            localStorage.setItem("playerArmor", JSON.stringify(member.armor));
        }
    }

    // 顯示商品列表
        // 單個商品 showShop(null, 'weapon01');        
        // 多個商品 showShop(null, ['weapon01', 'armor03', 'supply05']);
    function showShop(shopType, itemIds) {
        let itemData = [];

        // 依商店篩選物品，並顯示商店說明
        if (shopType) {
            itemData = itemDatabase.filter(i => i.shop === shopType); 
            document.getElementById("text").textContent = texts[shopType];
        } else { // 沒有商店，只顯示指定商品
            if (!Array.isArray(itemIds)) {
                itemIds = [itemIds]; // 如果只輸入單一字串，轉成陣列
            }
            itemData = itemDatabase.filter(i => itemIds.includes(i.id));
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
                        <span class="small">${shopType !== "tavern" ? `購買` : `點餐`}</span>
                    </button>
                </div>
                <div class="hided" style="display: none;">
                    <div class="column-container">
                        <p class="column small note">
                            ${item.description ? `${item.description}<br>` : ""}
                            ${item.str ? `力量 ${(item.str > 0 ? `+${item.str}<br>` : item.str)}` : ""}
                            ${item.cha ? `魅力 ${(item.cha > 0 ? `+${item.cha}<br>` : item.cha)}` : ""}
                            ${item.arm ? `護甲 ${(item.arm > 0 ? `+${item.arm}<br>` : item.arm)}` : ""}
                            ${item.dex && !item.needStr ? `敏捷 ${(item.dex > 0 ? `+${item.dex}` : item.dex)}<br>` : ""}
                            ${item.heal ? `恢復 ${item.heal} HP` : ""}
                            ${statusData[item.category] ? `[${item.category}] 造成${statusData[item.category].name}的機率 ${item.str * statusData[item.category].multiplier * 5}%` : ""}
                            ${item.needStr ? `（如果裝備者力量未達 ${item.needStr} 會承受敏捷 ${item.dex} 減值）` : ""}
                        </p>
                        <!-- 如果是商店，顯示偷竊按鈕 -->
                        ${shopType && shopType !== "tavern" ? `<button onclick="stealItem('${item.id}')" style="margin: auto;">
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
            let input = prompt(`目前金錢有 $${playerMoney}，要購買幾份？`, "1");

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

    // 沒收物品
    function itemsGone() {
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
    }

    // 取回物品
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
        //let teamMembers = JSON.parse(localStorage.getItem("teamMembers")) || [];
    
        // 如果艾德蒙在隊伍裡，就取得他的專屬裝備
        //let companion = teamMembers.find(m => m.name === "艾德蒙");
        //if (companion) {
        //    getItem(companion.weaponid);
        //    getItem(companion.armorid);
        //}
    }

    // 找到物品資料（並判斷破舊版）
    function findItemData(itemId) {
        // 忽略 _old 從資料庫中查找原版物品
        let originalId = itemId.replace("_old", "");
        let item = itemDatabase.find(i => i.id === originalId);

        // 如果是破舊版，進行數值調整
        if (itemId.includes("_old")) {
            item = { ...item }; // 建立物品的複製品，避免修改原資料
            item.id = itemId;
            item.str = Math.round(item.str * 2 / 3);
            item.price = Math.round(item.price * 2 / 3);
            item.name += " (破舊)";
        }

        return item;
    }

// 狀態與情緒

    // 狀態資料庫
    const statusData = {
        "穿刺": { icon: "🩸", name: "流血", duration: 3, multiplier: 1 },
        "鈍擊": { icon: "💫", name: "倒地", duration: 1, multiplier: 0.4 },
        "飛行": { icon: "🪽", name: "飛行", duration: 1 },
    };

    // 情緒資料庫
    const emotionData = [
        // 共同
        { type: "good", mood: 1, id: "fullHP", name: "精力充沛", note: "HP全滿", indefinite: true },
        { type: "good", mood: 1, id: "battleWin", name: "戰鬥勝利" },
        { type: "good", mood: 1, id: "criticalHit", name: "打出了爆擊" },
        { type: "good", mood: 1, id: "completeQuest", name: "完成任務" },

        { type: "bad", mood: -1, id: "lowHP", name: "非常疲憊" },
        { type: "bad", mood: -1, id: "knockedDown", name: "在戰鬥中被擊倒" },
        { type: "bad", mood: -1, id: "captured", name: "被俘虜", indefinite: true },
        { type: "bad", mood: -1, id: "soaked", name: "淋成落湯雞", note: "大雷雨時出門", indefinite: true },
        { type: "bad", mood: -1, id: "eatWorm", name: "不舒服", note: "吃下了蠕蟲" },

        // 主角專用
        { type: "good", mood: 1, id: "rich", name: "發財了", note: "擁有 $1000", indefinite: true },
        { type: "good", mood: 1, id: "rewarded", name: "獲得任務報酬", indefinite: true },
        { type: "good", mood: 1, id: "famous", name: "鼎鼎有名", note: "名聲達到 10", indefinite: true },
        { type: "good", mood: 1, id: "hasComp1", name: "擁有一名夥伴", indefinite: true },
        { type: "good", mood: 2, id: "hasComp2", name: "擁有兩名夥伴", indefinite: true },
        { type: "good", mood: 3, id: "hasComp3", name: "擁有三名夥伴", indefinite: true },
        { type: "good", mood: 1, id: "eatTogether", name: "和夥伴聚餐" },

        { type: "bad", mood: -1, id: "poor", name: "沒有錢", note: "財產少於 $ 50", indefinite: true },
        { type: "bad", mood: -1, id: "robbed", name: "被搶劫" },
        { type: "bad", mood: -1, id: "wanted", name: "被通緝", indefinite: true },
        { type: "bad", mood: -1, id: "alone", name: "孤獨", note: "沒有夥伴", indefinite: true },
        { type: "bad", mood: -1, id: "compFaint", name: "擔心夥伴", note: "有夥伴 HP 為 0", indefinite: true },
        
        // 夥伴專用
        { type: "good", mood: 1, id: "treated", name: "隊長請客", note: "你在酒館招待了夥伴" },
        { type: "good", mood: 1, id: "gift", name: "收到禮物" },
        { type: "good", mood: 1, id: "comforted", name: "受到安慰", note: "你安慰了夥伴" },

        // 雷納德
        { type: "good", mood: 1, id: "teamwork", name: "團隊合作", note: "以聯手攻擊終結敵人" },
        { type: "bad", mood: -1, id: "reactToStealing", name: "失望", note: "發現你偷竊" },
        { type: "bad", mood: -1, id: "selfBlame", name: "自責", note: "你在戰鬥中被擊倒" },

        // 塔爾穆克
        { type: "good", mood: 1, id: "kill", name: "殺戮快感", note: "終結敵人" },
        { type: "bad", mood: -1, id: "reactToPeace", name: "無聊，我要看到血流成河", note: "成功說服敵人停戰" },

        // 賽恩
        { type: "good", mood: 1, id: "fedblood", name: "鮮血款待", note: "你主動提供血" },
        { type: "bad", mood: -1, id: "rejected", name: "被拒絕", note: "你拒絕被吸血" },
        { type: "bad", mood: -1, id: "hateVampire", name: "討厭競爭者", note: "隊伍裡有吸血鬼" },

        // 艾德蒙
        { type: "good", mood: 1, id: "gambleWin", name: "賭博贏錢" },
        { type: "good", mood: 1, id: "charmed", name: "賞心悅目", note: "你的魅力大於 15" },
        { type: "bad", mood: -1, id: "gambleLose", name: "賭博輸錢" },

        // 諾伊爾
        { type: "good", mood: 1, id: "peace", name: "和平解決", note: "成功說服敵人停戰" },
        { type: "bad", mood: -1, id: "hateWorm", name: "啊啊啊那是什麼", note: "遇到蠕蟲" },
        
        // 盜賊
        { type: "good", mood: 1, id: "robEnemy", name: "強盜作風", note: "搶劫敵人" },

        // 哥布林
        { type: "good", mood: 1, id: "runaway", name: "逃掉了" },
        { type: "bad", mood: -1, id: "hateOrc", name: "會不會被揍", note: "隊伍裡有塔爾穆克或獸人" },

        // 吸血鬼
        { type: "good", mood: 1, id: "suckBlood", name: "飲血" },
        { type: "bad", mood: -1, id: "stoppedBySain", name: "他以為他是誰", note: "昨晚吸血被賽恩阻止" },
        { type: "bad", mood: -1, id: "hateSun", name: "晴天" },

    ];

    // 獲得情緒
    function getEmotion(memberId, emotionId) {
        // 取得該成員的資料
        let teamMembers = JSON.parse(localStorage.getItem("teamMembers")) || [];
        let member = teamMembers.find(m => m.id === memberId);

        // 找到情緒的資料
        const newEmotion = emotionData.find(e => e.id === emotionId);

        // 如果是無限期情緒，不會重複獲得
        const hasEmotion = member.emotion.find(e => e.id === emotionId);
        if (newEmotion.indefinite && hasEmotion) {
            return;
        }

        // 添加情緒
        member.emotion.push(newEmotion);

        // 計算心情值
        member.mood += newEmotion.mood;

        // 更新心情並儲存
        updateMood(member, teamMembers);
    }

    // 失去情緒
    function loseEmotion(memberId, emotionId) {
        // 取得該成員的資料
        let teamMembers = JSON.parse(localStorage.getItem("teamMembers")) || [];
        let member = teamMembers.find(m => m.id === memberId);

        // 找到情緒的資料
        const lostEmotion = emotionData.find(e => e.id === emotionId);

        // 檢查有沒有這個情緒
        const hasEmotion = member.emotion.find(e => e.id === emotionId);
        if (hasEmotion) {
            // 過濾掉情緒
            member.emotion = member.emotion.filter(e => e.id !== emotionId);

            // 計算心情值
            member.mood -= lostEmotion.mood;

            // 更新心情並儲存
            updateMood(member, teamMembers);
        }
    }

    // 更新心情並儲存
    function updateMood(member, teamMembers) {
        // 重置心情的影響
        member.wis.mood = 0;
        member.dex.mood = 0;

        // 添加心情的影響
        if (member.mood >= 15) {
            member.dex.mood = 2; // 敏捷上升 2
        } else if (member.mood >= 10) {
            member.dex.mood = 1; // 敏捷上升 1
        } else if (member.mood >= 5) {
            member.wis.mood = 1; // 感知上升 1
        } else if (member.mood <= -5) {
            member.wis.mood = -1; // 感知下降 1
        } else if (member.mood <= -10) {
            member.dex.mood = -1; // 敏捷下降 1
        } else if (member.mood <= -15) {
            member.dex.mood = -2; // 敏捷下降 2
        }

        // 加總屬性
        ["str", "dex", "con", "wis", "cha", "arm"].forEach(attr => {
            member[attr].total = Object.entries(member[attr])
                .filter(([key]) => key !== "total") // 過濾掉 "total"
                .reduce((sum, [, val]) => sum + val, 0); // 累加數值
        });

        // 儲存更新後的隊伍資料
        localStorage.setItem("teamMembers", JSON.stringify(teamMembers));
    }
    
// 場景跳轉相關

    // 快速旅行
    function fastTravel() {
        // 讀取最近的城鎮位置
        const townPos = JSON.parse(localStorage.getItem("townPos"));

        // 更新主角的位置
        localStorage.setItem("playerPos", JSON.stringify(townPos));

        // 跳轉到城鎮頁面
        window.location.href = 'locations/town.html';
    }

    // 跳轉場景
    function goTo(location) {
        window.location.href = location + '.html';
    }

    // 指定戰鬥
    function battle(situation, enemyName, enemyCount, destination, successKey, failKey) {
        let encounter;

        // 如果是和對話者戰鬥
        if (enemyName === "npcName") {
            const npcName = localStorage.getItem("npcName");
            const teamMembers = JSON.parse(localStorage.getItem("teamMembers")) || [];
            const member = teamMembers.find(m => m.name === npcName);

            // 如果對方是隨從或俘虜
            if (member && (member.type === "隨從" || member.type === "俘虜")) {
                removeCompanion(member.id); // 先讓對方離隊
                encounter = {
                    situation: situation,
                    enemyAdj: npcName, // 從對話者名字取出形容詞
                    enemyName: npcName, // 對話者名字
                    enemyCount: enemyCount,
                    destination: destination,
                    successKey: successKey,
                    failKey: failKey,
                };
            }

        // 預設戰鬥，將隨機抽形容詞
        } else {
            encounter = {
                situation: situation,
                enemyName: enemyName,
                enemyCount: enemyCount,
                destination: destination,
                successKey: successKey,
                failKey: failKey,
            };
        }

        // 儲存指定遭遇
        localStorage.setItem("encounter", JSON.stringify(encounter));
        console.log(encounter);

        // 跳轉到遭遇頁面（根據目前頁面調整路徑）
        let folderName = window.location.pathname.split("/").slice(-2, -1)[0];
        if (folderName === "RPG") {
            window.location.href = "encounter.html";
        } else {
            window.location.href = "../encounter.html";
        }
    }

    // 新的一天
    function nextDay() {
        // 重置事件進度
        localStorage.removeItem("currentKey"); // 清除對話 key

        // 重置情緒
        let teamMembers = JSON.parse(localStorage.getItem("teamMembers")) || [];
        teamMembers.forEach(member => {
            // 只留下無限期的情緒
            member.emotion = member.emotion.filter(e => e.indefinite === true);

            // 移除大雷雨情緒
            member.emotion = member.emotion.filter(e => e.id !== "soaked");

            // 重新統計心情值
            member.mood = 0;
            member.emotion.forEach(e =>{
                member.mood += e.mood;
            });
        });
        localStorage.setItem("teamMembers", JSON.stringify(teamMembers));

        // 通緝等級每天下降 1 級
        addWantedLevel(-1);

        // 重置酒館
        localStorage.removeItem("tavernClose"); // 重置打烊
        localStorage.removeItem("drinkingStart");
        localStorage.removeItem("drinkingResults");
        localStorage.removeItem("drinkingEnd");

        // 重置雷納德
        turnSwitch("雷納德路過", false);


        // 抽天氣
        const weathers = [ 
            { icon: "☀️", name: "晴天", description: "有陽光，不死生物不會出沒。" },
            { icon: "🌤️", name: "晴時多雲", description: "有陽光，不死生物不會出沒。" },
            { icon: "☁️", name: "多雲", description: "不死生物會出沒。" },
            { icon: "☁️", name: "陰天", description: "不死生物會出沒。" },
            { icon: "🌧️", name: "小雨", description: "植物少量增長，不死生物會出沒。" },
            { icon: "⛈️", name: "大雷雨", description: "智慧生物不會出門，植物大量增長，不死生物會出沒。" },
            { icon: "🌫️", name: "濃霧", description: "容易潛行，不死生物會出沒。" },
            { icon: "🔥", name: "極端炎熱", description: "龍可能會出現，不死生物不會出沒。" },
        ];
        let randomIndex = Math.floor(Math.random() * weathers.length);
        let selectedWeather = weathers[randomIndex];
        localStorage.setItem("weather", JSON.stringify(selectedWeather));
    }