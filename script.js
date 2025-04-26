// 顯示相關

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
    function roll(attribute1, attribute2 = 10, successKey, failKey) {
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
        { id: "paladin", name: "聖騎士", description: "聖騎士為正義與公理而戰，有強烈的使命感，扶弱濟貧、懲奸除惡。他們願將自身化為弱者的盾，無私的英雄形象深植人心。", keyAttr: "體質、魅力", mp: "cha", skills: ["disarm","guard","divineSanction"], asEnemy: false },
        { id: "rogue", name: "刺客", description: "刺客潛伏在暗影中，往往在戰鬥開始前就解決了敵人。有些刺客擅長偽裝成無害的樣子，讓目標失去警惕。", keyAttr: "敏捷、魅力", skills: ["stealth","sneakAttack","lure"], asEnemy: true },
        { id: "hunter", name: "獵人", description: "獵人擅長追蹤與精準出擊，能以野獸般的感官找出隱藏的事物。他們不會冒然行動，一旦盯上獵物就絕不放過。", keyAttr: "感知", skills: ["mark","reveal","criticalBlast"], asEnemy: true },
        { id: "wizard", name: "法師", description: "法師能施展強大的魔法，造成大規模傷害，左右戰局。然而法術的成本高昂，也使他們難以兼顧自己的安全。", keyAttr: "智力", mp: "int", skills: ["lightning","earthquake","fireball"], asEnemy: true },
        { id: "cleric", name: "牧師", description: "牧師的神奇能力來自於信仰，他們是治療者，不奪取性命，但能夠克制敵對的施法者，淨化對方的異端魔力。", keyAttr: "感知", mp: "wis", skills: ["heal","magicShield","seal"], asEnemy: true }
    ];

    // 技能資料庫
    const skillData = [
        { id: "attack", icon: "⚔️", name: "攻擊", description: "以武器攻擊一個目標，造成等同角色力量的物理傷害。", target: "依武器", hitCheck: "dex-vs-dex", hitMessage: "擊中了${target.name}(${result.damage})！", missMessage: "試圖攻擊，但${target.name}躲過了", damage: "user.str - target.arm" },
        { id: "escape", icon: "🏃", name: "逃跑", description: "通過一次敏捷檢定，逃離戰鬥。", target: "最高dex", hitCheck: "dex-vs-dex", hitMessage: "逃走了！", missMessage: "逃跑時被敵人阻擋了", escape: true },
        // 戰士,
        { id: "armorBreak", icon: "💥", name: "破甲", description: "攻擊一個近距離目標，削減目標的護甲值，削減量等於此次傷害的1/5，但戰士會受到等同目標護甲值的反彈傷害。", target: "前排單體", hitCheck: "dex-vs-dex", hitMessage: "擊中了${target.name}(${result.damage})！驚人的力量擊破了對方護甲(${result.damage}/5)，但也傷到了自己(${target.arm.total} + ${result.damage}/5)", missMessage: "試圖攻擊，但${target.name}躲過了", damage: "user.str - target.arm", userDamage: "target.arm", targetStatus: "armorBroken", armorBreak: "(user.str - target.arm) / 5" },
        { id: "pin", icon: "🤚", name: "壓制", description: "通過一次力量檢定，將一個近距離目標壓在地上，使其無法行動也無法閃避，但壓制期間戰士無法閃避其他敵人的攻擊。", target: "前排單體", hitCheck: "str-vs-str", hitMessage: "朝${target.name}猛撲過去，把他壓制在地上！", missMessage: "朝${target.name}猛撲過去，但撲了個空", targetStatus: "pinned", userStatus: "pinning" },
        { id: "berserk", icon: "🌋", name: "狂暴", description: "戰士 HP 低於 50% 時可發動，獲得 3 回合狂暴和流血。狂暴狀態下，攻擊獲得命中優勢，HP 每損失 1 點，爆擊率就提高 1%。", condition: "user.HP <= user.MaxHP / 2 && !user.status.includes(\"berserk\")", target: "自己", hitMessage: "發出令人膽顫心驚的怒吼！他無所畏懼，傷得越重，打人越痛！", userStatus: ["berserk","bleeding"] },
        //【魯莽攻擊】此次攻擊獲得優勢，但本回合敵人對戰士的攻擊也獲得優勢。,
        // 聖騎士,
        { id: "disarm", icon: "🫴", name: "繳械", description: "通過一次敏捷檢定，去除目標的武器。", target: "依武器", hitCheck: "dex-vs-dex", hitMessage: "準確地把${target.name}手中的武器擊飛，現在他赤手空拳了！", missMessage: "沒能讓${target.name}放開武器", targetStatus: "disarmed" },
        { id: "guard", icon: "🛡️", name: "守護", description: "選擇一個同排的同伴，代替同伴承受本回合所有攻擊，且承受閃避劣勢。", target: "同排單體", hitMessage: "將不顧一切地保護${target.name}的安全", targetStatus: "guarded", userStatus: "guarding" },
        { id: "divineSanction", icon: "🌟", name: "神聖制裁", description: "攻擊一個目標，造成物理傷害，加上等同聖騎士魅力的魔法傷害。", target: "依武器", hitCheck: "dex-vs-dex", hitMessage: "發出一道聖光，對${target.name}執行制裁，懲罰了他的罪((${result.damage})！", missMessage: "發出一道聖光，但${target.name}僥倖躲過了制裁", damage: ["Math.max(user.str - target.arm","0) + user.cha"], cost: 1 },
        // 刺客,
        { id: "stealth", icon: "🐈‍⬛", name: "隱身", description: "通過一次潛行檢定，敵人將無法看見刺客（範圍攻擊仍會命中），直到刺客發動攻擊。如果此次攻擊殺死目標，刺客將繼續保持隱身。（逃跑必成功）", target: "最高wis", hitCheck: "dex-vs-wis", hitMessage: "隱藏自己的氣息，消失了蹤跡……", missMessage: "試圖躲藏起來，但仍然暴露了", userStatus: "hidden" },
        { id: "sneakAttack", icon: "🗡️", name: "偷襲", description: "在隱身或敵人無防備時，攻擊一個目標，必定命中，爆擊率加倍，前後排皆可。", condition: "user.status.includes(\"hidden\") || situation === 4", target: "任一單體", hitMessage: "無聲無息地偷襲，擊中了${target.name}(${result.damage})！", critRate: "user.crit * 2", damage: "user.str - target.arm" },
        { id: "lure", icon: "🪤", name: "誘捕", description: "通過一次魅力檢定，將一個後排的目標引到前排，進行偷襲。", target: "後排單體", hitCheck: "cha-vs-int", hitMessage: "使手段吸引${target.name}的注意，趁機擊中了他(${result.damage})！", missMessage: "嘗試吸引${target.name}的注意，但他無動於衷", critRate: "user.crit * 2", damage: "user.str - target.arm", targetMove: "往前" },
        // 獵人,
        { id: "mark", icon: "👁️", name: "鷹眼", description: "看穿一個目標的動作，使我方對目標的所有攻擊獲得命中優勢，直到換一個目標。", target: "任一單體", hitCheck: "wis-vs-dex", hitMessage: "以敏銳目光看穿了${target.name}的動向！", missMessage: "眼睛跟不上${target.name}的速度", targetStatus: "marked" },
        { id: "reveal", icon: "🔍", name: "搜索", description: "通過一次偵查檢定，讓隱身的敵人現形。", target: "敵方隱身者", hitCheck: "wis-vs-dex", hitMessage: "搜索隱藏的跡象，發現了${target.name}！", missMessage: "搜索了一番，什麼也沒發現……", targetStatus: "-invisible" },
        { id: "criticalBlast", icon: "🎯", name: "弱點爆破", description: "攻擊一個目標，如果目標已被標記，通過一次偵查檢定，即可造成爆擊。", target: "依武器", hitCheck: "dex-vs-dex", hitMessage: "瞄準${target.name}的弱點，擊中了他(${result.damage})！", missMessage: "瞄準${target.name}，但對方警覺地保護起弱點", critRate: "wis-vs-dex", damage: "user.str - target.arm" },
        // 法師,
        { id: "lightning", icon: "⚡", name: "閃電術", description: "攻擊一個目標，造成等同法師智力的魔法傷害，無法被閃避。目標必須通過一次體質豁免，否則會受到麻痺。", target: "任一單體", hitMessage: "發射一道閃電，瞬間擊中了${target.name}(${result.damage})！", damage: "user.int", statusCheck: "int-vs-con", targetStatus: "paralyzed", cost: 1 },
        { id: "earthquake", icon: "🪨", name: "地震術", description: "與目標同排的生物必須通過一次敏捷豁免，否則會倒地。", target: "任一排", hitMessage: "使${target.name}腳下的地面震動起來！", statusCheck: "int-vs-dex", targetStatus: "prone", cost: 2 },
        { id: "fireball", icon: "☄️", name: "火球術", description: "攻擊與目標同排的生物，造成等同法師智力的魔法傷害，無法被閃避，並附加燃燒。", target: "任一排", hitMessage: "降下一顆巨大而熾熱的火球，落在了${target.name}頭上(${result.damage})！", damage: "user.int", targetStatus: "burning", cost: 2 },
        //【黑暗術】使所有敵人的攻擊承受劣勢。,
        //【狂風術】後排所有敵人必須通過一個體質檢定，否則會被吹到前排，檢定難度取決於法師的智力。,
        // 牧師,
        { id: "heal", icon: "❤️‍🩹", name: "治癒術", description: "治療一個生物，治療量等同牧師的感知，並解除中毒、燃燒、麻痺。", target: "任一單體", hitMessage: "為${target.name}治療了傷勢(${result.damage})", damage: "-user.wis", targetStatus: ["-poisoned","-burning","-paralyzed"], cost: 1 },
        { id: "magicShield", icon: "🛡️", name: "防護術", description: "為一個我方角色創造防護罩，能吸收物理、魔法傷害，防護罩的 HP 等同牧師的感知。", target: "任一單體", hitMessage: "在${target.name}周圍創造了一層防護罩", tempHP: "user.wis", cost: 1 },
        { id: "seal", icon: "🔒", name: "魔力封印", description: "通過一次感知檢定，讓一個施法者一回合無法施法，並吸取 2MP。", target: "任一施法者", hitCheck: "wis-vs-wis", hitMessage: "封印了${target.name}的法術，並從中吸取了魔力(${result.mpAbsorb})！", missMessage: "試圖封印${target.name}的法師，但他的精神太堅定了", mpAbsorb: 2, targetStatus: "sealed" },
        //【聖光術】敵方所有的不死生物受到等同牧師感知的傷害。
    ];

    // 狀態資料庫
    const statusData = [
        // 行動限制,
        { id: "petrified", icon: "🗿", name: "石化", description: "無法行動和閃避，但護甲 +15。", getMessage: "身體變成了石頭！", duration: 1, noAction: true, arm: 15 },
        { id: "paralyzed", icon: "⚡", name: "麻痺", description: "無法行動和閃避。", getMessage: "受到電擊，全身麻痺了！", duration: 1, noAction: true },
        { id: "pinned", icon: "🤚", name: "被壓制", description: "無法行動和閃避。", getMessage: "被壓制了，無法掙脫！", duration: 1, noAction: true },
        { id: "pinning", icon: "🤚", name: "壓制", description: "正在壓制對方，無法閃避。可自行解除。", duration: 1, noAction: true, cancelable : true },
        { id: "sealed", icon: "🔒", name: "封印", description: "無法使用法術。", getMessage: "魔力被封印，無法施放法術了！", duration: 1, noMagic: true },
        { id: "disarmed", icon: "🫴", name: "武器掉落", description: "只能空手戰鬥，或花費一回合撿回武器。", getMessage: "武器掉在手搆不到的地方了！", noWeapon: true, removable: true },
        // 目標限制,
        { id: "hidden", icon: "🐈‍⬛", name: "隱身", description: "對手看不到此角色。", untargetable: true, cancelable : true },
        { id: "flying", icon: "🪽", name: "飛行", description: "飛上天，迴避所有近戰攻擊。", duration: 1, flying: true, cancelable : true },
        // 增益,
        { id: "berserk", icon: "🌋", name: "狂暴", description: "攻擊獲得命中優勢，HP 每損失 1 點，爆擊率就提高 1%。", duration: 3, critRate: "user.crit + user.MaxHP - user.HP", hitGain: true },
        { id: "guarded", icon: "🛡️", name: "被守護", description: "不會受到來自外部的傷害。", duration: 1, invincible: true },
        // 減益,
        { id: "prone", icon: "💫", name: "倒地", description: "敏捷 -5，可花費一回合站起來。", getMessage: "摔倒在地了！", dex: -5, removable: true },
        { id: "marked", icon: "👁️", name: "被盯上", description: "所有針對此角色的攻擊獲得命中優勢。", dodgeSuffer: true },
        { id: "guarding", icon: "🛡️", name: "守護", description: "代替被守護者承受傷害，且承受閃避劣勢。", duration: 1, dodgeSuffer: true, substitute: true },
        { id: "blinded", icon: "🕶", name: "目盲", description: "感知 -5，敏捷 -5", getMessage: "眼前一片黑暗！", duration: 1, dex: -5, wis: -5 },
        // 持續傷害,
        { id: "bleeding", icon: "🩸", name: "流血", description: "每回合受到 3 傷害，可用繃帶止血。", getMessage: "傷口流血了！", duration: 3, damage: 3 },
        { id: "burning", icon: "🔥", name: "燃燒", description: "每回合受到 6 傷害，可用水澆熄。", getMessage: "身上著火了！", duration: 2, damage: 6 },
        { id: "poisoned", icon: "🤢", name: "中毒", description: "力量 -1，敏捷 -1，此外每回合受到 1 傷害，可用解毒劑解除。", getMessage: "中毒了！身體感到虛弱……", duration: 10, damage: 1, str: -1, dex: -1 }
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
        str: { name: "⚔️ 力量" },
        dex: { name: "🏃 敏捷" },
        int: { name: "🧠 智力" },
        wis: { name: "👁️ 感知" },
        cha: { name: "✨ 魅力" },
        arm: { name: "🛡️ 護甲" },
    };

