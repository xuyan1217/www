class TreasureMap {
    static getInitialClue() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve("在古老的图书馆里找到了第一个线索...");
            }, 1000);
        });
    }
    
    static decodeAncientScript(clue) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (!clue) {
                    reject("没有线索可以解码!");
                }
                resolve("解码成功!宝藏在一座古老的神庙中...");
            }, 300);
        });
    }
    
    static searchTemple(location) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const random = Math.random();
                if (random < 0.5) {
                    reject("糟糕!遇到了神庙守卫!");
                }
                resolve("找到了一个神秘的箱子...");
            }, 2000);
        });
    }
    
    static openTreasureBox() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve("恭喜!你找到了传说中的宝藏!");
            }, 1000);
        });
    }
}

class GameManager {
    constructor() {
        this.currentScene = 'login';
        this.playerData = null;
        this.sceneData = null;
        this.bgMusic = document.getElementById('bgMusic');
        this.isMusicPlaying = false;
        this.gameState = {
            hasFailed: false,
            lastScene: 'login'  // 记录最后访问的场景
        };
        this.initializeGame();
    }

    async initializeGame() {
        try {
            await this.loadSceneData();
            this.loadGameState();  // 加载游戏状态
            this.setupEventListeners();
            this.checkExistingPlayer();
            console.log('游戏初始化完成');
        } catch (error) {
            console.error('游戏初始化失败:', error);
        }
    }

    // 保存游戏状态
    saveGameState() {
        localStorage.setItem('gameState', JSON.stringify(this.gameState));
    }

    // 加载游戏状态
    loadGameState() {
        const savedState = localStorage.getItem('gameState');
        if (savedState) {
            this.gameState = JSON.parse(savedState);
        }
    }

    setupEventListeners() {
        // 登录表单提交
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // 开始游戏按钮
        const startButton = document.getElementById('startGameButton');
        if (startButton) {
            startButton.addEventListener('click', () => {
                this.showScene('library');
                this.updateGameHistory('开始游戏');
            });
        }

        // 卷轴点击事件
        const scroll = document.querySelector('.scroll');
        if (scroll) {
            scroll.addEventListener('click', () => this.handleScrollClick());
        }

        // 继续探索按钮
        const continueButton = document.getElementById('continueButton');
        if (continueButton) {
            continueButton.addEventListener('click', () => {
                const templeMessage = document.getElementById('templeResult');
                if (templeMessage) {
                    templeMessage.style.opacity = '0';  // 清除之前的消息
                }
                this.handleTempleExploration();
            });
        }

        // 登出按钮
        const logoutButton = document.getElementById('logoutButton');
        if (logoutButton) {
            logoutButton.addEventListener('click', () => this.logout());
        }

        // 重试按钮（在守卫页面）
        const tryAgainButton = document.getElementById('tryAgainButton');
        if (tryAgainButton) {
            tryAgainButton.addEventListener('click', () => {
                this.gameState.hasFailed = false;
                this.saveGameState();
                this.showScene('welcome');
                this.updateGameHistory('重新开始游戏');
                
                // 重置继续探索按钮
                const continueButton = document.getElementById('continueButton');
                if (continueButton) {
                    continueButton.style.display = 'block';
                }
            });
        }

        // 重新开始按钮（在宝藏页面）
        const restartButton = document.getElementById('restartButton');
        if (restartButton) {
            restartButton.addEventListener('click', () => {
                this.gameState.hasFailed = false;
                this.saveGameState();
                this.showScene('welcome');
                this.updateGameHistory('重新开始游戏');
                
                // 重置继续探索按钮
                const continueButton = document.getElementById('continueButton');
                if (continueButton) {
                    continueButton.style.display = 'block';
                }
            });
        }

        // 图书馆场景点击事件
        const libraryScene = document.getElementById('library');
        if (libraryScene) {
            libraryScene.addEventListener('click', (e) => {
                // 如果点击的不是卷轴
                if (!e.target.classList.contains('scroll')) {
                    const message = document.getElementById('libraryMessage');
                    if (message) {
                        message.textContent = "没有线索可以解码!";
                        message.style.opacity = '1';
                        
                        // 2秒后消失
                        setTimeout(() => {
                            message.style.opacity = '0';
                        }, 2000);
                    }
                }
            });
        }
    }

