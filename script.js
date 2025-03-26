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
        let savedBackground = localStorage.getItem("backgroundStyle");
        if (image) {
            document.body.style.backgroundImage = "url('images/" + image +".jpg')";
            localStorage.setItem("backgroundStyle", "url('images/" + image +".jpg')");
        } else if (savedBackground) {
            document.body.style.backgroundImage = savedBackground;
        } else {
            document.body.style.backgroundImage = "url('images/field.jpg')"; // 預設為原野背景
        }
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
        } else if (npcGender === "she") {
            replaceText("他", "她");
            replaceText("其她", "其他");
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
    function roll(attribute, successKey, failKey) {
        // 讀取主角屬性
        const playerAttributes = {
            con: parseInt(localStorage.getItem("playerCon")) || 0,
            str: parseInt(localStorage.getItem("playerStr")) || 0,
            dex: parseInt(localStorage.getItem("playerDex")) || 0,
            wis: parseInt(localStorage.getItem("playerWis")) || 0,
            cha: parseInt(localStorage.getItem("playerCha")) || 0,
            totalstr: parseInt(localStorage.getItem("playerTotalStr")) || 0,
            totaldex: parseInt(localStorage.getItem("playerTotalDex")) || 0,
            totalcha: parseInt(localStorage.getItem("playerTotalCha")) || 0,
            totalarm: parseInt(localStorage.getItem("playerTotalArm")) || 0
        };
        
        let difficultyLevel;

        if (attribute in playerAttributes) {
            // 用主角屬性值來骰
            difficultyLevel = playerAttributes[attribute];
        } else {
            // 用輸入的數值來骰
            difficultyLevel = attribute;
        }

        // 擲 1d20 骰子
        const roll = Math.floor(Math.random() * 20) + 1;
        console.log(`${attribute}: ${difficultyLevel}, 擲骰結果: ${roll}`);

        // 回傳結果，顯示對話
        if (roll <= difficultyLevel) {
            if (successKey) showDialogue(successKey);
            return true;
        } else {
            if (failKey) showDialogue(failKey);
            return false;
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
        { name: "諾伊爾", type: "傭兵", description: "初出茅廬的年輕精靈，一臉純真，但比起協助你，他看起來更需要協助。", cost: 90, con: 9, str: 9, dex: 14, wis: 16, cha: 18, weaponId: "npcWeapon05", armorId: "npcArmor05" }
    ];

    // 讀取隊伍資料
    function loadPartyData() {
        // 讀取隊伍資料
        let teamMembers = JSON.parse(localStorage.getItem("teamMembers")) || [];

        teamMembers.forEach((member, index) => {
            let memberItem = document.getElementById(member.id);

            // 顯示同伴資料
            if (memberItem) {
                memberItem.style.display = "block"; // 顯示已雇用的同伴區域
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

    // 同伴加入隊伍
    function addCompanion(companion) {
        // 讀取隊伍資料
        let teamMembers = JSON.parse(localStorage.getItem("teamMembers")) || [];

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

        // 生成同伴的id
        const companionId = `companion${teamMembers.length}`;

        // 添加同伴資料並設定初始的HP和MaxHP
        teamMembers.push({
            name: companionName, // 加入處理後的名字
            id: companionId,  // 自動產生 id
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
            status: [], // 初始狀態
            description: companion.description,
        });

        // 儲存
        localStorage.setItem("teamMembers", JSON.stringify(teamMembers));
        console.log("同伴加入", teamMembers);
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

        // 將 HP 設為最大值
        teamMembers.forEach(member => {
            member.HP = member.MaxHP;
        });
        localStorage.setItem("teamMembers", JSON.stringify(teamMembers));
    }

    // 顯示隊伍健康程度
    function showTeamHealth() {
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
                actionElement.textContent = texts.dead; // 死亡
            } else if (member.HP <= member.MaxHP * 0.5) {
                actionElement.textContent = texts.bad; // 重傷
            } else {
                actionElement.textContent = texts.okay; // 輕傷
            }
        });
    }

// 主角相關

    // 將主角資料更新到隊伍（只有創角時用到）
    function playerToTeamMembers() {
        let teamMembers = JSON.parse(localStorage.getItem("teamMembers")) || [];

        // 讀取主角資料
        const playerData = {
            name: localStorage.getItem("playerName"),
            id: "player",
            type: localStorage.getItem("PlayerType"),
            weapon: JSON.parse(localStorage.getItem("playerWeapon")) || [],
            armor: JSON.parse(localStorage.getItem("playerArmor")) || [],
            HP: parseInt(localStorage.getItem("playerHP")),
            MaxHP: parseInt(localStorage.getItem("playerMaxHP")),
            str: parseInt(localStorage.getItem("playerStr")),
            dex: parseInt(localStorage.getItem("playerDex")),
            con: parseInt(localStorage.getItem("playerCon")),
            wis: parseInt(localStorage.getItem("playerWis")),
            cha: parseInt(localStorage.getItem("playerCha")),
            totalStr: parseInt(localStorage.getItem("playerTotalStr")),
            totalDex: parseInt(localStorage.getItem("playerTotalDex")),
            totalCha: parseInt(localStorage.getItem("playerTotalCha")),
            totalArm: parseInt(localStorage.getItem("playerTotalArm")),
            MaxHP: parseInt(localStorage.getItem("playerMaxHP")),
            HP: parseInt(localStorage.getItem("playerMaxHP")),
            status: [], // 初始狀態
            description: "",
        };

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
        console.log("隊伍更新:", teamMembers);
    }

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
        if (pageName === "map.html") {
            window.location.href = "town/prison.html";
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
        // 武器
            // 商店貨
            { id: "weapon01", type: "weapon", category: "穿刺", name: "🗡️ 匕首", str: 5, dex: 0, description: "適合隨身攜帶的短劍。", price: 10 },
            { id: "weapon02", type: "weapon", category: "鈍擊", name: "🗡️ 硬頭錘", str: 8, dex: 0, description: "單手使用的鈍器。", price: 25 },
            { id: "weapon03", type: "weapon", category: "揮砍", name: "🗡️ 單手劍", str: 10, dex: 0, description: "戰士的標準配備。", price: 45 },
            { id: "weapon04", type: "weapon", category: "揮砍", name: "🗡️ 巨劍", str: 12, dex: -1, needStr: 13, description: "雙手持握的大型劍。<br>❗使用條件：力量 13❗", price: 70 },
            { id: "weapon05", type: "weapon", category: "揮砍", name: "🗡️ 戰斧", str: 15, dex: -2, needStr: 16, description: "殺傷力驚人的重型武器。<br>❗使用條件：力量 16❗", price: 100 },
            { id: "weapon06", type: "weapon", category: "鈍擊", name: "🛡️ 盾牌", str: 5, arm: 5, dex: -1, description: "能保護自身也能當鈍器使用。", price: 45 },
            { id: "weapon07", type: "weapon", category: "遠程", name: "🏹 弓", str: 10, dex: 0, description: "能瞄準空中的敵人。", price: 60 },
            
            // 戰利品
            { id: "lootWeapon01", type: "weapon", category: "穿刺", name: "🗡️ 老舊的匕首", str: 3, dex: 0, description: "適合隨身攜帶的小刀。", price: 7 },
            { id: "lootWeapon02", type: "weapon", category: "鈍擊", name: "🗡️ 老舊的硬頭錘", str: 5, dex: 0, description: "單手使用的鈍器。", price: 17 },
            { id: "lootWeapon03", type: "weapon", category: "揮砍", name: "🗡️ 老舊的單手劍", str: 7, dex: 0, description: "戰士的標準配備。", price: 30 },
            { id: "lootWeapon04", type: "weapon", category: "揮砍", name: "🗡️ 老舊的巨劍", str: 8, dex: -1, needStr: 13, description: "雙手持握的大型劍。<br>❗使用條件：力量 13❗", price: 46 },
            { id: "lootWeapon05", type: "weapon", category: "揮砍", name: "🗡️ 老舊的戰斧", str: 10, dex: -2, needStr: 16, description: "殺傷力驚人的重型武器。<br>❗使用條件：力量 16❗", price: 66 },
            { id: "lootWeapon06", type: "weapon", category: "鈍擊", name: "🛡️ 老舊的盾牌", str: 3, arm: 3, dex: -1, description: "能保護自身也能當鈍器使用。", price: 30 },

            { id: "lootWeapon11", type: "weapon", category: "鈍擊", name: "🗡️ 小棍棒", str: 1, dex: 0, description: "只是一根普通的樹枝。", price: 0 },
            { id: "lootWeapon12", type: "weapon", category: "鈍擊", name: "🗡️ 巨大的狼牙棒", str: 20, dex: -5, needStr: 20, description: "將樹幹和獸骨綁起來。<br>❗使用條件：力量 20❗", price: 10 },
            { id: "lootWeapon13", type: "weapon", category: "鈍擊", name: "🗡️ 尖銳的石頭", str: 1, dex: 0, description: "可以藏在衣服裡。", price: 0 },

            // NPC專屬
            { id: "npcWeapon01", type: "weapon", category: "揮砍", name: "🗡️ 雷納德的巨劍", str: 12, dex: -1, description: "雙手持握的大型劍。", owner: "雷納德" },
            { id: "npcWeapon02", type: "weapon", category: "揮砍", name: "🗡️ 塔爾穆克的戰斧", str: 15, dex: -2, description: "殺傷力驚人的重型武器。", owner: "塔爾穆克" },
            { id: "npcWeapon03", type: "weapon", category: "穿刺", name: "🗡️ 賽恩的匕首", str: 5, dex: 0, description: "適合隨身攜帶的短劍。", owner: "賽恩" },
            { id: "npcWeapon04", type: "weapon", category: "揮砍", name: "🗡️ 艾德蒙的劍", str: 10, dex: 0, description: "戰士的標準配備。", owner: "艾德蒙" },
            { id: "npcWeapon05", type: "weapon", category: "遠程", name: "🏹 諾伊爾的弓", str: 10, dex: 0, description: "能瞄準空中的敵人。", owner: "諾伊爾" },

        // 護具
            // 商店貨
            { id: "armor01", type: "armor", name: "🛡️ 皮甲", arm: 3, dex: 0, description: "活動性佳的輕型盔甲。", price: 10 },
            { id: "armor02", type: "armor", name: "🛡️ 鱗甲", arm: 5, dex: 0, description: "以皮革和鐵片製成的鎧甲。", price: 25 },
            { id: "armor03", type: "armor", name: "🛡️ 鐵製胸甲", arm: 8, dex: 0, description: "包覆軀幹的堅固胸甲。", price: 45 },
            { id: "armor04", type: "armor", name: "🛡️ 鎖子甲", arm: 10, dex: -1, needStr: 11, description: "以鐵環相扣製成的鎧甲。<br>❗使用條件：力量 11❗", price: 70 },
            { id: "armor05", type: "armor", name: "🛡️ 全身板甲", arm: 12, dex: -2, needStr: 13, description: "完整保護全身的重型盔甲。<br>❗使用條件：力量 13❗", price: 100 },
    
            // 戰利品
            { id: "lootArmor01", type: "armor", name: "🛡️ 老舊的皮甲", arm: 2, dex: 0, description: "活動性佳的輕型盔甲。", price: 7 },
            { id: "lootArmor02", type: "armor", name: "🛡️ 老舊的鱗甲", arm: 3, dex: 0, description: "以皮革和鐵片製成的鎧甲。", price: 17 },
            { id: "lootArmor03", type: "armor", name: "🛡️ 老舊的鐵製胸甲", arm: 5, dex: -1, description: "包覆軀幹的堅固胸甲。", price: 30 },
            { id: "lootArmor04", type: "armor", name: "🛡️ 老舊的鎖子甲", arm: 7, dex: -1, needStr: 11, description: "以鐵環相扣製成的鎧甲。<br>❗使用條件：力量 11❗", price: 46 },
            { id: "lootArmor05", type: "armor", name: "🛡️ 老舊的全身板甲", arm: 8, dex: -2, needStr: 13, description: "完整保護全身的重型盔甲。<br>❗使用條件：力量 13❗", price: 66 },

            { id: "lootArmor11", type: "armor", name: "🛡️ 獸皮背心", arm: 0, dex: 0, description: "只能勉強遮蔽身體。", price: 1 },
            { id: "lootArmor12", type: "armor", name: "🛡️ 巨大的腰布", arm: 1, dex: 0, description: "可以披在身上當斗篷。", price: 0 },

            // NPC專屬
            { id: "npcArmor01", type: "armor", name: "🛡️ 雷納德的胸甲", arm: 8, dex: 0, description: "包覆軀幹的堅固胸甲。", owner: "雷納德" },
            { id: "npcArmor02", type: "armor", name: "🛡️ 塔爾穆克的胸甲", arm: 8, dex: 0, description: "包覆軀幹的堅固胸甲。", owner: "塔爾穆克" },
            { id: "npcArmor03", type: "armor", name: "🛡️ 賽恩的皮甲", arm: 3, dex: 0, description: "活動性佳的輕型盔甲。", owner: "賽恩" },
            { id: "npcArmor04", type: "armor", name: "🛡️ 艾德蒙的鱗甲", arm: 5, dex: 0, description: "以皮革和鐵片製成的鎧甲。", owner: "艾德蒙" },
            { id: "npcArmor05", type: "armor", name: "🛡️ 諾伊爾的皮甲", arm: 3, dex: 0, description: "活動性佳的輕型盔甲。", owner: "諾伊爾" },

        // 服裝（也算護具，只是在服飾店販售）
            // 商店貨
            { id: "clothes01", type: "armor", name: "🧥 別緻休閒服", cha: 3, dex: 0, 
              description: "低調奢華的襯衫背心。選用細緻的布料，提供極佳的舒適度。多條皮帶巧妙點綴，勾勒出身材線條，讓人既自在又不失魅力。",
              price: 45 },

            { id: "clothes02", type: "armor", name: "🧥 傳說勇者套裝", cha: 3, arm: 3, dex: 0, 
              description: "以堅固的皮革縫製，兼具美觀與實用性。帥氣的披風隨風飄揚，宛如傳說中的勇者。無論走在街上或身處戰場，都能讓你在人群中脫穎而出。",
              price: 55 },

            { id: "clothes04", type: "armor", name: "🧥 優雅貴族正裝", cha: 5, dex: -1, 
              description: "奢華天鵝絨外套搭配蕾絲內襯，剪裁合身，襯托出尊爵不凡的氣質，使你舉手投足間散發領袖魅力，你的發言將會具有令人無法抗拒的說服力。但緊身設計稍嫌束縛。",
              price: 70 },

            { id: "clothes05", type: "armor", name: "🧥 皇家儀式禮服", cha: 8, dex: -2, 
              description: "由上等絲綢與金線刺繡製成，象徵尊貴與權勢，無論在哪個場合都能成為眾人矚目的焦點。穿上後必須保持儀態端莊，無法作出大幅度的動作。",
              price: 100 },
            //{ id: "clothes01", type: "armor", name: "🧥 別緻休閒服", cha: 5, dex: 0, description: "低調奢華的襯衫背心，以多條皮帶裝飾，凸顯身材曲線", price: 50 },
            //{ id: "clothes02", type: "armor", name: "🧥 冒險家套裝", cha: 5, arm: 5, dex: 0, description: "美觀兼具實用性，帥氣的披風在身後飄揚，還原人們心目中的勇者形象", price: 100 },
            //{ id: "clothes03", type: "armor", name: "🧥 優雅正裝", cha: 10, dex: -1, description: "能襯托出高貴身分的正式服裝", price: 100 },
            //{ id: "clothes04", type: "armor", name: "🧥 貴族晚禮服", cha: 15, dex: -2, description: "極為華麗，能成為目光焦點，但穿起來十分緊繃", price: 150 },
            
            // 戰利品
            { id: "lootclothes01", type: "armor", name: "🧥 布衣", description: "以廉價布料製成的衣服，從平民到奴隸都會穿。", price: 2 },
            //{ id: "lootclothes02", type: "armor", name: "🧥 囚服", description: "囚犯穿的衣服。", price: 1 },

        // 消耗品
            { id: "supply01", type: "supply", name: "🫙 治療藥水", description:"立即恢復生命值。", heal: 10, price: 5, usable: "true", consumable: "true"},
            { id: "supply02", type: "supply", name: "🫙 中級治療藥水", description:"立即恢復生命值。", heal: 20, price: 10, usable: "true", consumable: "true" },
            { id: "supply03", type: "supply", name: "🫙 高級治療藥水", description:"立即恢復生命值。", heal: 30, price: 15, usable: "true", consumable: "true" },

            { id: "lootSupply01", type: "supply", name: "🫙 蟲血", heal: 1, description: "富含營養，只是難以下嚥，常被當成打賭輸了的懲罰。", price: 0, usable: "true", consumable: "true" },
            { id: "lootSupply02", type: "supply", name: "🍾 血葡萄酒", heal: 5, description: "以生長在地底的血葡萄釀成的酒，味道像人血，是吸血鬼喜愛的飲品。", price: 15, usable: "true", consumable: "true" },

        // 戰利品
            { id: "loot01", type: "loot", name: "💰 龍鱗", description: "龍的鱗片。", price: 60 },
            { id: "loot02", type: "loot", name: "💰 蜥蜴尾巴", description: "火蜥蜴的尾巴，可以販賣。", price: 8 },
            { id: "loot03", type: "loot", name: "💰 仙粉", description: "仙子的魔法粉末，可以販賣。", price: 5 },
            { id: "loot04", type: "loot", name: "💰 狼皮", description: "野狼的毛皮，可以販賣。", price: 12 },
            { id: "loot05", type: "loot", name: "💰 狐狸皮", description: "狐狸的毛皮，可以販賣。", price: 6 },
            { id: "loot06", type: "loot", name: "💰 蜘蛛絲", description: "巨型蜘蛛的絲線，可以販賣。", price: 18 },
            { id: "loot07", type: "loot", name: "💰 木材", description: "樹妖的木材，可以販賣。", price: 10 },
            { id: "loot08", type: "loot", name: "🫘 食人花種子", description: "蘊藏著蠢蠢欲動的生命，商人不願意買，但有人在公會高價收購。", price: 0 },
            { id: "loot09", type: "loot", name: "💰 堅硬羽毛", description: "獅鷲的羽毛，可以販賣。", price: 30 },
            { id: "loot10", type: "loot", name: "💰 鐵絲", description: "可以用來撬鎖。", price: 0 },
            { id: "loot11", type: "loot", name: "💰 馬卡斯的戒指", description: "從馬卡斯手上取下的金戒指。", price: 200 },
            { id: "loot12", type: "loot", name: "💰 植物莖", description: "切下來的藤蔓，可以販賣。", price: 5 },
            { id: "loot13", type: "loot", name: "💰 毒蘑菇", description: "不可食用的蘑菇，可以販賣。", price: 3 },
            { id: "loot14", type: "loot", name: "💰 獠牙", description: "野豬的獠牙，可以販賣。", price: 10 },

        // 任務物品
            { id: "specialItem01", type: "specialItem", name: "📦 包裹", description: "要送到晨曦鎮的包裹。", price: 20 },
            { id: "specialItem02", type: "specialItem", name: "📦 破損包裹", description: "要送到晨曦鎮的包裹，被之前遇到的敵人破壞了。", price: 0 },
            { id: "specialItem03", type: "specialItem", name: "📦 包裹", description: "要送到鐵石鎮的包裹。", price: 20 },
            { id: "specialItem04", type: "specialItem", name: "📦 破損包裹", description: "要送到鐵石鎮的包裹，被之前遇到的敵人破壞了。", price: 0 },

            { id: "specialItem11", type: "specialItem", name: "📦 包好的武器", description: "向哥布林商人買來的，不知道裡面裝著什麼。", price: 0, usable: "true", consumable: "true" },
            { id: "specialItem12", type: "specialItem", name: "📦 包好的護具", description: "向哥布林商人買來的，不知道裡面裝著什麼。", price: 0, usable: "true", consumable: "true" },
            { id: "specialItem13", type: "specialItem", name: "♦️ 紅寶石", description: "當你盯著這顆紅寶石時，一個聲音在你腦中響起，要你把它拿近一點。", price: 666, investigable: "true" },
            { id: "specialItem14", type: "specialItem", name: "♦️ 紅寶石", description: "封印著惡魔的紅寶石。", price: 666, investigable: "true", usable: "true" },
            { id: "specialItem15", type: "specialItem", name: "📦 沾到綠血的玻璃", description: "這塊玻璃碎片沾了哥布林的血，讓吸血鬼覺得臭氣熏天。", price: 0 },
            { id: "specialItem16", type: "specialItem", name: "📦 幽靈菇", description: "吃下後不知道會變成怎麼樣的毒菇。", price: 0 },

            { id: "key01", type: "specialItem", name: "🗝️ 牢房鑰匙", description: "可以打開監獄裡任何一間牢房。", price: 50 },
            { id: "key02", type: "specialItem", name: "🗝️ 鐵鑰匙", description: "堅固的鐵製鑰匙。", price: 0 },

        // 料理
            { id: "meal01", type: "meal", name: "🍺 啤酒", description: "最受旅人與戰士歡迎的經典佳釀。", heal: 10, price: 1},  
            { id: "meal02", type: "meal", name: "🥧 莓果派", description: "內餡包滿了新鮮野莓的甜派，酸甜可口。", heal: 10, price: 1},  
            { id: "meal03", type: "meal", name: "🥘 奶油蘑菇湯", description: "濃郁奶油加入蘑菇、洋蔥與數種鮮蔬熬煮，溫暖順口，最適合寒冷夜晚享用。", heal: 20, price: 2},  
            { id: "meal04", type: "meal", name: "🍲 麵包配燉肉湯", description: "將肉塊與馬鈴薯、紅蘿蔔燉煮數小時，肉質入口即化，搭配現烤麵包更是絕配。", heal: 20, price: 2},  
            { id: "meal05", type: "meal", name: "🍖 嫩煎羊肋排", description: "將羊肋排以秘製醬汁醃製後，煎至表面焦脆，內部鮮嫩多汁，最適合配上一杯啤酒。", heal: 30, price: 3},  
            { id: "meal06", type: "meal", name: "🍗 香草烤野雞", description: "豪邁地將整隻野雞裹上迷迭香與辛香料，慢火炭烤至外皮金黃香酥，肉汁橫流，香氣四溢。", heal: 30, price: 3}  
    ];

    // 狀態資料庫
    const statusData = {
        "穿刺": { name: "流血", duration: 3 },
        "鈍擊": { name: "倒地", duration: 1 },
    };

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
        // 脫下護具 equip("player", "noArmor")
    function equip(memberId, itemId) {
        // 讀取所有成員的資料
        const teamMembers = JSON.parse(localStorage.getItem("teamMembers")) || [];

        // 取得該成員的資料
        let member = teamMembers.find(m => m.id === memberId);

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

            // 檢查力量是否足夠
            if (member.str < item.needStr) {
                alert("力量不足，無法使用");
                return;
            }

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
        localStorage.setItem("teamMembers", JSON.stringify(teamMembers));
        localStorage.setItem("playerItems", JSON.stringify(playerItems));

        // 同步儲存到上場成員和可行動成員
        let presentMembers = JSON.parse(localStorage.getItem("presentMembers")) || [];
        let presentData = presentMembers.find(m => m.id === memberId);
        if (presentData) {
            presentData.totalStr = member.totalStr;
            presentData.totalArm = member.totalArm;
            presentData.totalDex = member.totalDex;
            presentData.totalCha = member.totalCha;
            presentData.weapon = member.weapon;
            presentData.armor = member.armor;
        }
        localStorage.setItem("presentMembers", JSON.stringify(presentMembers));

        let actableMembers = JSON.parse(localStorage.getItem("actableMembers")) || [];
        let actableData = actableMembers.find(m => m.id === memberId);
        if (actableData) {
            actableData.totalStr = member.totalStr;
            actableData.totalArm = member.totalArm;
            actableData.totalDex = member.totalDex;
            actableData.totalCha = member.totalCha;
            actableData.weapon = member.weapon;
            actableData.armor = member.armor;
        }
        localStorage.setItem("actableMembers", JSON.stringify(actableMembers));

        // 同步儲存到主角資料
        if (member.id === "player") {
            localStorage.setItem("playerWeapon", JSON.stringify(member.weapon));
            localStorage.setItem("playerArmor", JSON.stringify(member.armor));
            localStorage.setItem("playerTotalStr", member.totalStr);
            localStorage.setItem("playerTotalArm", member.totalArm);
            localStorage.setItem("playerTotalDex", member.totalDex);
            localStorage.setItem("playerTotalCha", member.totalCha);
        }
    }

    // 顯示商品列表
        // 單個商品 showShop(null, 'weapon01');        
        // 多個商品 showShop(null, ['weapon01', 'armor03', 'supply05']);
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
        } else if (itemType === "meal") { // 酒館
            itemData = itemDatabase.filter(i => i.id.startsWith(itemType));
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
                        <span class="small">${itemType !== "meal" ? `購買` : `點餐`}</span>
                    </button>
                </div>
                <div class="hided" style="display: none;">
                    <div class="column-container">
                        <p class="column small note">
                            ${item.description ? `${item.description}<br>` : ""}
                            ${item.str ? `力量 ${(item.str > 0 ? `+${item.str}<br>` : item.str)}` : ""}
                            ${item.cha ? `魅力 ${(item.cha > 0 ? `+${item.cha}<br>` : item.cha)}` : ""}
                            ${item.arm ? `護甲 ${(item.arm > 0 ? `+${item.arm}<br>` : item.arm)}` : ""}
                            ${item.dex ? `敏捷 ${(item.dex > 0 ? `+${item.dex}<br>` : item.dex)}` : ""}
                            ${item.heal ? `恢復 ${item.heal} HP` : ""}
                        </p>
                        <!-- 如果是商店，顯示偷竊按鈕 -->
                        ${itemType && itemType !== "meal" ? `<button onclick="stealItem('${item.id}')" style="margin: auto;">
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

// 場景相關

    // 快速旅行
    function fastTravel() {
        // 讀取最近的城鎮位置
        const townPos = JSON.parse(localStorage.getItem("townPos"));

        // 更新主角的位置
        localStorage.setItem("playerPos", JSON.stringify(townPos));

        // 跳轉到城鎮頁面
        window.location.href = 'town.html';
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

        // 跳轉到遭遇頁面（根據當前頁面判斷路徑）
        const pageName = window.location.pathname.split("/").pop();
        if (pageName === "map.html" || pageName === "town.html") {
            window.location.href = "encounter.html";
        } else {
            window.location.href = "../encounter.html";
        }
    }

    // 新的一天
    function nextDay() {
        // 重置事件進度
        localStorage.removeItem("currentKey"); // 清除對話 key

        // 重置酒館
        localStorage.removeItem("tavernClose"); // 重置打烊
        localStorage.removeItem("drinkingStart");
        localStorage.removeItem("drinkingResults");
        localStorage.removeItem("drinkingEnd");
            
        // 通緝等級每天下降 1 級
        addWantedLevel(-1);

        // 抽天氣
        const weathers = [ 
            { icon: "☀️", name: "晴天", description: "有陽光，不死生物不會出沒。" },
            { icon: "🌤️", name: "晴時多雲", description: "有陽光，不死生物不會出沒。" },
            { icon: "☁️", name: "多雲", description: "不死生物會出沒。" },
            { icon: "☁️", name: "陰天", description: "不死生物會出沒。" },
            { icon: "🌧️", name: "小雨", description: "植物少量增長，不死生物會出沒。" },
            { icon: "⛈️", name: "大雷雨", description: "智慧生物不會出門，植物大量增長，不死生物會出沒。" },
            { icon: "🌫️", name: "濃霧", description: "容易潛行，不死生物會出沒。" },
        ];
        let randomIndex = Math.floor(Math.random() * weathers.length);
        let selectedWeather = weathers[randomIndex];
        localStorage.setItem("weather", JSON.stringify(selectedWeather));
    }