// 隊伍相關

    // 傭兵資料庫
    const mercenaries = [
        { name: "雷納德", type: "傭兵", classId: "paladin", description: "老練的冒險者，穿著全套盔甲，飽經風霜的臉龐洋溢著溫暖的微笑。", cost: 0, con: 16, str: 15, dex: 13, int: 10, wis: 12, cha: 14, weaponId: "npcWeapon01", armorId: "npcArmor01" },
        { name: "塔爾穆克", type: "傭兵", classId: "warrior", description: "身材魁武的獸人狂戰士，背著一把巨大的戰斧，眼神充滿怒火。", cost: 150, con: 18, str: 18, dex: 12, int: 8, wis: 10, cha: 8, weaponId: "npcWeapon02", armorId: "npcArmor02" },
        { name: "賽恩", type: "傭兵", classId: "rogue", description: "蒙面的刺客，整張臉隱藏在面罩下，沉默寡言，散發著一絲危險氣息。", cost: 120, con: 12, str: 13, dex: 17, int: 10, wis: 14, cha: 10, weaponId: "npcWeapon03", armorId: "npcArmor03" },
        { name: "艾德蒙", type: "傭兵", classId: "hunter", description: "看起來像個小混混，不太正經，喜歡自吹自擂，給人感覺不怎麼可靠。", cost: 100, con: 8, str: 14, dex: 14, int: 10, wis: 16, cha: 12, weaponId: "", armorId: "npcArmor04" },
        { name: "諾伊爾", type: "傭兵", classId: "wizard", description: "初出茅廬的高等精靈少年，一臉純真，比起協助你，他看起來更需要協助。", cost: 90, con: 8, str: 8, dex: 12, int: 16, wis: 12, cha: 16, weaponId: "", armorId: "npcArmor05" }
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

            // 根據技能所需的 MP，決定 MP 上限
            let totalMP = 0;
            const skillIds = classData.find(cla => cla.id === companion.classId).skills;
            skillIds.forEach(skillId => {
                const skill = skillData.find(s => s.id === skillId); // 找到技能資料
                if (skill.cost > 0) totalMP += 2; // 每個法術給 2MP ，一環法術可用 2 次，二環法術可用 1 次
            });

            // 添加同伴資料並設定初始的HP和MaxHP
            teamMembers.push({
                name: companionName, // 加入處理後的名字
                id: companionId,  // 自動產生 id
                type: companionType || companion.type,
                classId: companion.classId,
                str: { basic: companion.str, },
                dex: { basic: companion.dex, },
                con: { basic: companion.con, },
                int: { basic: companion.int, },
                wis: { basic: companion.wis, },
                cha: { basic: companion.cha, },
                arm: { basic: 0 },
                MaxHP: companion.con * 3, // MaxHP
                HP: companion.con * 3, // 初始 HP
                MaxMP: totalMP,
                MP: totalMP,
                critRate: 5, // 爆擊率 5%
                status: [],
                emotion: [],
                mood: 0,
                weapon: {},
                armor: {}, 
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
        // 穿刺、遠程武器價格 = (str-3) * 10,
        // 鈍擊武器價格 = (str-3) * 10 + 5,
        // 揮砍武器架格 = (str-5) * 10 + 5,
        // 盔甲價格 = arm * 10,
        // 服裝價格 = cha * 15,
        // 武器,
        // 商店貨,
        { type: "weapon", id: "dagger01", name: "🗡️ 匕首", category: "穿刺", str: 4, addStatus: "流血", addChance: 0.3, price: 10, shop: "blacksmith", description: "適合隨身攜帶的短劍。" },
        { type: "weapon", id: "spear01", name: "🗡️ 長矛", category: "穿刺", str: 8, needStr: 12, addStatus: "流血", addChance: 0.6, price: 50, shop: "blacksmith", description: "用來刺擊的長柄武器。" },
        { type: "weapon", id: "hammer01", name: "🔨 釘頭錘", category: "鈍擊", str: 6, addStatus: "倒地", addChance: 0.15, price: 35, shop: "blacksmith", description: "單手捶打用的鈍器。" },
        { type: "weapon", id: "hammer02", name: "🔨 戰錘", category: "鈍擊", str: 10, needStr: 16, addStatus: "倒地", addChance: 0.3, price: 75, shop: "blacksmith", description: "給予沉重打擊的長柄武器。" },
        { type: "weapon", id: "sword01", name: "🗡️ 單手劍", category: "揮砍", str: 8, price: 35, shop: "blacksmith", description: "戰士的標準配備。" },
        { type: "weapon", id: "sword02", name: "🗡️ 巨劍", category: "揮砍", str: 12, needStr: 14, price: 75, shop: "blacksmith", description: "雙手持握的大型劍。" },
        { type: "weapon", id: "axe01", name: "🪓 戰斧", category: "揮砍", str: 14, needStr: 16, price: 95, shop: "blacksmith", description: "殺傷力驚人的長柄武器。" },
        { type: "weapon", id: "bow01", name: "🏹 短弓", category: "遠程", str: 6, price: 30, shop: "blacksmith", description: "能瞄準地面與空中的敵人。" },
        //{ type: "weapon", category: "穿刺", id: "arrow01", name: "➶ 箭矢", str: 1, dex: 0, description: "射擊用的箭矢，緊急時可以拿來防身。", price: 1, shop: "blacksmith" },,
        { type: "weapon", id: "sheild01", name: "🛡️ 圓木盾", category: "鈍擊", str: 4, arm: 2, addStatus: "倒地", addChance: 0.15, price: 35, shop: "blacksmith", description: "輕型盾牌，能保護自身也能當鈍器使用。" },
        // 戰利品,
        { type: "weapon", id: "stick01", name: "🔨 小棍棒", category: "鈍擊", str: 1, price: 0, description: "只是一根普通的樹枝。" },
        { type: "weapon", id: "stick02", name: "🔨 巨大的狼牙棒", category: "鈍擊", str: 20, needStr: 20, addStatus: "倒地", addChance: 0.5, price: 10, description: "將樹幹和獸骨綁起來。" },
        { type: "weapon", id: "sword03", name: "🗡️ 迷你刺劍", category: "穿刺", str: 2, addStatus: "流血", addChance: 0.1, price: 5, description: "看起來像玩具，但真的能傷人。" },
        { type: "weapon", id: "stone", name: "🪨 尖銳的石頭", category: "鈍擊", str: 1, price: 0, description: "可以藏在衣服裡。" },
        // NPC專屬,
        { type: "weapon", id: "npcWeapon01", name: "🗡️ 雷納德的巨劍", category: "揮砍", str: 13, needStr: 12, owner: "雷納德", description: "雙手持握的大型長劍。" },
        { type: "weapon", id: "npcWeapon02", name: "🪓 塔爾穆克的戰斧", category: "揮砍", str: 15, needStr: 14, owner: "塔爾穆克", description: "殺傷力驚人的長柄斧。" },
        { type: "weapon", id: "npcWeapon03", name: "🗡️ 賽恩的匕首", category: "穿刺", str: 5, addStatus: "流血", addChance: 0.5, owner: "賽恩", description: "適合隨身攜帶的短劍。" },
        { type: "weapon", id: "npcWeapon04", name: "🗡️ 艾德蒙的劍", category: "揮砍", str: 10, owner: "艾德蒙", description: "戰士的標準配備。" },
        { type: "weapon", id: "npcWeapon05", name: "🏹 諾伊爾的短弓", category: "遠程", str: 10, owner: "諾伊爾", description: "能瞄準地面與空中的敵人。" },
        // 盔甲,
        // 商店貨,
        { type: "armor", id: "armor01", name: "🛡️ 皮甲", arm: 2, price: 20, shop: "blacksmith", description: "活動性佳的輕型盔甲。" },
        { type: "armor", id: "armor02", name: "🛡️ 鱗甲", arm: 4, price: 40, shop: "blacksmith", description: "以皮革和鐵片製成的鎧甲。" },
        { type: "armor", id: "armor03", name: "🛡️ 鐵製胸甲", arm: 6, price: 60, shop: "blacksmith", description: "包覆軀幹的堅固胸甲。" },
        { type: "armor", id: "armor04", name: "🛡️ 鎖子甲", arm: 8, needStr: 12, price: 80, shop: "blacksmith", description: "以鐵環相扣製成的鎧甲。" },
        { type: "armor", id: "armor05", name: "🛡️ 全身板甲", arm: 10, needStr: 14, price: 100, shop: "blacksmith", description: "完整保護全身的重型盔甲。" },
        // NPC專屬,
        { type: "armor", id: "npcArmor01", name: "🛡️ 雷納德的板甲", arm: 10, needStr: 14, owner: "雷納德", description: "完整保護全身的重型盔甲。" },
        { type: "armor", id: "npcArmor02", name: "🛡️ 塔爾穆克的胸甲", arm: 6, owner: "塔爾穆克", description: "包覆軀幹的堅固胸甲。" },
        { type: "armor", id: "npcArmor03", name: "🛡️ 賽恩的皮甲", arm: 2, owner: "賽恩", description: "活動性佳的輕型盔甲。" },
        { type: "armor", id: "npcArmor04", name: "🛡️ 艾德蒙的鱗甲", arm: 4, owner: "艾德蒙", description: "以皮革和鐵片製成的鎧甲。" },
        { type: "armor", id: "npcArmor05", name: "🛡️ 諾伊爾的皮甲", arm: 2, owner: "諾伊爾", description: "活動性佳的輕型盔甲。" },
        // 服裝（也算盔甲，只是在服飾店販售）,
        // 商店貨,
        { type: "armor", id: "fineClothes01", name: "🧥 別緻休閒服", cha: 2, price: 30, shop: "clothes", description: "低調奢華的襯衫背心。選用細緻的布料，提供極佳的舒適度。多條皮帶巧妙點綴，勾勒出身材線條，讓人既自在又不失魅力。" },
        { type: "armor", id: "fineClothes02", name: "🧥 傳說勇者套裝", arm: 2, cha: 3, price: 65, shop: "clothes", description: "以堅固的皮革縫製，兼具美觀與實用性。帥氣的披風隨風飄揚，宛如傳說中的勇者。無論走在街上或身處戰場，都能讓你在人群中脫穎而出。" },
        { type: "armor", id: "fineClothes03", name: "🧥 優雅貴族正裝", cha: 6, dex: -1, price: 90, shop: "clothes", description: "奢華天鵝絨外套搭配蕾絲內襯，剪裁合身，襯托出尊爵不凡的氣質，使你舉手投足間散發領袖魅力，你的發言將會具有令人無法抗拒的說服力。但緊身設計稍嫌束縛。" },
        { type: "armor", id: "fineClothes04", name: "🧥 皇家儀式禮服", cha: 8, dex: -2, price: 120, shop: "clothes", description: "由上等絲綢與金線刺繡製成，以璀璨珠寶點綴，象徵尊貴與權勢，無論在哪個場合都能成為萬眾矚目的焦點。穿上後必須保持儀態端莊，無法隨意活動。" },
        // 戰利品,
        { type: "armor", id: "clothes01", name: "🧥 布衣", price: 1, description: "以廉價布料製成的衣服，從一般平民到奴隸都會穿。" },
        { type: "armor", id: "clothes02", name: "🧥 工作服", price: 2, description: "有很多口袋的吊帶褲與襯衫。" },
        { type: "armor", id: "clothes03", name: "🧥 旅行服", price: 2, description: "耐磨、耐髒，適合長途旅行穿著。" },
        { type: "armor", id: "lootClothes01", name: "🧥 獸皮背心", price: 0, description: "粗糙縫合的獸皮，只能勉強遮蔽身體。" },
        { type: "armor", id: "lootClothes02", name: "🧥 巨大的腰布", cha: -1, price: 0, description: "如果不排斥臭味，可以披在身上當斗篷。" },
        { type: "armor", id: "lootClothes03", name: "🧥 破爛衣服", price: 0, description: "已經破爛到無法稱為衣服，只是一串碎布。" },
        { type: "armor", id: "lootClothes04", name: "🧥 迷你披風", price: 1, description: "看起來像洋娃娃的配件，也可以拿來當領巾。" },
        // 補給品,
        { type: "supply", id: "healPotion01", name: "🫙 治療藥水", heal: 10, usable: true, consumable: true, price: 5, shop: "grocery", description: "立即恢復生命值。" },
        { type: "supply", id: "healPotion02", name: "🫙 中級治療藥水", heal: 20, usable: true, consumable: true, price: 10, shop: "grocery", description: "立即恢復生命值。" },
        { type: "supply", id: "healPotion03", name: "🫙 高級治療藥水", heal: 30, usable: true, consumable: true, price: 15, shop: "grocery", description: "立即恢復生命值。" },
        { type: "supply", id: "bandage", name: "💰 繃帶", removeStatus: "流血", usable: true, consumable: true, price: 1, shop: "grocery", description: "能止住一處流血的傷口。" },
        { type: "supply", id: "antidote", name: "💰 解毒藥", removeStatus: "中毒", usable: true, consumable: true, price: 1, shop: "grocery", description: "能解除一層中毒。" },
        { type: "supply", id: "water", name: "🫙 水", removeStatus: "燃燒", usable: true, consumable: true, price: 1, shop: "grocery", description: "一瓶乾淨的水。" },
        //{ type: "supply", id: "cookingTool", name: "🫕 野炊工具", usable: true, shop: "grocery", description: "只要有柴火和食材，就能隨時隨地烹飪食物。" },
        //{ type: "supply", id: "tent", name: "⛺ 帳篷", usable: true, shop: "grocery", description: "能搭建簡便的營地，但在野外過夜有一定的危險。" },
        { type: "supply", id: "bloodWine", name: "🍾 血葡萄酒", heal: 5, usable: true, consumable: true, price: 15, description: "以生長在地底的血葡萄釀成的酒，味道像人血，是吸血鬼喜愛的飲品。" },
        // 食物,
        { type: "food", id: "potato", name: "🥔 馬鈴薯", heal: 10, price: 1, shop: "grocery", description: "農田收成的馬鈴薯，烹飪後可以食用。" },
        { type: "food", id: "fish", name: "🐟 鮮魚", heal: 20, price: 2, shop: "grocery", description: "新鮮捕撈的魚，烹飪後可以食用。" },
        { type: "food", id: "meat", name: "🥩 生肉", heal: 30, price: 3, shop: "grocery", description: "打獵取得的肉，烹飪後可以食用。" },
        { type: "food", id: "tentacleLoot", name: "🥓 觸手肉", heal: 40, price: 4, description: "長滿吸盤的滑溜觸手，死後仍會扭動，烹飪後可以食用。" },
        { type: "food", id: "spiderLoot", name: "🕷️ 蜘蛛肉", heal: 50, price: 5, description: "堅韌的肉，有微弱毒素，摸過之後手會發癢，烹飪後可以食用。" },
        // 料理,
        { type: "meal", id: "meal01", name: "🍺 啤酒", heal: 10, price: 1, shop: "tavern", description: "最受旅人與戰士歡迎的經典佳釀。" },
        { type: "meal", id: "meal02", name: "🥧 莓果派", heal: 10, price: 1, shop: "tavern", description: "內餡包滿了新鮮野莓的甜派，酸甜可口。" },
        { type: "meal", id: "meal03", name: "🥘 奶油蘑菇湯", heal: 20, price: 2, shop: "tavern", description: "濃郁奶油加入蘑菇、洋蔥與數種鮮蔬熬煮，溫暖順口，最適合寒冷夜晚享用。" },
        { type: "meal", id: "meal04", name: "🍲 麵包配燉肉湯", heal: 20, price: 2, shop: "tavern", description: "將肉塊與馬鈴薯、紅蘿蔔燉煮數小時，肉質入口即化，搭配現烤麵包更是絕配。" },
        { type: "meal", id: "meal05", name: "🍖 嫩煎羊肋排", heal: 30, price: 3, shop: "tavern", description: "將羊肋排以秘製醬汁醃製後，煎至表面焦脆，內部鮮嫩多汁，最適合配上一杯啤酒。" },
        { type: "meal", id: "meal06", name: "🍗 香草烤野雞", heal: 30, price: 3, shop: "tavern", description: "豪邁地將整隻野雞裹上迷迭香與辛香料，慢火炭烤至外皮金黃香酥，肉汁橫流，香氣四溢。" },
        // 戰利品,
        { type: "loot", id: "wormLoot", name: "💰 蠕蟲", heal: 1, usable: true, consumable: true, price: 0, description: "富含營養，但味道噁心，吃了會一整天不舒服。" },
        { type: "loot", id: "slimeLoot", name: "💰 黏液", price: 1, description: "史萊姆的黏液。" },
        { type: "loot", id: "fairyDust", name: "💰 仙塵", price: 1, description: "仙子的魔法粉末，通常會邊飛邊灑落。" },
        { type: "loot", id: "batLoot", name: "💰 蝙蝠翅膀", price: 1, description: "蝙蝠的翅膀。" },
        { type: "loot", id: "vineLoot", name: "💰 植物莖", price: 3, description: "切下來的藤蔓。" },
        { type: "loot", id: "mushroomLoot", name: "💰 毒蘑菇", price: 2, description: "不可食用的蘑菇。" },
        { type: "loot", id: "manEaterSeed", name: "🫘 食人花種子", price: 0, description: "蘊藏著蠢蠢欲動的生命，商人不願意買，但有人在公會高價收購。" },
        { type: "loot", id: "rottenMeat", name: "💰 腐肉", price: 0, description: "已經腐爛的肉塊。" },
        { type: "loot", id: "fur", name: "💰 毛皮", price: 3, description: "動物的毛皮。" },
        { type: "loot", id: "lizardLoot", name: "💰 蜥蜴皮", price: 2, description: "火蜥蜴的硬皮。" },
        { type: "loot", id: "tusk", name: "💰 獠牙", price: 4, description: "野豬的獠牙。" },
        { type: "loot", id: "silk", name: "💰 蜘蛛絲", price: 5, description: "巨型蜘蛛的絲線。" },
        { type: "loot", id: "gargoyleLoot", name: "💰 水晶眼珠", price: 10, description: "石像鬼的眼珠。" },
        //{ type: "loot", id: "gargoyleLoot", name: "💰 石塊", description: "石像鬼死後化成了碎石。", price: 1 },,
        { type: "loot", id: "eagleLoot", name: "💰 堅硬羽毛", price: 2, description: "巨鷹的羽毛。" },
        { type: "loot", id: "dragonLoot", name: "💰 龍鱗", price: 30, description: "龍的鱗片。" },
        { type: "loot", id: "wood", name: "🪵 木頭", price: 0, description: "可當作柴火。" },
        { type: "loot", id: "treantLoot", name: "💰 樹妖皮", price: 6, description: "樹妖掉落的樹皮。" },
        { type: "loot", id: "cloth", name: "💰 布料", price: 0, description: "拆解衣物得到的碎布。" },
        { type: "loot", id: "ghostLoot", name: "💰 幽靈物質", price: 15 },
        { type: "loot", id: "ironＷire", name: "📎 鐵絲", price: 0, description: "可以用來撬鎖。" },
        { type: "loot", id: "MarcusRing", name: "💍 馬卡斯的戒指", price: 200, description: "從馬卡斯手上取下的金戒指，看起來很名貴。" },
        // 任務物品,
        { type: "specialItem", id: "package01", name: "📦 包裹", price: 20, description: "要送到晨曦鎮的包裹。" },
        { type: "specialItem", id: "package01_damaged", name: "📦 破損包裹", price: 0, description: "要送到晨曦鎮的包裹，被之前遇到的敵人破壞了。" },
        { type: "specialItem", id: "package02", name: "📦 包裹", price: 20, description: "要送到鐵石鎮的包裹。" },
        { type: "specialItem", id: "package02_damaged", name: "📦 破損包裹", price: 0, description: "要送到鐵石鎮的包裹，被之前遇到的敵人破壞了。" },
        { type: "specialItem", id: "weaponPack", name: "📦 包好的武器", usable: true, consumable: true, price: 0, description: "向哥布林商人買來的，不知道裡面裝著什麼。" },
        { type: "specialItem", id: "armorPack", name: "📦 包好的盔甲", usable: true, consumable: true, price: 0, description: "向哥布林商人買來的，不知道裡面裝著什麼。" },
        { type: "specialItem", id: "devilGem01", name: "♦️ 紅寶石", investigable: true, price: 666, description: "當你盯著這顆紅寶石時，一個聲音在你腦中響起，要你把它拿近一點。" },
        { type: "specialItem", id: "devilGem02", name: "♦️ 紅寶石", usable: true, investigable: true, price: 666, description: "封印著惡魔的紅寶石。" },
        { type: "specialItem", id: "specialItem15", name: "💰 沾到綠血的玻璃", price: 0, description: "這塊玻璃碎片沾了哥布林的血，讓吸血鬼覺得臭氣熏天。" },
        { type: "specialItem", id: "specialItem16", name: "💰 幽靈菇", price: 0, description: "吃下後不知道會變成怎麼樣的毒菇。" },
        { type: "specialItem", id: "key01", name: "🗝️ 牢房鑰匙", price: 50, description: "可以打開監獄裡任何一間牢房。" },
        { type: "specialItem", id: "key02", name: "🗝️ 鐵鑰匙", price: 0, description: "堅固的鐵製鑰匙。" },
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
                status = statusData.find(s => s.name === item.addStatus);
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
            } else if (item.price) { // 顯示價格
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
                <p class="small note">
                    ${item.description}
                    ${item.needStr ? `<br><span class="warn">需要力量 ${item.needStr}，否則會承受敏捷減值。</span>` : ""}
                </p>
                <p>
                    ${item.str ? `<span class="small">⚔️ 力量</span> ${(item.str > 0 ? `+${item.str}<br>` : item.str)}` : ""}
                    ${item.cha ? `<span class="small">✨ 魅力</span> ${(item.cha > 0 ? `+${item.cha}<br>` : item.cha)}` : ""}
                    ${item.arm ? `<span class="small">🛡️ 護甲</span> ${(item.arm > 0 ? `+${item.arm}<br>` : item.arm)}` : ""}
                    ${item.dex && !item.needStr ? `<span class="small">🏃 敏捷</span> ${(item.dex > 0 ? `+${item.dex}` : item.dex)}<br>` : ""}
                    ${item.heal ? `<span class="small">❤️‍🩹 恢復 HP</span> ${item.heal}` : ""}
                </p>
                <p  class="small note">
                    ${item.addStatus ? `${status.icon} ${item.addChance*100}% 機率造成【${item.addStatus}】，目標${status.description}` : ""}
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
        member.dex[itemType] = item.dex || 0;

        // 檢查力量是否足夠，每少 1 力量就承受 -1 敏捷減值
        if (member.str.basic < item.needStr) {
            member.dex[itemType] -= item.needStr - member.str.basic;
        }

        // 加總屬性
        ["str", "dex", "con", "int" , "wis", "cha", "arm"].forEach(attr => {
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
        if (member.id === "player") {
            localStorage.setItem("playerWeapon", JSON.stringify(member.weapon));
            localStorage.setItem("playerArmor", JSON.stringify(member.armor));
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