    handleLogin() {
        const playerId = document.getElementById('playerId').value.trim();
        const nickname = document.getElementById('nickname').value.trim();

        if (!playerId || !nickname) {
            alert('请输入玩家ID和昵称！');
            return;
        }

        // 检查是否已存在相同ID的玩家数据
        const existingData = localStorage.getItem('playerData');
        if (existingData) {
            const existingPlayer = JSON.parse(existingData);
            if (existingPlayer.id === playerId) {
                // 如果ID相同，恢复历史记录
                this.playerData = existingPlayer;
            } else {
                // 如果ID不同，创建新记录
                this.playerData = {
                    id: playerId,
                    nickname: nickname,
                    history: [],
                    lastLogin: new Date().toISOString()
                };
            }
        } else {
            // 新玩家
            this.playerData = {
                id: playerId,
                nickname: nickname,
                history: [],
                lastLogin: new Date().toISOString()
            };
        }

        // 重置游戏状态
        this.gameState = { 
            hasFailed: false,
            lastScene: 'welcome'
        };
        this.saveGameState();
        
        localStorage.setItem('playerData', JSON.stringify(this.playerData));
        this.updatePlayerDisplay();
        this.updateGameHistory('登录游戏');
        this.showScene('welcome');
    }

    checkExistingPlayer() {
        const savedData = localStorage.getItem('playerData');
        if (savedData) {
            try {
                this.playerData = JSON.parse(savedData);
                this.updatePlayerDisplay();
                // 恢复到最后访问的场景
                this.showScene(this.gameState.lastScene || 'welcome');
                this.loadGameHistory();
                console.log('恢复玩家数据:', this.playerData);
            } catch (error) {
                console.error('读取玩家数据失败:', error);
                this.showScene('login');
            }
        } else {
            this.showScene('login');
        }
    }

    showScene(sceneId) {
        console.log('切换场景到:', sceneId);
        const scenes = document.querySelectorAll('.scene');
        scenes.forEach(scene => {
            scene.style.display = 'none';
        });

        const targetScene = document.getElementById(sceneId);
        if (targetScene) {
            targetScene.style.display = 'flex';
            targetScene.classList.add('fade-in');
            this.currentScene = sceneId;
            // 保存最后访问的场景
            this.gameState.lastScene = sceneId;
            this.saveGameState();
            this.updateSceneContent(sceneId);

            // 根据场景控制按钮显示
            const continueButton = document.getElementById('continueButton');
            if (continueButton) {
                continueButton.style.display = 
                    (sceneId === 'temple') ? 'block' : 'none';
            }
        }
    }

    updateSceneContent(sceneId) {
        const sceneData = this.sceneData.get(sceneId);
        if (!sceneData) {
            console.log('未找到场景数据:', sceneId);
            return;
        }

        const scene = document.getElementById(sceneId);
        if (!scene) {
            console.log('未找到场景元素:', sceneId);
            return;
        }

        const title = scene.querySelector('.scene-title');
        const mainDesc = scene.querySelector('.main-desc');
        const subDesc = scene.querySelector('.sub-desc');

        if (title) title.textContent = sceneData.title;
        if (mainDesc) mainDesc.textContent = sceneData.mainDescription;
        if (subDesc) subDesc.textContent = sceneData.subDescription;
    }

    async loadSceneData() {
        try {
            const response = await fetch('data/scenes.txt');
            if (!response.ok) {
                throw new Error('无法加载场景数据');
            }
            const text = await response.text();
            this.sceneData = new Map();
            
            text.split('\n').forEach(line => {
                if (line.trim()) {
                    const [id, title, mainDesc, subDesc] = line.split('|');
                    if (id && title && mainDesc && subDesc) {
                        this.sceneData.set(id.trim(), {
                            title: title.trim(),
                            mainDescription: mainDesc.trim(),
                            subDescription: subDesc.trim()
                        });
                    }
                }
            });
            console.log('场景数据加载成功:', this.sceneData);
        } catch (error) {
            console.error('加载场景数据失败:', error);
            alert('加载游戏数据失败，请刷新页面重试');
        }
    }

    updateGameHistory(action) {
        if (this.playerData) {
            const historyEntry = {
                timestamp: new Date().toISOString(),
                action: action,
                scene: this.currentScene,
                hasFailed: this.gameState.hasFailed
            };
            this.playerData.history.push(historyEntry);
            localStorage.setItem('playerData', JSON.stringify(this.playerData));
            this.loadGameHistory();
        }
    }

    loadGameHistory() {
        const historyContainer = document.getElementById('historyContainer');
        if (historyContainer && this.playerData && this.playerData.history) {
            const historyList = document.createElement('div');
            historyList.className = 'history-list';
            
            // 按时间倒序排列历史记录
            const sortedHistory = [...this.playerData.history].reverse();
            
            sortedHistory.forEach(entry => {
                const historyItem = document.createElement('div');
                historyItem.className = 'history-item';
                const date = new Date(entry.timestamp).toLocaleString();
                let status = entry.hasFailed ? ' [已失败]' : '';
                historyItem.textContent = `${date}: ${entry.action}${status}`;
                
                // 为不同类型的事件添加不同的样式
                if (entry.action.includes('失败') || entry.action.includes('被守卫发现')) {
                    historyItem.classList.add('failed-event');
                } else if (entry.action.includes('发现宝箱') || entry.action.includes('获得宝藏')) {
                    historyItem.classList.add('success-event');
                }
                
                historyList.appendChild(historyItem);
            });

            historyContainer.innerHTML = `
                <h3>游戏历史记录</h3>
                <div class="player-info-history">
                    <p>玩家ID: ${this.playerData.id}</p>
                    <p>昵称: ${this.playerData.nickname}</p>
                </div>
            `;
            historyContainer.appendChild(historyList);
        }
    }

