﻿// 顯示相關

    // 往下滑動時，隱藏按鈕列
        let lastScrollTop = 0;
        const buttonBar = document.getElementById("buttonBar");

        if (buttonBar) {
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
        }


    // 顯示按鈕列
    function showButtonBar() {
        const buttons = [
            { icon: "🎭" , text: "角色", function: () => goTo('menu/character') },
            { icon: "📜" , text: "任務", function: () => goTo('menu/mission') },
            { icon: "💰" , text: "物品", function: () => goTo('menu/inventory') },
            { icon: "⚙️" , text: "選項", function: () => goTo('menu/option') },
            //{ icon: "⛶" , text: "", function: "toggleFullScreen()" }, // 全螢幕（ios不支援）
        ];

        const pageName = window.location.pathname.split('/').pop();

        // 創建按鈕
        buttonBar.classList.add("button-bar");
        buttons.forEach(button => {
            const btn = document.createElement("a");

            // 檢查是否禁用
            if (pageName === "battle.html" && button.icon === "💰") { // 戰鬥中禁用物品
                btn.classList.add("note");
                btn.innerHTML = `${button.icon}&#xFE0E; <span class="small">${button.text}</span>`;
                btn.style.pointerEvents = "none"; // 禁用點擊
            } else {
                btn.innerHTML = `${button.icon} <span class="small">${button.text}</span>`;
                btn.addEventListener("click", button.function);
            }

            buttonBar.appendChild(btn);
        });

        // 等一個 event loop 後再加動畫 class
        setTimeout(() => {
            buttonBar.classList.add('animated');
        }, 0);
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
        document.body.style.background = `
            linear-gradient(rgba(25, 25, 25, 0.8), rgba(25, 25, 25, 0.8)),
            ${imagePath} center/cover no-repeat fixed
        `;
    }

    // 顯示對話
        // 返回上一段對話 next: "back"
    function showDialogue(key, price, speaker) {
        // 隱藏主要內容和按鈕列
        document.getElementById("main").style.display = "none";
        document.getElementById("buttonBar").style.display = "none";

        // 清空物品容器
        if (document.getElementById("item-list")) {
            document.getElementById("item-list").innerHTML = "";
        }
    
        // 讀取主角的名字
        const teamMembers = JSON.parse(localStorage.getItem("teamMembers")) || [];
        const playerName = teamMembers.find(m => m.id === "player").name;

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
        dialogueContainer.innerHTML = `
            <br>
            ${dialogue.npc ? `
                <h4><span id="npc-name"></span>：</h4>
            ` : "" }
            <div class="dialogue-text"><span id="npc-text"></span></div>
            <br>
            ${dialogue.npc && dialogue.choices ? `
                <br><h4>${playerName}：</h4>
            ` : "" }
            <div id="choices" class="menu"></div>
            <div id="addition"></div>
        `;

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
        } else if (dialogue.npc === "speaker") {
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

        // 如果有選項，顯示選項按鈕
        if (dialogue.choices && dialogue.choices.length > 0) {
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
        } else {
            // 如果沒有選項，顯示「繼續」並自動進入下一個對話
            const continueButton = document.createElement("button");
            continueButton.textContent = "（繼續）";
            continueButton.onclick = () => {
                // 從字串中取出結尾的數字並加一
                const match = key.match(/(.*?)-(\d+)$/);
                let nextKey;

                if (match) {
                    const base = match[1]; // 文字部分
                    const number = parseInt(match[2], 10); // 數字部分
                    nextKey = `${base}-${number + 1}`; // 兩者組合
                } else {
                    // 如果沒有尾數，fallback 成 "next" 或其他預設值
                    nextKey = "next";
                }
                showDialogue(nextKey);
            };
            choicesContainer.appendChild(continueButton);
        }

        goTop();
    }

    // 清除對話
    function removeDialogue() {
        // 清除交談資料
        //localStorage.removeItem("npcId"); // 清除戰鬥中指定的交談對象
        localStorage.removeItem("persuadeResult");
        localStorage.removeItem("intimidateResult");

        // 清除對話
        document.getElementById("dialogue").innerHTML = "";
        //document.getElementById("dialogue").style.display = "none";

        // 顯示主要內容和按鈕列
        document.getElementById("main").style.display = "block";
        document.getElementById("buttonBar").style.display = "flex";

        loadPartyData();
    }

    // 顯示通知框（3秒後消失）
    function showToast(message, duration = 3000) {
        const toastContainer = document.getElementById("toast-container");

        // 創建一個新的通知
        const toast = document.createElement("div");
        toast.classList.add("toast");
    
        // 設置通知的文本
        toast.textContent = message;

        // 創建關閉按鈕
        const closeBtn = document.createElement("button");
        closeBtn.classList.add("close-btn");
        closeBtn.textContent = "×";
        closeBtn.onclick = () => {
            toast.classList.remove("show");
            setTimeout(() => {
                toastContainer.removeChild(toast);
            }, 500);
        };
        toast.appendChild(closeBtn);

        // 把通知加到容器中
        toastContainer.appendChild(toast);

        // 顯示通知
        setTimeout(() => {
            toast.classList.add("show");
        }, 10); // 使用 setTimeout 確保動畫能正常運行

        // 在指定時間後自動隱藏並移除通知
        setTimeout(() => {
            toast.classList.remove("show");
            setTimeout(() => {
                toastContainer.removeChild(toast);
            }, 500);
        }, duration);
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

    // 執行偏好設定
    function preferences(part) {
        // 變更字體大小
        const fontSize = localStorage.getItem("fontSize") || "large";
        document.body.classList.remove("font-small", "font-medium", "font-large");
        document.body.classList.add("font-" + fontSize);

        if (part === "fontSize") return; //如果只變更字體，不執行其他的設定

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

        const nameMap = [
            { original: "雷納德", key: "newReynald" },
            { original: "塔爾穆克", key: "newTarmuk" },
            { original: "賽恩", key: "newSain" },
            { original: "艾德蒙", key: "newEdmund" },
            { original: "諾伊爾", key: "newNoirel" },
            { original: "羅文", key: "newRowan" },
            { original: "戴瑞", key: "newDerrick" },
            { original: "馬卡斯", key: "newMarcus" },
            { original: "賽爾瑞斯", key: "newSelreth" },
        ];

        // 替換 NPC 名字
        nameMap.forEach(({ original, key }) => {
            const newName = localStorage.getItem(key);
            if (newName) {
                replaceText(original, newName);
                observeTextChanges(original, newName);
            }
        });
    }

    // 檢查是否全螢幕
    function toggleFullScreen() {
        if (!document.fullscreenElement &&   // 如果不在全螢幕模式
            !document.mozFullScreenElement &&    // Firefox
            !document.webkitFullscreenElement && // Chrome, Safari, Opera
            !document.msFullscreenElement) {     // IE/Edge
            // 進入全螢幕模式
            enterFullScreen();
        } else {
            // 退出全螢幕模式
            exitFullScreen();
        }
    }

    // 進入全螢幕
    function enterFullScreen() {
        const docElm = document.documentElement;
        if (docElm.requestFullscreen) {
            docElm.requestFullscreen();
        } else if (docElm.mozRequestFullScreen) { // Firefox
            docElm.mozRequestFullScreen();
        } else if (docElm.webkitRequestFullscreen) { // Chrome, Safari, Opera
            docElm.webkitRequestFullscreen();
        } else if (docElm.msRequestFullscreen) { // IE/Edge
            docElm.msRequestFullscreen();
        }
    }

    // 退出全螢幕
    function exitFullScreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) { // Firefox
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) { // Chrome, Safari, Opera
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { // IE/Edge
            document.msExitFullscreen();
        }
    }