    updatePlayerDisplay() {
        if (!this.playerData) return;

        const displayPlayerId = document.getElementById('displayPlayerId');
        const displayNickname = document.getElementById('displayNickname');
        
        if (displayPlayerId) displayPlayerId.textContent = this.playerData.id;
        if (displayNickname) displayNickname.textContent = this.playerData.nickname;
    }

    logout() {
        // 清除当前用户数据，但保留历史记录在 localStorage 中
        const currentPlayerId = this.playerData?.id;
        
        // 重置当前游戏状态
        this.playerData = null;
        this.gameState = {
            hasFailed: false,
            lastScene: 'login'
        };
        
        // 保存游戏状态
        this.saveGameState();
        
        // 清除历史记录显示
        const historyContainer = document.getElementById('historyContainer');
        if (historyContainer) {
            historyContainer.innerHTML = '<h3>游戏历史记录</h3>';
        }
        
        // 清空登录表单
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.reset();
        }

        // 清除玩家显示信息
        const displayPlayerId = document.getElementById('displayPlayerId');
        const displayNickname = document.getElementById('displayNickname');
        if (displayPlayerId) displayPlayerId.textContent = '';
        if (displayNickname) displayNickname.textContent = '';
        
        // 返回登录页面
        this.showScene('login');
        
        console.log('用户已登出');
    }

    async handleScrollClick() {
        const message = document.getElementById('libraryMessage');
        if (!message) return;

        try {
            // 显示第一个线索
            message.textContent = "在古老的图书馆里找到了第一个线索...";
            message.style.opacity = '1';
            await new Promise(resolve => setTimeout(resolve, 2000));

            // 显示解码结果
            message.textContent = "解码成功!宝藏在一座古老的神庙中...";
            this.updateGameHistory('发现线索');
            
            // 等待一段时间后切换到神庙场景
            await new Promise(resolve => setTimeout(resolve, 2000));
            this.showScene('temple');
            this.updateGameHistory('前往神庙');
        } catch (error) {
            console.error('处理卷轴点击失败:', error);
            message.textContent = "出现了一些问题...";
        }
    }

    async handleTempleExploration() {
        const message = document.getElementById('templeResult');
        if (!message) return;

        try {
            message.textContent = "小心翼翼地探索神庙...";
            message.style.opacity = '1';
            await new Promise(resolve => setTimeout(resolve, 2000));

            // 禁用继续探索按钮，防止重复点击
            const continueButton = document.getElementById('continueButton');
            if (continueButton) {
                continueButton.style.display = 'none';
            }

            const randomValue = Math.random();
            
            if (randomValue < 0.5) {  // 50% 概率找到宝藏
                message.textContent = "发现了一个神秘的箱子...";
                await new Promise(resolve => setTimeout(resolve, 1500));
                this.updateGameHistory('发现宝箱');
                this.showScene('treasure');
                
                const treasureMessage = document.getElementById('treasureMessage');
                if (treasureMessage) {
                    treasureMessage.textContent = "恭喜你找到了传说中的宝藏！";
                    treasureMessage.style.opacity = '1';
                }

                // 显示重新开始按钮
                const restartButton = document.getElementById('restartButton');
                if (restartButton) {
                    restartButton.style.display = 'block';
                }
            } else {  // 50% 概率被守卫发现
                message.textContent = "听到了脚步声...";
                await new Promise(resolve => setTimeout(resolve, 1500));
                message.textContent = "糟糕，被守卫发现了！";
                this.updateGameHistory('被守卫发现');
                
                await new Promise(resolve => setTimeout(resolve, 1500));
                this.showScene('guardPage');
                
                const guardMessage = document.getElementById('guardMessage');
                if (guardMessage) {
                    guardMessage.textContent = "你被神庙的守卫抓住了！";
                    guardMessage.style.opacity = '1';
                }

                // 显示重新尝试按钮
                const tryAgainButton = document.getElementById('tryAgainButton');
                if (tryAgainButton) {
                    tryAgainButton.style.display = 'block';
                }
            }
        } catch (error) {
            console.error('探索神庙时出错:', error);
            message.textContent = "发生了一些意外...";
        }
    }
}

// 初始化游戏
let gameManager;
document.addEventListener('DOMContentLoaded', () => {
    gameManager = new GameManager();
});