// 事件相關

    // 屬性擲骰
        // 骰主角屬性：roll("dex");
        // 骰指定數值：roll("5");
        // 攻擊：roll(attaker.dex, target.dex);
    function roll(attribute1, attribute2 = 10, successKey, failKey, Advantage) {
        // 讀取主角屬性
        const teamMembers = JSON.parse(localStorage.getItem("teamMembers")) || [];
        member = teamMembers.find(m => m.id === "player");

        const playerAttributes = {
            con: member.con.total,
            str: member.str.total,
            dex: member.dex.total,
            int: member.int.total,
            wis: member.wis.total,
            cha: member.cha.total,
        };
        
        // 如果是輸入屬性名稱，就用主角屬性值來骰
        if (attribute1 in playerAttributes) {
            attribute1 = playerAttributes[attribute1];
        }

        // 計算成功率
        let chance = (10 + (attribute1 - attribute2) / 2 ) / 20;

        // 擲骰
        let success = Math.random() <= chance;

        // 優勢或劣勢
        if ((Advantage === "gain" && !success) || (Advantage === "suffer" && success)) {
            success = Math.random() <= chance; // 重骰
            console.log("重骰");
        }

        // 顯示對話(如有指定)、回傳結果
        if (success) {
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

    // 檢查有沒有某個物品（可含數量），或指定的金錢
    function hasItem(itemId, count = 1) {
        if (itemId.startsWith("$")) {
            // 如果是 $ 開頭，代表金幣
            let money = parseInt(itemId.slice(1), 10); // 取得 $ 後的金額
            let playerMoney = parseInt(localStorage.getItem("playerMoney")) || 0;
            return playerMoney >= money; // 回傳比較結果
        } else {
            // 如果是物品
            const playerItems = JSON.parse(localStorage.getItem("playerItems")) || [];
            const itemCount = playerItems.filter(i => i === itemId).length; // 取得數量
            return itemCount >= count; // 回傳檢查結果
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

// 職業相關

    // 職業資料庫
    const classData = [
        { id: "warrior", name: "戰士", description: "戰士是訓練有素的精兵，又或是無畏的狂戰士。戰鬥就是他們的生存意義，離死亡越接近，他們的鬥志越高昂。", keyAttr: "力量", skills: ["armorBreak","pin","berserk"], asEnemy: true },
        { id: "paladin", name: "聖騎士", description: "聖騎士為正義與公理而戰，有強烈的使命感，扶弱濟貧、懲奸除惡。他們願將自身化為弱者的盾，無私的英雄形象深植人心。", keyAttr: "體質、魅力", skills: ["disarm","guard","strengthen"], asEnemy: false },
        { id: "rogue", name: "刺客", description: "刺客潛伏在暗影中，往往在戰鬥開始前就解決了敵人。有些刺客擅長偽裝成無害的樣子，讓目標失去警惕。", keyAttr: "敏捷、魅力", skills: ["stealth","lure","speedUp"], asEnemy: true },
        { id: "hunter", name: "獵人", description: "獵人擅長追蹤與精準出擊，能以野獸般的感官找出隱藏的事物。他們不會冒然行動，一旦盯上獵物就絕不放過。", keyAttr: "感知", skills: ["mark","alert","criticalBlast"], asEnemy: true },
        { id: "wizard", name: "法師", description: "法師能施展強大的魔法，造成大規模傷害，左右戰局。然而法術的成本高昂，也使他們難以兼顧自己的安全。", keyAttr: "智力", skills: ["rain","lightning","fireball"], asEnemy: true },
        { id: "cleric", name: "牧師", description: "牧師的神奇能力來自於信仰，他們是治療者，不奪取性命，但能夠克制敵對的施法者，淨化對方的異端魔力。", keyAttr: "感知", skills: ["heal","magicShield","teleport"], asEnemy: true }
    ];

    // 技能資料庫
    const skillData = [
        { id: "attack", icon: "⚔️", name: "攻擊", description: "以武器攻擊一個目標，造成等同角色力量的物理傷害。", target: "依武器", hitCheck: "dex-vs-dex", hitMessage: "擊中了${target.name}(${result.damage})！", missMessage: "但${target.name}躲過了攻擊", damage: "user.dmg - target.arm", userStatusFixed: ["-hidden","-strengthened"] },
        { id: "escape", icon: "🏃", name: "逃跑", description: "通過一次敏捷檢定，逃離戰鬥。", target: "最高dex", hitCheck: "dex-vs-dex", hitMessage: "迅速逃走了！", missMessage: "想逃跑，卻被${target.name}攔下來了", escape: true },
        // 戰士,
        { id: "armorBreak", icon: "💥", name: "破甲", description: "攻擊一個近距離目標，削減目標的護甲值，削減量等於此次傷害的1/5，但角色會受到等同目標護甲值的反彈傷害。", target: "前排單體", hitCheck: "dex-vs-dex", hitMessage: "擊中了${target.name}(${result.damage})！驚人的力量擊破了對方護甲(${result.armorBreak})，但也傷到了自己(${result.userDamage})", missMessage: "試圖攻擊，但${target.name}躲過了", damage: "user.dmg - target.arm", userDamage: "target.arm", userStatusFixed: ["-hidden","-strengthened"], armorBreak: "(user.str - target.arm) / 5" },
        { id: "pin", icon: "🤚", name: "壓制", description: "通過一次力量檢定，將一個近距離目標壓在地上，使其無法行動也無法閃避，但壓制期間角色無法閃避其他敵人的攻擊。", target: "前排單體", hitCheck: "str-vs-str", hitMessage: "朝${target.name}猛撲過去，把他壓制在地上！", missMessage: "朝${target.name}猛撲過去，但撲了個空", targetStatus: "pinned", userStatus: "pinning", userStatusFixed: "-hidden" },
        { id: "berserk", icon: "🌋", name: "狂暴", description: "HP 低於 50% 時可發動，獲得 3 回合狂暴和流血。狂暴狀態下，攻擊獲得命中優勢，HP 每損失 1 點，爆擊率就提高 1%。", condition: "user.HP <= user.MaxHP / 2 && !user.status.includes(\"berserk\")", target: "自己", hitMessage: "發出令人膽顫心驚的怒吼！他無所畏懼，傷得越重，打人越痛！", userStatus: ["berserk","bleeding"] },
        { id: "throw", icon: "🫳", name: "投擲", description: "扔出武器，攻擊一個目標，視為遠程攻擊。需花費一回合撿回武器。", condition: "user.weapon && Object.keys(user.weapon).length > 0", target: "任一單體", hitCheck: "dex-vs-dex", hitMessage: "將手上的武器扔出去，擊中了${target.name}(${result.damage})！", missMessage: "將手上的武器扔出去，但${target.name}躲開了", damage: "user.dmg - target.arm", userStatusFixed: ["disarmed","-hidden","-strengthened"] },
        //【魯莽攻擊】此次攻擊獲得優勢，但本回合敵人對角色的攻擊也獲得優勢。,
        // 聖騎士,
        { id: "disarm", icon: "🗡️", name: "繳械", description: "通過一次敏捷檢定，去除目標的武器。", target: "依武器", hitCheck: "dex-vs-dex", hitMessage: "準確地把${target.name}手中的武器擊落！", missMessage: "沒能讓${target.name}放開武器", targetStatus: "disarmed", userStatusFixed: "-hidden" },
        { id: "guard", icon: "🛡️", name: "守護", description: "選擇一個同排的同伴，代替同伴承受本回合所有攻擊，且承受閃避劣勢。", target: "同排單體", hitMessage: "將不顧一切地保護${target.name}的安全", targetStatus: "guarded", userStatus: "guarding", userStatusFixed: "-hidden" },
        { id: "boost", icon: "🌟", name: "激勵", description: "激勵一個目標，角色每有 5 點魅力，目標的力量、敏捷、智力、感知上升 1 點，持續3回合。", target: "任一單體", hitMessage: "激勵了${target.name}，力量、敏捷、智力、感知上升(${result.cheerValue})！", targetStatus: "boosted", cost: 1 },
        { id: "strengthen", icon: "🔱", name: "蓄力", description: "使一個目標的力量加倍，直到目標下一次進行物理攻擊。", target: "任一單體", hitMessage: "將魔力轉化為力量，灌注到${target.name}身上！", targetStatus: "strengthened", cost: 1 },
        { id: "divineSanction", icon: "🔱", name: "神聖制裁", description: "攻擊一個目標，造成物理傷害，加上等同角色魅力的魔法傷害。", target: "依武器", hitCheck: "dex-vs-dex", hitMessage: "發出一道聖光，對${target.name}執行制裁，懲罰了他的罪((${result.damage})！", missMessage: "發出一道聖光，但${target.name}僥倖躲過了制裁", damage: "Math.max(user.dmg - target.arm, 0) + user.cha", userStatusFixed: ["-hidden","-strengthened"], cost: 1 },
        // 刺客,
        { id: "sneakAttack", icon: "🗡️", name: "偷襲", description: "在隱身狀態下攻擊一個目標，傷害、爆擊率加倍。", condition: "hasStatus(user, 'hidden')", target: "依武器", hitMessage: "無聲無息地偷襲，擊中了${target.name}(${result.damage})！", critRate: "*2", damage: "user.dmg * 2 - target.arm", userStatusFixed: ["-hidden","-strengthened"] },
        { id: "stealth", icon: "🐈‍⬛", name: "隱身", description: "通過一次潛行檢定進入隱身狀態。隱身時，對手看不到此角色，角色攻擊或逃跑都自動成功，攻擊必定爆擊，但會暴露自身。", condition: "!hasStatus(user, 'hidden')", target: "最高wis", hitCheck: "dex-vs-wis", hitMessage: "隱藏自己的氣息，消失了蹤跡……", missMessage: "試圖躲藏起來，但仍然被發現了", userStatus: "hidden" },
        { id: "lure", icon: "🪤", name: "誘敵", description: "通過一次魅力檢定，引誘目標到前排，趁機攻擊。", target: "任一單體", hitCheck: "cha-vs-int", hitMessage: "吸引了${target.name}的注意，趁機攻擊(${result.damage})！", missMessage: "嘗試吸引${target.name}的注意，但他無動於衷", damage: "user.dmg - target.arm", userStatusFixed: ["-hidden","-strengthened"], targetMove: "往前" },
        { id: "speedUp", icon: "💨", name: "加速", description: "如果角色負重不到一半，獲得 2 次行動次數，但下回合將無法行動。", condition: "user.weight <= user.str/ 2 && !hasStatus(user, 'speedUp')", target: "自己", hitMessage: "能迅速行動 2 次", userStatus: "speedUp" },
        { id: "counterattack", icon: "🔃", name: "反擊", description: "下回合中，每當角色成功閃避攻擊時，只要對方在角色攻擊範圍內，就能反擊回去。", target: "自己", hitMessage: "準備向任何敵人反擊", userStatus: "counterattack" },
        // 獵人,
        { id: "mark", icon: "👁️", name: "鷹眼", description: "通過一次偵查檢定，鎖定一個目標，使全體同伴對目標獲得命中優勢，持續 2 回合。", target: "任一單體", hitCheck: "wis-vs-dex", hitMessage: "以敏銳目光鎖定了${target.name}！", missMessage: "眼睛跟不上${target.name}的速度", targetStatus: "marked" },
        { id: "alert", icon: "🚨", name: "預警", description: "通過一次偵查檢定，預測一個敵人下回合的攻擊，讓全體同伴避開。", target: "任一單體", hitCheck: "wis-vs-dex", hitMessage: "看穿了${target.name}的下一次攻擊！", missMessage: "看不出${target.name}會怎麼行動……", targetStatus: "alerted" },
        { id: "reveal", icon: "🔍", name: "搜索", description: "通過一次偵查檢定，發現隱身的敵人。", target: "敵方隱身者", hitCheck: "wis-vs-dex", hitMessage: "搜索隱藏的跡象，發現了${target.name}！", missMessage: "搜索了一番，什麼也沒發現……", targetStatus: "-invisible" },
        { id: "criticalBlast", icon: "🎯", name: "命中要害", description: "攻擊一個目標，只要通過一次偵查檢定，即可造成爆擊。", target: "依武器", hitCheck: "dex-vs-dex", hitMessage: "瞄準${target.name}的要害，擊中了他(${result.damage})！", missMessage: "瞄準${target.name}，但對方警覺地護住要害", critRate: "wis-vs-dex", damage: "user.dmg - target.arm", userStatusFixed: ["-hidden","-strengthened"] },
        // 法師,
        { id: "storm", icon: "🌪️", name: "狂風術", description: "與目標同排的生物必須通過一次體質豁免，否則會倒地，後排生物會被吹到前排，飛行中的生物會摔落。", target: "任一排", hitCheck: "wis-vs-con", hitMessage: "召喚一陣強風，將${target.name}吹倒了！", missMessage: "召喚一陣強風，但${target.name}穩住了重心", targetStatus: ["prone","-flying"], targetMove: "往前", cost: 1 },
        { id: "rain", icon: "🌧️", name: "降雨術", description: "使與目標同排的生物潮濕，並移除燃燒。", target: "任一排", hitMessage: "降下了一場大雨！", targetStatus: ["wet","-burning"], cost: 1 },
        { id: "lightning", icon: "⚡", name: "閃電術", description: "攻擊一個目標，傷害等同角色的智力，對潮濕的目標傷害加倍。目標必須通過一次體質豁免，否則會麻痺。", target: "任一單體", hitCheck: "wis-vs-dex", hitMessage: "發射一道閃電，瞬間擊中了${target.name}(${result.damage})！", damage: "user.int", statusCheck: "int-vs-con", targetStatus: "paralyzed", cost: 1 },
        { id: "fireball", icon: "☄️", name: "火球術", description: "攻擊與目標同排的生物，傷害等同角色的智力，並附加燃燒。", target: "任一排", hitCheck: "wis-vs-dex", hitMessage: "投擲一顆巨大而熾熱的火球，落在了${target.name}頭上(${result.damage})！", damage: "user.int", targetStatus: ["burning","-wet"], cost: 2 },
        //【黑暗術】使所有敵人的攻擊承受劣勢。,
        //earthquake🪨地震術 與目標同排的生物必須通過一次敏捷豁免，否則會倒地。,
        // 使地面震動起來！,
        // 牧師,
        { id: "heal", icon: "❤️‍🩹", name: "治癒術", description: "治療一個目標，治療量等同角色的智力，並解除中毒、燃燒、麻痺、石化。", target: "任一單體", hitMessage: "為${target.name}治療了傷勢(${result.damage})", damage: "-user.int", targetStatus: ["-poisoned","-burning","-paralyzed","-petrified"], cost: 1 },
        { id: "magicShield", icon: "🛡️", name: "防護術", description: "為一個目標創造防護罩，能吸收物理、魔法傷害，防護罩的 HP 等同角色的智力。", target: "任一單體", hitMessage: "在${target.name}周圍創造了一層防護罩", tempHP: "user.int", cost: 1 },
        { id: "seal", icon: "🔒", name: "封印術", description: "通過一次感知檢定，讓一個擁有MP的目標一回合內無法施法，並吸取 2MP。", target: "任一施法者", hitCheck: "wis-vs-wis", hitMessage: "封印了${target.name}的法術，並從中吸取了魔力(${result.mpAbsorb})！", missMessage: "試圖封印${target.name}的法師，但他的精神太堅定了", mpAbsorb: 2, targetStatus: "sealed" },
        { id: "teleport", icon: "💫", name: "傳送術", description: "通過一次感知檢定，讓一個目標脫離戰鬥。", target: "任一單體", hitCheck: "wis-vs-con", hitMessage: "創造一個傳送門，將${target.name}傳送到遠處了！", missMessage: "嘗試傳送${target.name}，但傳送門似乎開得不夠大", targetEscape: true, cost: 2 },
        { description: "將自己的 MP 轉讓給目標，無法超過目標的 MP 上限。", target: "任一單體", hitMessage: "將自己的魔力灌注在${target.name}身上", mpDamage: -1, cost: 1 },
        //【聖光術】敵方所有的不死生物受到等同角色感知的傷害。
    ];

    // 狀態資料庫
    const statusData = [
        // 行動限制,
        { id: "petrified", icon: "🗿", name: "石化", description: "無法行動和閃避，但護甲 +15。", getMessage: "身體變成了石頭！", duration: 1, noAction: true, arm: 15 },
        { id: "paralyzed", icon: "⚡", name: "麻痺", description: "無法行動和閃避。", getMessage: "受到電擊，全身麻痺了！", duration: 1, noAction: true },
        { id: "exhausted", icon: "💦", name: "力竭", description: "無法行動和閃避。", getMessage: "過度耗力，必須喘口氣", duration: 1, durationPlus: true, noAction: true },
        { id: "pinned", icon: "🤚", name: "被壓制", description: "無法行動和閃避。", getMessage: "被壓制了，無法掙脫！", duration: 1, noAction: true, relatedId: "user.id" },
        { id: "pinning", icon: "🤚", name: "壓制", description: "正在壓制對方，無法閃避。可自行解除。", duration: 1, durationPlus: true, noAction: true, relatedId: "target.id" },
        { id: "sealed", icon: "🔒", name: "封印", description: "無法使用法術。", getMessage: "魔力被封印，無法施放法術了！", duration: 1, noMagic: true },
        { id: "disarmed", icon: "🫴", name: "武器掉落", description: "只能空手戰鬥，或花費一回合撿回武器。", getMessage: "的武器掉在遠處了！", duration: "always", noWeapon: true, resistible: true, resistVerb: "撿起武器" },
        // 目標限制,
        { id: "hidden", icon: "🐈‍⬛", name: "隱身", description: "對手看不到此角色，角色攻擊或逃跑都自動成功，攻擊必定爆擊，但會暴露自身。", duration: "always", durationPlus: true, untargetable: true, critRate: 100, cancelable : true, resistVerb: "現身" },
        { id: "flying", icon: "🪽", name: "飛行", description: "飛上天，迴避所有近戰攻擊。", duration: 1, durationPlus: true, flying: true, cancelable : true, resistVerb: "降落" },
        // 增益,
        { id: "berserk", icon: "🌋", name: "狂暴", description: "攻擊獲得命中優勢，HP 每損失 1 點，爆擊率就提高 1%。", duration: 3, durationPlus: true, hitGain: true, critRate: "target.MaxHP - target.HP" },
        { id: "guarded", icon: "🛡️", name: "被守護", description: "不會受到來自外部的傷害。", duration: 1, durationPlus: true, invincible: true, relatedId: "user.id" },
        { id: "boosted", icon: "🌟", name: "被激勵", description: "力量、敏捷、智力、感知上升。", duration: 3, durationPlus: true, str: "Math.floor(user.cha / 5)", dex: "Math.floor(user.cha / 5)", int: "Math.floor(user.cha / 5)", wis: "Math.floor(user.cha / 5)", relatedId: "user.id" },
        { id: "strengthened", icon: "🔱", name: "蓄力", description: "力量加倍，直到角色下一次進行物理攻擊。", getMessage: "全身充滿了力量", duration: "always", str: "target.str" },
        { id: "counterattack", icon: "🔃", name: "準備反擊", description: "每當角色成功閃避攻擊時，只要對方在角色攻擊範圍內，就能反擊回去。", duration: 1, durationPlus: true, counterattack: true },
        { id: "wet", icon: "💧", name: "潮濕", description: "角色受到的火焰傷害減半，電擊傷害加倍。", getMessage: "被淋溼了" },
        // 減益,
        { id: "prone", icon: "🦶", name: "倒地", description: "敏捷 -5，可花費一回合站起來。", getMessage: "摔倒在地了！", duration: "always", dex: -5, resistible: true, resistVerb: "站起來" },
        { id: "guarding", icon: "🛡️", name: "守護", description: "代替被守護者承受傷害，且承受閃避劣勢。", duration: 1, durationPlus: true, dodgeSuffer: true, substitute: true, relatedId: "target.id" },
        { id: "marked", icon: "👁️", name: "被鎖定", description: "所有針對此角色的攻擊獲得命中優勢。", duration: 2, dodgeSuffer: true },
        { id: "alerted", icon: "🚨", name: "被預警", description: "角色的攻擊會被目標避開。", duration: 1, miss: true },
        { id: "blinded", icon: "🕶", name: "目盲", description: "感知 -5，敏捷 -5。", getMessage: "眼前一片黑暗！", duration: 1, dex: -5, wis: -5 },
        // 持續傷害,
        { id: "bleeding", icon: "🩸", name: "流血", description: "每回合受到 3 傷害，可用繃帶止血。", getMessage: "傷口流血了！", duration: 3, stackable: true, damage: 3 },
        { id: "burning", icon: "🔥", name: "燃燒", description: "每回合受到 6 傷害，可用水澆熄。", getMessage: "身上著火了！", duration: 2, stackable: true, damage: 6 },
        { id: "poisoned", icon: "🤢", name: "中毒", description: "力量 -1，敏捷 -1，此外每回合受到 1 傷害，可用解毒劑解除。", getMessage: "中毒了！身體感到虛弱……", duration: 10, stackable: true, damage: 1, str: -1, dex: -1 },
        // 額外動作,
        { id: "speedUp", icon: "💨", name: "加速", description: "獲得 2 次行動次數，但下回合將無法行動。", duration: "always", extraAction: 2 }
    ];

    // 顯示屬性等級
    function showAttributeLevel(attr, value) {
        const attributeLevel = {
            con: { low: "弱不禁風", middle: "中等", high: "身強體壯" },
            str: { low: "軟弱無力", middle: "普通", high: "孔武有力" },
            dex: { low: "動作笨拙", middle: "尋常", high: "身手矯捷" },
            int: { low: "愚昧無知", middle: "平均", high: "足智多謀" },
            wis: { low: "少一根筋", middle: "一般", high: "明察秋毫" },
            cha: { low: "惹人厭惡", middle: "平凡", high: "令人著迷" },
            arm: { low: "", middle: "良好", high: "銅牆鐵壁"},
        };

        let level = "";
        if (value < 8) {
            level = attributeLevel[attr].low;
        } else if (value <= 12) {
            level = attributeLevel[attr].middle;
        } else {
            level = attributeLevel[attr].high;
        }
        return level;
    }

    // 屬性
    const attributeData = {
        con: { name: "🫀 體質" },
        str: { name: "✊ 力量" },
        dex: { name: "🏃 敏捷" },
        int: { name: "🧠 智力" },
        wis: { name: "👁️ 感知" },
        cha: { name: "✨ 魅力" },
    };

// 隊伍相關

    // 傭兵資料庫
    const mercenaries = [
        { name: "雷納德", type: "傭兵", classId: "paladin", description: "老練的冒險者，穿著全套盔甲，飽經風霜的臉龐洋溢著溫暖的微笑。", cost: 0, con: 15, str: 15, dex: 12, int: 10, wis: 12, cha: 14, weaponId: "npcWeapon01", armorId: "npcArmor01" },
        { name: "塔爾穆克", type: "傭兵", classId: "warrior", description: "身材魁武的獸人狂戰士，背著一把巨大的戰斧，眼神充滿怒火。", cost: 150, con: 17, str: 17, dex: 10, int: 9, wis: 10, cha: 9, weaponId: "npcWeapon02", armorId: "npcArmor02" },
        { name: "賽恩", type: "傭兵", classId: "rogue", description: "蒙面的刺客，整張臉隱藏在面罩下，沉默寡言，散發著一絲危險氣息。", cost: 120, con: 12, str: 12, dex: 17, int: 10, wis: 14, cha: 10, weaponId: "npcWeapon03", armorId: "npcArmor03" },
        { name: "艾德蒙", type: "傭兵", classId: "hunter", description: "看起來像個小混混，不太正經，喜歡自吹自擂，給人感覺不怎麼可靠。", cost: 100, con: 8, str: 14, dex: 14, int: 10, wis: 16, cha: 12, weaponId: "npcWeapon04", armorId: "npcArmor04" },
        { name: "諾伊爾", type: "傭兵", classId: "wizard", description: "初出茅廬的高等精靈少年，一臉純真，比起協助你，他看起來更需要協助。", cost: 90, con: 8, str: 8, dex: 10, int: 16, wis: 14, cha: 16, weaponId: "npcWeapon05", armorId: "npcArmor05" }
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

    // 同伴加入隊伍（輸入物件資料或 name）
    function addCompanion(companion, companionName, companionType) {
        // 顯示文本
        const texts = {
            partyFull : "隊伍人數已滿，請選擇要替換的同伴",
        }

        // 讀取隊伍資料
        let teamMembers = JSON.parse(localStorage.getItem("teamMembers")) || [];

        // 檢查隊伍是否已滿
        if (teamMembers.length >= 4) {
            let menu = document.createElement("div");
            menu.classList.add("menu");

            // 顯示隊伍已滿的訊息
            let message = document.createElement("p");
            message.textContent = texts.partyFull; 
            menu.appendChild(message);

            // 為每個成員建立一個按鈕
            teamMembers.forEach(companion => {
                if (companion.id === "player") return; // 排除主角

                let button = document.createElement("button");
                button.textContent = companion.name;

                button.onclick = function () {
                    removeCompanion(companion.id);// 移除選擇的同伴
                    document.body.removeChild(menu);  // 清除選單
                    document.getElementById("dialogue").style.display = "block"; // 顯示對話
                    addMember(); // 同伴加入
                };

                menu.appendChild(button);
            });

            // 取消按鈕
            let cancelButton = document.createElement("button");
            cancelButton.textContent = "取消";
    
            cancelButton.onclick = function () {
                document.body.removeChild(menu); // 清除選單
                document.getElementById("dialogue").style.display = "block"; // 顯示對話
                // 不加入
            };

            menu.appendChild(cancelButton);
            document.body.appendChild(menu);

            // 隱藏對話
            document.getElementById("dialogue").style.display = "none";
        } else {
            addMember(); // 隊伍未滿，直接加入
        }

        // 將同伴加入
        function addMember() {
            // 重新讀取隊伍資料（萬一剛移除舊同伴）
            let teamMembers = JSON.parse(localStorage.getItem("teamMembers")) || [];

            // 取得同伴資料
            if (companion) {
                // 如果有物件資料，獲取同伴名字
                companionName = companion.adj ? `${companion.adj}${companion.name}` : companion.name; // 有形容詞就加到名字中
            } else {
                // 如果沒有物件資料，用名字查找資料
                companion = mercenaries.find(m => m.name === companionName);
            }

            // 生成同伴的新id
            const companionId = `companion${teamMembers.length}`;

            // 添加同伴資料並設定初始的HP和MaxHP
            let characterData = {
                name: companionName, // 加入處理後的名字
                id: companionId,  // 自動產生 id
                type: companionType || companion.type,
                classId: companion.classId,
                critRate: { basic: 5, total: 5 }, // 爆擊率 5%
                status: [],
                emotion: [],
                mood: 0,
                weapon: {},
                armor: {}, 
                description: companion.description,
            };

            // 初始化屬性
            ["str", "dex", "con", "int", "wis", "cha", "arm", "weight"].forEach(attr => {
                const basic = companion[attr] || 0;
                characterData[attr] = {
                    basic: basic,
                    total: basic,
                };
            });

            // 初始化 HP 和傷害
            characterData.MaxHP = characterData.con.total * 3;
            characterData.HP = characterData.MaxHP;
            characterData.minDmg = {
                basic: 1,
                total: 1,
            };
            characterData.maxDmg = {
                basic: Math.round(characterData.str.total / 2), // 四捨五入
                total: Math.round(characterData.str.total / 2), // 四捨五入
            };

            // 根據技能所需的 MP，決定 MP 上限
            characterData.MaxMP = 0;
            const skillIds = classData.find(cla => cla.id === companion.classId).skills;
            skillIds.forEach(skillId => {
                const skill = skillData.find(s => s.id === skillId); // 找到技能資料
                if (skill.cost > 0) characterData.MaxMP += 2; // 每個法術給 2MP ，一環法術可用 2 次，二環法術可用 1 次
            });
            characterData.MP = characterData.MaxMP;

            // 將同伴加入隊伍
            teamMembers.push(characterData);
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
            getEmotion(companionId, "fullHP", false); 
        }
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

        // 加入冷卻傭兵名單，如果是傭兵，當天不會再出現於酒館
        let cooldownMerc = JSON.parse(localStorage.getItem("cooldownMerc")) || [];
        cooldownMerc.push(companion);
        localStorage.setItem("cooldownMerc", JSON.stringify(cooldownMerc));
    }

    // 回滿隊伍 HP、MP
    function resetHP() {
        // 讀取隊伍資訊
        const teamMembers = JSON.parse(localStorage.getItem("teamMembers")) || [];
        const nightGuard = localStorage.getItem("nightGuard");

        teamMembers.forEach(member => {
            // 排除站哨者
            if (member.name !== nightGuard) {
                member.HP = member.MaxHP; // 將 HP 設為最大值
                member.MP = member.MaxMP; // 將 MP 設為最大值
            }
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

    // 人數已滿時替換同伴（回傳true/false)
    function replaceMember() {

    }

// 主角相關
    // 主角 HP 增減
    function addPlayerHP(amount) {
        let teamMembers = JSON.parse(localStorage.getItem("teamMembers")) || [];
        let player = teamMembers.find(m => m.id === "player");
        player.HP = Math.min(Math.max(player.HP + amount, 0), player.MaxHP); // 確保不會超過最大值，也不會小於0
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
        equip("player", "clothes01");
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

        // 跳轉到監獄頁面
        goTo("locations/prison");
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
        // 商店定價,
        // 武器,
        // 商店貨,
        { name: "🗡️ 匕首", id: "dagger01", type: "weapon", price: 13, weight: 2, category: "穿刺", minDmg: 4, dmg: 4, maxDmg: 4, addStatus: "bleeding", addChance: 0.1, shop: "blacksmith", description: "適合隨身攜帶的短劍。" },
        { name: "🗡️ 長槍", id: "spear01", type: "weapon", price: 97, weight: 8, category: "穿刺", minDmg: 10, dmg: 10, maxDmg: 10, addStatus: "bleeding", addChance: 0.4, shop: "blacksmith", description: "用來刺擊的長柄武器。" },
        { name: "🗡️ 單手劍", id: "sword01", type: "weapon", price: 57, weight: 6, category: "揮砍", minDmg: 6, dmg: 8, maxDmg: 10, shop: "blacksmith", description: "戰士的標準配備。" },
        { name: "🗡️ 巨劍", id: "sword02", type: "weapon", price: 105, weight: 10, category: "揮砍", minDmg: 9, dmg: 12, maxDmg: 15, shop: "blacksmith", description: "雙手持握的大型劍。" },
        { name: "🔨 釘頭錘", id: "mace01", type: "weapon", price: 39, weight: 6, category: "鈍擊", minDmg: 3, dmg: 6, maxDmg: 9, addStatus: "prone", addChance: 0.30000000000000004, shop: "blacksmith", description: "單手捶打用的鈍器。" },
        { name: "🪓 戰斧", id: "axe01", type: "weapon", price: 69, weight: 6, category: "揮砍", minDmg: 6, dmg: 8, maxDmg: 10, addStatus: "prone", addChance: 0.30000000000000004, shop: "blacksmith", description: "能揮砍也能推倒敵人的兩用武器。" },
        { name: "🔨 戰錘", id: "mace02", type: "weapon", price: 95, weight: 10, category: "鈍擊", minDmg: 5, dmg: 10, maxDmg: 15, addStatus: "prone", addChance: 0.5, shop: "blacksmith", description: "沉重的錘頭有著強大的破壞力。" },
        { name: "🏹 手弩", id: "bow01", type: "weapon", price: 18, weight: 4, category: "遠程", minDmg: 5, dmg: 5, maxDmg: 5, shop: "blacksmith", description: "能瞄準地面與空中的敵人。" },
        { name: "🏹 長弓", id: "bow02", type: "weapon", price: 54, weight: 7, category: "遠程", minDmg: 8, dmg: 8, maxDmg: 8, shop: "blacksmith", description: "能瞄準地面與空中的敵人。" },
        { name: "🛡️ 圓木盾", id: "sheild01", type: "weapon", price: 51, weight: 4, category: "鈍擊", minDmg: 2, dmg: 4, maxDmg: 6, arm: 2, addStatus: "prone", addChance: 0.2, shop: "blacksmith", description: "輕型盾牌，能保護自身也能當鈍器使用。" },
        { name: "🪄 魔杖", id: "wand01", type: "weapon", price: 24, weight: 2, category: "鈍擊", minDmg: 1, dmg: 2, maxDmg: 3, int: 1, shop: "blacksmith", description: "蘊含魔法的短木杖。" },
        { name: "🪄 法杖", id: "wand02", type: "weapon", price: 63, weight: 4, category: "鈍擊", minDmg: 2, dmg: 4, maxDmg: 6, int: 2, shop: "blacksmith", description: "蘊含魔法的長木杖。" },
        //{ type: "weapon", category: "穿刺", id: "arrow01", name: "➶ 箭矢", str: 1, dex: 0, description: "射擊用的箭矢，緊急時可以拿來防身。", price: 1, shop: "blacksmith" },,
        // 戰利品,
        { name: "🔨 小棍棒", id: "stick01", type: "weapon", price: 0, weight: 2, category: "鈍擊", minDmg: 1, dmg: 2, maxDmg: 3, description: "只是一根普通的樹枝。" },
        { name: "🔨 巨大的狼牙棒", id: "stick02", type: "weapon", price: 0, weight: 20, category: "鈍擊", minDmg: 10, dmg: 20, maxDmg: 30, addStatus: "prone", addChance: 1, description: "將樹幹和獸骨綁起來。" },
        { name: "🗡️ 迷你刺劍", id: "sword03", type: "weapon", price: 0, weight: 0, category: "穿刺", minDmg: 2, dmg: 2, maxDmg: 2, description: "看起來像玩具，但真的能傷人。" },
        { name: "🪨 尖銳的石頭", id: "stone", type: "weapon", price: 0, weight: 2, category: "鈍擊", minDmg: 1, dmg: 2, maxDmg: 3, description: "可以藏在衣服裡。" },
        // NPC專屬,
        { name: "🗡️ 雷納德的巨劍", id: "npcWeapon01", type: "weapon", price: 117, weight: 11, category: "揮砍", minDmg: 10, dmg: 13, maxDmg: 16, owner: "雷納德", description: "沉重的雙手持握的大型長劍。" },
        { name: "🪓 塔爾穆克的戰斧", id: "npcWeapon02", type: "weapon", price: 125, weight: 10, category: "揮砍", minDmg: 9, dmg: 12, maxDmg: 15, addStatus: "prone", addChance: 0.5, owner: "塔爾穆克", description: "一把巨大的長柄斧，殺傷力驚人。" },
        { name: "🗡️ 賽恩的匕首", id: "npcWeapon03", type: "weapon", price: 29, weight: 2, category: "穿刺", minDmg: 4, dmg: 4, maxDmg: 4, addStatus: "bleeding", addChance: 0.5, owner: "賽恩", description: "特別鋒利的匕首，能輕易讓敵人流血。" },
        { name: "🏹 艾德蒙的手弩", id: "npcWeapon04", type: "weapon", price: 30, weight: 5, category: "遠程", minDmg: 6, dmg: 6, maxDmg: 6, owner: "艾德蒙", description: "能瞄準地面與空中的敵人。" },
        { name: "🪄 諾伊爾的魔杖", id: "npcWeapon05", type: "weapon", price: 54, weight: 2, category: "鈍擊", minDmg: 1, dmg: 2, maxDmg: 3, int: 2, shop: "blacksmith", description: "蘊含魔法的短木杖，鑲了美麗的寶石。" },
        // 盔甲,
        // 商店貨,
        { name: "🛡️ 皮甲", id: "armor01", type: "armor", price: 17, weight: 1, arm: 1, shop: "blacksmith", description: "活動性佳的輕型盔甲。" },
        { name: "🛡️ 鱗甲", id: "armor02", type: "armor", price: 34, weight: 2, arm: 2, shop: "blacksmith", description: "以皮革和鐵片製成的鎧甲。" },
        { name: "🛡️ 鐵製胸甲", id: "armor03", type: "armor", price: 51, weight: 3, arm: 3, shop: "blacksmith", description: "包覆軀幹的堅固胸甲。" },
        { name: "🛡️ 鎖子甲", id: "armor04", type: "armor", price: 68, weight: 4, arm: 4, shop: "blacksmith", description: "以鐵環相扣製成的鎧甲。" },
        { name: "🛡️ 全身板甲", id: "armor05", type: "armor", price: 85, weight: 5, arm: 5, shop: "blacksmith", description: "完整保護全身的重型盔甲。" },
        // NPC專屬,
        { name: "🛡️ 雷納德的胸甲", id: "npcArmor01", type: "armor", weight: 3, arm: 3, owner: "雷納德", description: "包覆軀幹的堅固胸甲。" },
        { name: "🛡️ 塔爾穆克的胸甲", id: "npcArmor02", type: "armor", weight: 3, arm: 3, owner: "塔爾穆克", description: "包覆軀幹的堅固胸甲。" },
        { name: "🛡️ 賽恩的皮甲", id: "npcArmor03", type: "armor", weight: 1, arm: 1, owner: "賽恩", description: "活動性佳的輕型盔甲。" },
        { name: "🛡️ 艾德蒙的鱗甲", id: "npcArmor04", type: "armor", weight: 2, arm: 2, owner: "艾德蒙", description: "以皮革和鐵片製成的鎧甲。" },
        { name: "🛡️ 諾伊爾的皮甲", id: "npcArmor05", type: "armor", weight: 1, arm: 1, owner: "諾伊爾", description: "活動性佳的輕型盔甲。" },
        // 服裝（也算盔甲，只是在服飾店販售）,
        // 商店貨,
        { name: "🧥 別緻休閒服", id: "fineClothes01", type: "armor", price: 30, cha: 1, shop: "clothes", description: "經典的白襯衫與皮革背心，給人一種富家子弟或知識份子的印象。" },
        { name: "🧥 月影斗篷", id: "fineClothes02", type: "armor", price: 47, weight: 1, arm: 1, cha: 1, shop: "clothes", description: "漆黑的斗篷，就像被詛咒者的心，據說是用狼人毛皮做成的，不論是真是假，這毛皮厚到能在你受到攻擊時作為緩衝。" },
        { name: "🧥 致命誘惑長袍", id: "fineClothes03", type: "armor", price: 60, weight: 0, cha: 2, shop: "clothes", description: "大膽將人體脆弱的部位暴露在外，是完全不考慮防禦力，只為展現魅力而生的服裝，適合那些即使陣亡也要當個美麗骷髏的法師們。" },
        { name: "🧥 傳說英雄盔甲", id: "fineClothes04", type: "armor", price: 77, weight: 1, arm: 1, cha: 2, shop: "clothes", description: "閃亮的盔甲、飄揚的披風，只要穿上這身裝扮，你不需要真的打贏怪物，也能讓人相信英雄降臨了，你的敵人也會自動畏懼三分。" },
        { name: "🧥 優雅貴族正裝", id: "fineClothes05", type: "armor", price: 90, weight: 0, cha: 3, dex: -1, shop: "clothes", description: "奢華天鵝絨大衣搭配蕾絲內襯，彷彿尊爵不凡的領主大人，你的發言將會具有令人無法抗拒的說服力。但太合身了，會比較難以活動。" },
        { name: "🧥 皇家儀式禮服", id: "fineClothes06", type: "armor", price: 120, weight: 0, cha: 4, dex: -2, shop: "clothes", description: "由上等絲綢與金線刺繡製成，以璀璨珠寶點綴，無論在哪個場合都能成為萬眾矚目的焦點。穿上後必須保持儀態端莊，呼吸可能有點困難。" },
        // 戰利品,
        { name: "🧥 布衣", id: "clothes01", type: "armor", price: 1, description: "以廉價布料製成的衣服，從一般平民到奴隸都會穿。" },
        { name: "🧥 工作服", id: "clothes02", type: "armor", price: 2, description: "有很多口袋的吊帶褲與襯衫。" },
        { name: "🧥 旅行服", id: "clothes03", type: "armor", price: 2, description: "耐磨、耐髒，適合長途旅行穿著。" },
        { name: "🧥 獸皮背心", id: "lootClothes01", type: "armor", price: 0, description: "粗糙縫合的獸皮，只能勉強遮蔽身體。" },
        { name: "🧥 巨大的腰布", id: "lootClothes02", type: "armor", price: 0, cha: -1, description: "如果不排斥臭味，可以披在身上當斗篷。" },
        { name: "🧥 破爛衣服", id: "lootClothes03", type: "armor", price: 0, description: "已經破爛到無法稱為衣服，只是一串碎布。" },
        { name: "🧥 迷你披風", id: "lootClothes04", type: "armor", price: 0, description: "看起來像洋娃娃的配件，也可以拿來當領巾。" },
        // 補給品,
        { name: "🫙 治療藥水", id: "healPotion01", type: "supply", price: 5, heal: 10, usable: true, consumable: true, shop: "grocery", description: "立即恢復生命值。" },
        { name: "🫙 中級治療藥水", id: "healPotion02", type: "supply", price: 10, heal: 20, usable: true, consumable: true, shop: "grocery", description: "立即恢復生命值。" },
        { name: "🫙 高級治療藥水", id: "healPotion03", type: "supply", price: 15, heal: 30, usable: true, consumable: true, shop: "grocery", description: "立即恢復生命值。" },
        { name: "💰 繃帶", id: "bandage", type: "supply", price: 1, removeStatus: "bleeding", usable: true, consumable: true, shop: "grocery", description: "能止住一處流血的傷口。" },
        { name: "💰 解毒藥", id: "antidote", type: "supply", price: 1, removeStatus: "poisoned", usable: true, consumable: true, shop: "grocery", description: "能解除一層中毒。" },
        { name: "🫙 水", id: "water", type: "supply", price: 1, removeStatus: "burning", usable: true, consumable: true, shop: "grocery", description: "一瓶乾淨的水。" },
        //{ type: "supply", id: "cookingTool", name: "🫕 野炊工具", usable: true, shop: "grocery", description: "只要有柴火和食材，就能隨時隨地烹飪食物。" },,
        //{ type: "supply", id: "tent", name: "⛺ 帳篷", usable: true, shop: "grocery", description: "能搭建簡便的營地，但在野外過夜有一定的危險。" },,
        { name: "🍾 血葡萄酒", id: "bloodWine", type: "supply", price: 15, heal: 5, usable: true, consumable: true, description: "以生長在地底的血葡萄釀成的酒，味道像人血，是吸血鬼喜愛的飲品。" },
        // 食物,
        { name: "🥔 馬鈴薯", id: "potato", type: "food", price: 1, heal: 10, shop: "grocery", description: "農田收成的馬鈴薯，烹飪後可以食用。" },
        { name: "🐟 鮮魚", id: "fish", type: "food", price: 2, heal: 20, shop: "grocery", description: "新鮮捕撈的魚，烹飪後可以食用。" },
        { name: "🥩 生肉", id: "meat", type: "food", price: 3, heal: 30, shop: "grocery", description: "打獵取得的肉，烹飪後可以食用。" },
        { name: "🥓 觸手肉", id: "tentacleLoot", type: "food", price: 4, heal: 40, description: "長滿吸盤的滑溜觸手，死後仍會扭動，烹飪後可以食用。" },
        { name: "🕷️ 蜘蛛肉", id: "spiderLoot", type: "food", price: 5, heal: 50, description: "堅韌的肉，有微弱毒素，摸過之後手會發癢，烹飪後可以食用。" },
        // 料理,
        { name: "🍺 啤酒", id: "meal01", type: "meal", price: 1, heal: 10, shop: "tavern", description: "最受旅人與戰士歡迎的經典佳釀。" },
        { name: "🥧 莓果派", id: "meal02", type: "meal", price: 1, heal: 10, shop: "tavern", description: "內餡包滿了新鮮野莓的甜派，酸甜可口。" },
        { name: "🥘 奶油蘑菇湯", id: "meal03", type: "meal", price: 2, heal: 20, shop: "tavern", description: "濃郁奶油加入蘑菇、洋蔥與數種鮮蔬熬煮，溫暖順口，最適合寒冷夜晚享用。" },
        { name: "🍲 麵包配燉肉湯", id: "meal04", type: "meal", price: 2, heal: 20, shop: "tavern", description: "將肉塊與馬鈴薯、紅蘿蔔燉煮數小時，肉質入口即化，搭配現烤麵包更是絕配。" },
        { name: "🍖 嫩煎羊肋排", id: "meal05", type: "meal", price: 3, heal: 30, shop: "tavern", description: "將羊肋排以秘製醬汁醃製後，煎至表面焦脆，內部鮮嫩多汁，最適合配上一杯啤酒。" },
        { name: "🍗 香草烤野雞", id: "meal06", type: "meal", price: 3, heal: 30, shop: "tavern", description: "豪邁地將整隻野雞裹上迷迭香與辛香料，慢火炭烤至外皮金黃香酥，肉汁橫流，香氣四溢。" },
        // 戰利品,
        { name: "💰 蠕蟲", id: "wormLoot", type: "loot", price: 0, heal: 1, usable: true, consumable: true, description: "富含營養，但味道噁心，吃了會一整天不舒服。" },
        { name: "💰 黏液", id: "slimeLoot", type: "loot", price: 1, description: "史萊姆的黏液。" },
        { name: "💰 仙塵", id: "fairyDust", type: "loot", price: 1, description: "仙子的魔法粉末，通常會邊飛邊灑落。" },
        { name: "💰 蝙蝠翅膀", id: "batLoot", type: "loot", price: 1, description: "蝙蝠的翅膀。" },
        { name: "💰 植物莖", id: "vineLoot", type: "loot", price: 3, description: "切下來的藤蔓。" },
        { name: "💰 毒蘑菇", id: "mushroomLoot", type: "loot", price: 2, description: "不可食用的蘑菇。" },
        { name: "🫘 食人花種子", id: "manEaterSeed", type: "loot", price: 0, description: "蘊藏著蠢蠢欲動的生命，商人不願意買，但有人在公會高價收購。" },
        { name: "💰 腐肉", id: "rottenMeat", type: "loot", price: 0, description: "已經腐爛的肉塊。" },
        { name: "💰 毛皮", id: "fur", type: "loot", price: 3, description: "動物的毛皮。" },
        { name: "💰 蜥蜴皮", id: "lizardLoot", type: "loot", price: 2, description: "火蜥蜴的硬皮。" },
        { name: "💰 獠牙", id: "tusk", type: "loot", price: 4, description: "野豬的獠牙。" },
        { name: "💰 蜘蛛絲", id: "silk", type: "loot", price: 5, description: "巨型蜘蛛的絲線。" },
        { name: "💰 水晶眼珠", id: "gargoyleLoot", type: "loot", price: 10, description: "石像鬼的眼珠。" },
        //{ type: "loot", id: "gargoyleLoot", name: "💰 石塊", description: "石像鬼死後化成了碎石。", price: 1 },,
        { name: "💰 堅硬羽毛", id: "eagleLoot", type: "loot", price: 2, description: "巨鷹的羽毛。" },
        { name: "💰 龍鱗", id: "dragonLoot", type: "loot", price: 30, description: "龍的鱗片。" },
        { name: "🪵 木頭", id: "wood", type: "loot", price: 0, description: "可當作柴火。" },
        { name: "💰 樹妖皮", id: "treantLoot", type: "loot", price: 6, description: "樹妖掉落的樹皮。" },
        { name: "💰 布料", id: "cloth", type: "loot", price: 0, description: "拆解衣物得到的碎布。" },
        { name: "💰 幽靈物質", id: "ghostLoot", type: "loot", price: 15 },
        { name: "📎 鐵絲", id: "ironＷire", type: "loot", price: 0, description: "可以用來撬鎖。" },
        { name: "💍 馬卡斯的戒指", id: "MarcusRing", type: "loot", price: 200, description: "從馬卡斯手上取下的金戒指，看起來很名貴。" },
        // 任務物品,
        { name: "📦 包裹", id: "package01", type: "specialItem", price: 20, description: "要送到晨曦鎮的包裹。" },
        { name: "📦 破損包裹", id: "package01_damaged", type: "specialItem", price: 0, description: "要送到晨曦鎮的包裹，被之前遇到的敵人破壞了。" },
        { name: "📦 包裹", id: "package02", type: "specialItem", price: 20, description: "要送到鐵石鎮的包裹。" },
        { name: "📦 破損包裹", id: "package02_damaged", type: "specialItem", price: 0, description: "要送到鐵石鎮的包裹，被之前遇到的敵人破壞了。" },
        { name: "📦 包好的武器", id: "weaponPack", type: "specialItem", price: 0, usable: true, consumable: true, description: "向哥布林商人買來的，不知道裡面裝著什麼。" },
        { name: "📦 包好的盔甲", id: "armorPack", type: "specialItem", price: 0, usable: true, consumable: true, description: "向哥布林商人買來的，不知道裡面裝著什麼。" },
        { name: "♦️ 紅寶石", id: "devilGem01", type: "specialItem", price: 666, investigable: true, description: "當你盯著這顆紅寶石時，一個聲音在你腦中響起，要你把它拿近一點。" },
        { name: "♦️ 紅寶石", id: "devilGem02", type: "specialItem", price: 666, usable: true, investigable: true, description: "封印著惡魔的紅寶石。" },
        { name: "💰 沾到綠血的玻璃", id: "specialItem15", type: "specialItem", price: 0, description: "這塊玻璃碎片沾了哥布林的血，讓吸血鬼覺得臭氣熏天。" },
        { name: "💰 幽靈菇", id: "specialItem16", type: "specialItem", price: 0, description: "吃下後不知道會變成怎麼樣的毒菇。" },
        { name: "🗝️ 牢房鑰匙", id: "key01", type: "specialItem", price: 50, description: "可以打開監獄裡任何一間牢房。" },
        { name: "🗝️ 鐵鑰匙", id: "key02", type: "specialItem", price: 0, description: "堅固的鐵製鑰匙。" }
    ];

    // 商品限購數量
    const buyLimit = 10;

    // 顯示主角物品列表
    function showPlayerItems(usage, itemType, memberName) {
        // 儲存列表以便刷新
        const currentList = [usage, itemType, memberName];
        localStorage.setItem("currentList", JSON.stringify(currentList));

        // 讀取主角物品
        let playerItems = JSON.parse(localStorage.getItem("playerItems")) || [];

        // 統計物品數量
        let count = {};
        playerItems.forEach(item => {
            count[item] = (count[item] || 0) + 1;
        });

        // 找到列表容器
        let itemList;
        if (document.getElementById("addition")) {
            itemList = document.getElementById("addition"); // 如果在對話中
        } else {
            itemList = document.getElementById("item-list");
        }
            
        itemList.innerHTML = "";

        // 顯示物品列表
        Object.keys(count).forEach(itemId => {
            //let item = itemData.find(i => i.id === itemId); // 從資料庫查找物品
            let item = findItemData(itemId); // 從資料庫查找物品
            if (!item) return;

            // 如果有指定類型，以類型篩選物品
            if (itemType && item.type !== itemType) return;

            // 如果是穿裝備，以類型篩選物品，排除其他人的專屬裝備
            if ((usage === "equip" && itemType && item.type !== itemType) || (item.owner && item.owner !== memberName)) return;

            // 如果是上架拍賣，排除價格未達門檻的物品
            if (usage === "sellAtAuction" && item.price < threshold) return;

            // 如果是賣出、上架拍賣，排除 specialItem 和同伴專屬物品
            if (usage === "sell" || usage === "sellAtAuction") {
                if (item.type === "specialItem" || item.owner) return;
            }

            // 創建物品欄位
            let itemDiv = document.createElement("div");
            itemDiv.classList.add("item", "background");

            // 顯示物品資料
            itemDiv.innerHTML = showItemHTML(item, count[itemId], usage);

            // 點擊物品時，顯示或隱藏詳細資訊
            let itemElement = itemDiv;
            let hidedElement = itemDiv.querySelector(".hided");
            itemElement.addEventListener("click", () => {
                hidedElement.style.display = (hidedElement.style.display === "none") ? "block" : "none";
            });

            itemList.appendChild(itemDiv);
        });
    }

    // 顯示商品列表
        // 單個商品 showShop(null, 'weapon01');        
        // 多個商品 showShop(null, ['weapon01', 'armor03', 'supply05']);
    function showShop(shopType, itemIds) {
        // 儲存列表以便刷新
        const currentList = [shopType, itemIds];
        localStorage.setItem("currentList", JSON.stringify(currentList));

        // 顯示商店說明（如果有）
        if (texts && texts[shopType] && document.getElementById("text")) {
            document.getElementById("text").textContent = texts[shopType];
        }

        // 篩選商品
        let itemData = [];
        if (shopType) {
            // 如果是商店，依商店類型篩選物品
            itemData = itemDatabase.filter(i => i.shop === shopType); 
        } else { 
            // 如果沒有商店，只顯示指定商品
            if (!Array.isArray(itemIds)) {
                itemIds = [itemIds]; // 如果只輸入單一字串，轉成陣列
            }
            itemData = itemDatabase.filter(i => itemIds.includes(i.id));
        }
        console.log(itemData);


        // 找到列表容器
        let itemList;
        if (document.getElementById("addition")) {
            itemList = document.getElementById("addition"); // 如果在對話中
        } else {
            itemList = document.getElementById("item-list");
        }
        itemList.innerHTML = "";

        // 顯示目前金錢
        const playerMoney = parseInt(localStorage.getItem("playerMoney")) || 0;
        if (document.getElementById("addition")) {
            // 如果在對話中，建立金錢欄位
            let container = document.getElementById("addition");
            moneyDiv = document.createElement("div");
            moneyDiv.innerHTML = `
                <p class="small">🪙 $<span id="playerMoney">${playerMoney}</span></p>
            `;
            container.appendChild(moneyDiv);
        } else {
            let moneyDiv = document.getElementById("playerMoney"); // 找到欄位
        }

        // 顯示物品列表
        itemData.forEach(item => {
            let itemDiv = document.createElement("div");
            itemDiv.classList.add("item", "background");
            
            // 讀取已購數量
            const boughtCount = JSON.parse(localStorage.getItem("boughtCount")) || {};
            const townId = JSON.parse(localStorage.getItem("playerPos")).id; // 讀取主角所在城鎮
            if (!boughtCount[townId])  boughtCount[townId] = {}; // 沒買過就初始化
            if (boughtCount[townId][item.id] === undefined) boughtCount[townId][item.id] = 0; // 沒買過就初始化
            localStorage.setItem("boughtCount", JSON.stringify(boughtCount)); // 儲存初始化數據
            
            // 如果賣完（達到限購數量）就不顯示
            if (boughtCount[townId][item.id] === buyLimit) {
                return;
            }

            // 計算庫存量
            const count = buyLimit - boughtCount[townId][item.id];

            // 顯示物品資料
            if (shopType === "tavern") {
                itemDiv.innerHTML = showItemHTML(item, count, "tavern");
            } else {
                itemDiv.innerHTML = showItemHTML(item, count, "shop");
            }

            // 點擊物品時，顯示或隱藏詳細資訊
            let itemElement = itemDiv.querySelector(".column-container");
            let hidedElement = itemDiv.querySelector(".hided");

            itemElement.addEventListener("click", () => {
                hidedElement.style.display = (hidedElement.style.display === "none") ? "block" : "none";
            });

            itemList.appendChild(itemDiv);
        });
    }

    // 顯示物品資料
    function showItemHTML(item, count, usage) {
        // 找到附加狀態的資料
            let status;
            if (item.addStatus) {
                status = statusData.find(s => s.id === item.addStatus);
            }

        // 創建物品價格
            let itemPrice;
            if (usage === "shop" || usage === "tavern") { // 商店，顯示 2 倍價格                
                itemPrice = "$" + item.price * 2; 
            } else if (usage === "sell") { // 賣出，顯示價格與賣出按鈕
                itemPrice = "$" + item.price + `
                    <button class="small-button" onclick="sellItem('${item.id}')">
                        <spam class="small">賣出</span>
                    </button>
                `;
            } else if (usage === "auction") { // 拍賣中、流標，顯示起標價                
                itemPrice = `<span class="small note">起標價</span> $` + item.startingPrice; 
            } else if (usage === "sold") { // 拍賣成交，顯示成交價                
                itemPrice = `<span class="small note">成交價</span> $` + item.finalPrice;
            } else if (usage === "equip") { // 裝備
                itemPrice = `
                    <button class="small-button" onclick="(equip(memberId, '${item.id}'), showCharacterSheet())">
                        <span class="small">選擇</span>
                    </button>
                `;
            } else if (usage === "cook") { // 烹飪
                itemPrice = `
                    <button class="small-button" onclick="cook('${item.id}')">
                        <spam class="small">烹飪</span>
                    </button>
                `;
            } else if (item.price || item.price === 0) { // 顯示價格
                itemPrice = "$" + item.price; 
            } else { // 無價格
                itemPrice = "-"; 
            }

        // 創建動作按鈕
            let buttons = "";
            if (usage === "inventory") { // 物品欄
                buttons = `
                    ${item.usable ? 
                        `<button class="column center" onclick="useItem('${item.id}')">
                            <span class="small">使用</span>
                        </button>` : ""}
                    ${item.investigable ? 
                        `<button class="column center" onclick="investigateItem('${item.id}')">
                            <span class="small">查看</span>
                        </button>` : ""}
                    ${item.type !== "specialItem" && !item.owner ? 
                        `<button class="column center" onclick="discardItem('${item.id}')">
                            <span class="small">🗑️ 丟棄</span>
                        </button>` : ""}
                `;
            } else if (usage === "shop") { // 商店
                buttons = `
                    <button onclick="buyItem('${item.id}')" class="small-button">
                        <span class="small">購買</span>
                    </button>
                    <button onclick="stealItem('${item.id}')" class="small-button" style="flex: 0 0 60px;">
                        <span class="small warn">偷竊</span>
                    </button>
                `;
            } else if (usage === "sellAtAuction") { // 上架拍賣
                buttons = `
                    <button onclick="listForAuction('${item.id}')" class="small-button">
                        <spam class="small">上架拍賣</span>
                    </button>
                `;
            } else if (usage === "auction" && item.seller === "player") { // 拍賣品                
                buttons = `
                    <button onclick="delistFromAuction('${item.id}', 'auction')" class="small-button">
                        <span class="small">下架</span>
                    </button>
                `;
            } else if (usage === "sold") { // 拍賣成交
                buttons = `
                    <button onclick="delistFromAuction('${item.id}', 'sold')" class="small-button">
                        <span class="small">收款</span>
                    </button>
                `;
            } else if (usage === "tavern") { // 酒館
                buttons = `
                    <button onclick="buyItem('${item.id}')" class="small-button">
                        <span class="small">點餐</span>
                    </button>
                `;
            }

        // 創建隱藏的內容
        let hidedElement = `
            <hr class="light-hr">
            <div class="column-container">
                ${item.dmg ? `<p class="column">
                    <span class="note small">⚔️傷害</span><br>
                    ${item.minDmg === item.maxDmg ? `${item.minDmg}` : `${item.minDmg}~${item.maxDmg}` }</p>
                ` : "" }
                ${item.arm ? `<p class="column">
                    <span class="note small">🛡️護甲</span><br>
                    ${item.arm}</p>
                ` : "" }
                ${item.cha ? `<p class="column">
                    <span class="note small">✨魅力</span><br>
                    ${item.cha}</p>
                ` : "" }
                ${item.dex ? `<p class="column">
                    <span class="note small">🏃敏捷</span><br> 
                    ${item.dex}</p>
                ` : "" }
                ${item.heal ? `<p class="column">
                    <span class="note small">❤️‍🩹治療</span><br>
                    ${item.heal}
                ` : "" }
                ${item.weight ? `<p class="column">
                    <span class="note small">⚖️重量</span><br>
                    ${item.weight}</p>
                ` : "" }
            </div>
            <p class="small">
                ${item.addStatus ? `【${status.name}】機率 ${item.addChance*100}%<br>目標${status.description}` : ""}
            </p>
            <p class="small note">
                ${item.description}
            </p>
            <hr class="light-hr">
            <div class="row-buttons">${buttons}</div>
        `;

        // 回傳資料
        if (usage !== "description") {
            // 回傳完整資料
            return `
                <!-- 物品名稱、數量、價格、小按鈕 -->
                <div class="column-container" style="cursor: pointer;">
                    <span class="column left">
                        ${item.name}${count ? ` × ${count}` : "" }
                    </span>
                    <span class="column-small">${itemPrice}</span>
                </div>

                <!-- 隱藏的物品描述、按鈕 -->
                <div class="hided" style="display: none;">${hidedElement}</div>
            `;

        } else {
            // 只回傳隱藏的內容（用於查看角色身上的裝備）
            return hidedElement;
        }
    }

    // 購買
    function buyItem(itemId) {
        let playerMoney = parseInt(localStorage.getItem("playerMoney")) || 0;
        let playerItems = JSON.parse(localStorage.getItem("playerItems")) || [];
        let orderedMeals = JSON.parse(localStorage.getItem("orderedMeals")) || [];

        // 找到這件商品的資料
        let item = itemDatabase.find(i => i.id === itemId);
        if (!item) return;
        
        // 讓玩家輸入數量
        let input = prompt(`資金有 $${playerMoney}，要購買幾份？`, "1");

        // 如果玩家按「取消」，則直接結束函式
        if (input === null) return;

        // 取得購買數量
        let buyAmount = parseInt(input); 

        // 驗證輸入是否有效
        if (isNaN(buyAmount) || buyAmount <= 0) {
            alert("請輸入有效的數量");
            return;
        }

        let buyPrice = item.price * 2; // 設定購買價格為 2 倍
        let totalCost = buyPrice * buyAmount; // 計算總價格

        // 檢查錢夠不夠
        if (playerMoney < totalCost) {
            alert("金錢不足");
            return;
        }

        // 檢查是否超出限購數量
        const boughtCount = JSON.parse(localStorage.getItem("boughtCount")) || [];
        const townId = JSON.parse(localStorage.getItem("playerPos")).id; // 讀取主角所在城鎮
        if (boughtCount[townId][itemId] + buyAmount > buyLimit) {
            alert("庫存不足");
            return;
        }

        // 扣除金錢
        playerMoney -= totalCost;

        // 獲得商品
        if (item.type === "meal") {
            // 如果是料理，加入點餐清單（乘以數量）
            for (let i = 0; i < buyAmount; i++) {
                orderedMeals.push(item);
            }

            // 重新計算隊伍需要的治療量
            const teamMembers = JSON.parse(localStorage.getItem("teamMembers")) || [];
            let requiredHeal = 0;
            teamMembers.forEach(member =>{
                requiredHeal += member.MaxHP;
                requiredHeal -= member.HP;
            });

            // 重新計算料理的總治療量
            const totalHeal = orderedMeals.reduce((sum, meal) => sum + meal.heal, 0);

            // 重新顯示訊息
            if (teamMembers.length > 1) {
                document.getElementById("text").innerHTML = texts.sitTogether(requiredHeal, totalHeal); // 和同伴坐下
            } else {
                document.getElementById("text").innerHTML = texts.sit(requiredHeal, totalHeal); // 獨自坐下
            }

        } else {
            // 如果是商品，加入玩家背包 (乘以數量)
            for (let i = 0; i < buyAmount; i++) {
                playerItems.push(itemId);
            }
        }

        // 已購數量增加
        boughtCount[townId][itemId] += buyAmount;

        // 存回 localStorage
        localStorage.setItem("playerItems", JSON.stringify(playerItems));
        localStorage.setItem("orderedMeals", JSON.stringify(orderedMeals));
        localStorage.setItem("playerMoney", playerMoney);
        localStorage.setItem("boughtCount", JSON.stringify(boughtCount));

        // 更新顯示的金錢
        loadPartyData();

        // 重新顯示列表
        const currentList = JSON.parse(localStorage.getItem("currentList")) || [];
        showShop(currentList[0], currentList[1]);
    }

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
                    playerItems.splice(index, 1); // 移除第一個該物品
                } else {
                    break; // 沒有該物品就停止移除
                }
            }

            // 存回 localStorage
            localStorage.setItem("playerItems", JSON.stringify(playerItems));
        }
    }

    // 穿上或脫下裝備（可輸入 memberId，也可輸入 member 物件）
        // 脫下武器 equip("player", "noWeapon")
        // 脫下盔甲 equip("player", "noArmor")
    function equip(memberId, itemId) {
        // 讀取所有角色的資料
        const teamMembers = JSON.parse(localStorage.getItem("teamMembers")) || [];
        const enemies = JSON.parse(localStorage.getItem("enemies")) || [];
        
        // 取得角色資料
        let member = (typeof memberId === 'object' && memberId !== null)
            ? memberId // 如果輸入的是物件，就直接用
            : teamMembers.find(m => m.id === memberId) || enemies.find(m => m.id === memberId); // 如果輸入的是 id，就找到角色資料（從同伴或敵人中）
        
        // 讀取玩家的物品
        let playerItems = JSON.parse(localStorage.getItem("playerItems")) || [];
        let itemType;

        // 如果脫下裝備
        if (itemId === "noWeapon") {
            if (member.weapon) playerItems.push(member.weapon.id); // 將原本的武器放回主角物品
            member.weapon = {}; // 清空武器
            itemType = "weapon";
        } else if (itemId === "noArmor") {
            if (member.armor) playerItems.push(member.armor.id); // 將原本的盔甲放回主角物品
            member.armor = {}; // 清空盔甲
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
        let item = member[itemType] ? member[itemType] : { str: 0, dex: 0, cha: 0, arm: 0, weight: 0 };
       
        // 加總屬性
        ["str", "dex", "con", "int" , "wis", "cha", "arm", "weight", "minDmg", "maxDmg"].forEach(attr => {
            // 將裝備屬性存入角色屬性中
            member[attr][itemType] = item[attr] || 0;
            
            // 計算 total
            member[attr].total = Object.entries(member[attr])
                .filter(([key]) => key !== "total") // 過濾掉 "total"
                .reduce((sum, [, val]) => sum + val, 0); // 累加數值
        });

        // 檢查負重是否超過力量，每超過 1 就承受 -1 敏捷減值
        if (member.weight.total > member.str.total) {
            member.dex.weight = member.str.total - member.weight.total;
            member.dex.total += member.dex.weight;
        } else {
            member.dex.total -= (member.dex.weight || 0);
            member.dex.weight = 0;
        }

        // 更新 localStorage
        localStorage.setItem("playerItems", JSON.stringify(playerItems));
        localStorage.setItem("teamMembers", JSON.stringify(teamMembers));
        localStorage.setItem("enemies", JSON.stringify(enemies));

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

        let availableMember = JSON.parse(localStorage.getItem("availableMember")) || [];
        let actableData = availableMember.find(m => m.id === memberId);
        if (actableData) {
            actableData.str = member.str;
            actableData.arm = member.arm;
            actableData.dex = member.dex;
            actableData.cha = member.cha;
            actableData.weapon = member.weapon;
            actableData.armor = member.armor;
        }
        localStorage.setItem("availableMember", JSON.stringify(availableMember));

        // 同步儲存到主角資料
        //if (member.id === "player") {
        //    localStorage.setItem("playerWeapon", JSON.stringify(member.weapon));
        //    localStorage.setItem("playerArmor", JSON.stringify(member.armor));
        //}
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

// 情緒相關

    // 情緒資料庫
    const emotionData = [
        // 共同
        { type: "good", mood: 1, id: "fullHP", name: "精力充沛", note: "HP全滿", indefinite: true },
        { type: "good", mood: 1, id: "battleWin", name: "戰鬥勝利" },
        { type: "good", mood: 1, id: "criticalHit", name: "打出了爆擊" },
        { type: "good", mood: 1, id: "completeQuest", name: "完成任務" },
        { type: "good", mood: 1, id: "enjoyMeal", name: "享用餐點" },

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
        { type: "good", mood: 1, id: "teamwork", name: "團隊合作", note: "聯手終結敵人" },
        { type: "good", mood: 1, id: "reconciliation", name: "和夥伴和解", note: "見了羅文和戴瑞", indefinite: true },
        { type: "bad", mood: -1, id: "reactToStealing", name: "失望", note: "發現你偷竊" },
        { type: "bad", mood: -1, id: "selfBlame", name: "自責", note: "目睹你被敵人擊倒" },

        // 塔爾穆克
        { type: "good", mood: 1, id: "kill", name: "殺戮快感", note: "終結敵人" },
        { type: "bad", mood: -1, id: "reactToPeace", name: "無聊，我要看到血流成河", note: "成功說服敵人停戰" },

        // 賽恩
        { type: "good", mood: 1, id: "paidWithBlood", name: "鮮血款待", note: "你允許他吸血" },
        { type: "bad", mood: -1, id: "noPaidWithBlood", name: "沒有吸到血", note: "你拒絕讓他吸血" },
        { type: "bad", mood: -1, id: "vampireSucks", name: "獵物被染指", note: "你讓其他吸血鬼吸你的血" },

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

    // 獲得情緒（輸入 id 或 name 都可以）
    function getEmotion(memberId, emotionId, toast = true) {
        // 取得該成員的資料
        let teamMembers = JSON.parse(localStorage.getItem("teamMembers")) || [];
        let member = teamMembers.find(m => m.id === memberId || m.name === memberId);

        // 找到情緒的資料
        const newEmotion = emotionData.find(e => e.id === emotionId);

        // 情緒不會重複獲得
        const hasEmotion = member.emotion.some(e => e.id === emotionId);
        if (hasEmotion) {
            return;
        }

        // 如果是無限期情緒，不會重複獲得
        //const hasEmotion = member.emotion.find(e => e.id === emotionId);
        //if (newEmotion.indefinite && hasEmotion) {
        //    return;
        //}

        // 添加情緒
        member.emotion.push(newEmotion);

        // 顯示通知
        if (toast) {
            if (newEmotion.type === "good") {
                showToast(`${member.name}因為${newEmotion.name}，心情變好了`);
            } else {
                showToast(`${member.name}因為${newEmotion.name}，心情變差了`);
            }
        }

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
        ["str", "dex", "con", "int", "wis", "cha", "arm"].forEach(attr => {
            member[attr].total = Object.entries(member[attr])
                .filter(([key]) => key !== "total") // 過濾掉 "total"
                .reduce((sum, [, val]) => sum + val, 0); // 累加數值
        });

        // 儲存更新後的隊伍資料
        localStorage.setItem("teamMembers", JSON.stringify(teamMembers));
    }
    
// 場景跳轉相關

    // 地點
    const locations = [
        { id: "town01", name: "晨曦鎮", x: 1, y: 0, visible: true },  
        { id: "town02", name: "鐵石鎮", x: 5, y: 4, visible: true }, 
    ];

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
        turnSwitch("酒館用餐", false); // 重置打烊
        turnSwitch("拚酒開始", false);
        turnSwitch("拚酒結束", false);
        localStorage.removeItem("drinkingResults");

        // 重置商品已購次數（商店補貨）
        localStorage.removeItem("boughtCount");

        // 重置離隊後冷卻中的傭兵
        localStorage.removeItem("cooldownMerc");

        turnSwitch("雷納德路過", false); // 每天有一次機會路過
        turnSwitch("小屋生火", false); // 隔天火會熄滅

        // 抽天氣
        const weathers = [ 
            { icon: "☀️", name: "晴天", description: "有陽光，不死生物不會出沒。" },
            { icon: "🌤️", name: "晴時多雲", description: "有陽光，不死生物不會出沒。" },
            { icon: "☁️", name: "多雲", description: "不死生物會出沒。" },
            { icon: "☁️", name: "陰天", description: "不死生物會出沒。" },
            { icon: "🌧️", name: "小雨", description: "植物少量增長，不死生物會出沒。" },
            { icon: "⛈️", name: "大雷雨", description: "智慧生物不會出門，植物大量增長，不死生物會出沒。" },
            { icon: "🌫️", name: "濃霧", description: "潛行容易成功，但難以發現伏擊的敵人，不死生物會出沒。" },
            { icon: "🔥", name: "極端炎熱", description: "龍可能出現，不死生物不會出沒。" },
        ];
        let randomIndex = Math.floor(Math.random() * weathers.length);
        let selectedWeather = weathers[randomIndex];
        localStorage.setItem("weather", JSON.stringify(selectedWeather));

        // 如果有上架拍賣品，產生拍賣結果
        let auctionItems = JSON.parse(localStorage.getItem("auctionItems")) || [];
        if (auctionItems.length > 0) {
            let soldItems = JSON.parse(localStorage.getItem("soldItems")) || [];

            // 決定每件拍賣品是否成交
            auctionItems.forEach(item => {
                // 買方預算範圍
                const min = Math.min(item.price, item.startingPrice); // 最小值為物品售價或起標價，看哪個比較低
                const max = Math.floor(item.price * 2); // 最大值為售價的 2 倍

                // 隨機決定買方預算
                const buyerBudget = Math.floor(Math.random() * (max - min + 1)) + min;

                // 如果預算達到起標價以上，成交
                if (buyerBudget >= item.startingPrice) {
                    // 加入成交商品
                    soldItems.push({ ...item, finalPrice: buyerBudget });

                    // 從拍賣品中移除
                    let index = auctionItems.indexOf(item);
                    if (index !== -1) {
                        auctionItems.splice(index, 1); // 移除第一個該物品
                    }
                }
            });

            // 儲存
            localStorage.setItem("soldItems", JSON.stringify(soldItems));
            localStorage.setItem("auctionItems", JSON.stringify(auctionItems));
        }

        // 重置採集次數
        let harvestCounts = [
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0]
        ];
        localStorage.setItem("harvestCounts", JSON.stringify(harvestCounts));

    }

    // 返回上一頁
    function goBack() {
        window.history.back(); 
    }

    // 快速旅行
    function fastTravel(townId) {
        // 如果有指定城鎮
        if (townId) {
            const townPos = locations.find(town => town.id === townId);
            localStorage.setItem("townPos", JSON.stringify(townPos)); // 儲存為最近城鎮
        }

        // 讀取最近的城鎮位置
        const townPos = JSON.parse(localStorage.getItem("townPos"));

        // 更新主角的位置
        localStorage.setItem("playerPos", JSON.stringify(townPos));

        // 跳轉到城鎮頁面
        goTo("locations/town");
    }

    // 跳轉場景，根據目前頁面調整路徑
    function goTo(location) {
        let folderName = window.location.pathname.split("/").slice(-2, -1)[0];
        if (folderName === "RPG") {
            window.location.href = location + '.html';
        } else {
            window.location.href = "../" + location + '.html';
        }
    }

    // 指定戰鬥
        // 一個守衛 battle(2, "守衛", 1)
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

        // 跳轉到遭遇頁面
        goTo("encounter");
    }

// 程式相關

    // 將資料庫存為 CSV 檔：
    // const csvData = jsonToCSV(資料庫);
    // downloadCSV(csvData, '資料庫.csv');

    // 將 JSON 資料轉換為 CSV 字串
    function jsonToCSV(jsonData) {
        // 收集所有可能的鍵名
        const keys = Array.from(new Set(jsonData.flatMap(Object.keys)));

        const csv = jsonData.map(row => {
        return keys.map(key => {
            // 如果屬性不存在，填入空字串
            const value = row[key] !== undefined ? row[key] : "";
            // 如果是陣列型態，就轉為字符串
            if (Array.isArray(value)) {
            return `"${value.join(',')}"`;
            }
            return `"${value}"`;
        }).join(',');
        });

        // 將標題行加到 CSV 開頭
        return [keys.join(','), ...csv].join('\n');
    }

    // 下載 CSV 檔案
    function downloadCSV(csvData, filename = "data.csv") {
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');

      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }

    // 匯出遊戲資料
    function backupLocalStorage() {
        // 取得 localStorage 中的所有資料
        const data = {};

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i); // 取得每一個鍵
            const value = localStorage.getItem(key); // 取得該鍵對應的值
            data[key] = value; // 存入備份對象
        }

        // 將資料轉換成 JSON 字串
        const jsonData = JSON.stringify(data);

        // 創建一個 Blob 對象，並將 JSON 字串轉換為 Blob
        const blob = new Blob([jsonData], { type: 'application/json' });

        // 創建一個下載連結
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'localStorage-backup.json'; // 設定下載的檔案名稱

        // 模擬點擊下載連結，觸發下載
        link.click();
    }

    // 讀取遊戲資料
    function restoreLocalStorage(file) {
        const reader = new FileReader();
    
        reader.onload = function(event) {
            const data = JSON.parse(event.target.result); // 解析 JSON 資料
        
            // 將資料儲回 localStorage
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    localStorage.setItem(key, data[key]);
                }
            }

            alert('讀取成功');
        };

        // 讀取檔案
        reader.readAsText(file);
    }
