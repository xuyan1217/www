document.addEventListener('DOMContentLoaded', function () {
    const startGameButton = document.getElementById('startGameButton');
    startGameButton.addEventListener('click', function () {
        showScene('library');
    });

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
                }, 1500);
            });
        }

        static searchTemple(location) {
            return new Promise((resolve, reject) => {
                const random = Math.random();
                if (random < 0.5) {
                    reject("糟糕!遇到了神庙守卫!");
                } else {
                    resolve("找到了一个神秘的箱子...");
                }
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

    let currentScene = 'welcome';

    function showScene(sceneId) {
        const scenes = document.querySelectorAll('.scene');
        scenes.forEach(scene => scene.style.opacity = 0);
        const sceneToShow = document.getElementById(sceneId);
        setTimeout(() => {
            scenes.forEach(scene => scene.style.display = 'none');
            sceneToShow.style.display = 'block';
            sceneToShow.style.opacity = 1;
            if (sceneId === 'guardPage') {
                const continueButton = document.getElementById('continueButton');
                continueButton.style.display = 'none';
            }
        }, 500);
        currentScene = sceneId;
    }

    function handleLibraryClick(event) {
        const scroll = document.querySelector('.scroll');
        if (currentScene === 'library' && event.target!== scroll) {
            document.getElementById('libraryMessage').textContent = "没有线索解码";
            document.getElementById('libraryMessage').style.animation = 'blink 1s infinite';
            setTimeout(() => {
                document.getElementById('libraryMessage').style.animation = '';
            }, 1000);
        }
    }

    function startTreasureHunt() {
        const libraryMessage = document.getElementById('libraryMessage');
        const scroll = document.querySelector('.scroll');
        scroll.style.transform = 'translate(-50%, -50%) scale(3.3)';
        TreasureMap.getInitialClue().then(clue => {
            libraryMessage.textContent = clue;
            setTimeout(() => {
                libraryMessage.textContent = '';
            }, 1000);
            return clue;
        }).then(clue => {
            return TreasureMap.decodeAncientScript(clue);
        }).then(() => {
            libraryMessage.textContent = "解码成功!宝藏在一座古老的神庙中...";
            setTimeout(() => {
                scroll.style.transform = 'none';
                showScene('temple');
            }, 1500);
        }).catch(error => {
            console.error("任务失败:", error);
        });
    }

    function searchForTreasure() {
        TreasureMap.searchTemple().then(result => {
            if (result === "糟糕!遇到了神庙守卫!") {
                showScene('guardPage');
            } else {
                const templeResult = document.getElementById('templeResult');
                const treasureBox = document.createElement('img');
                treasureBox.id = 'treasureBox';
                treasureBox.src = 'chest.jpg';
                treasureBox.alt = '宝箱';
                templeResult.innerHTML = '';
                templeResult.appendChild(treasureBox);
                treasureBox.addEventListener('click', function () {
                    showScene('treasure');
                });
            }
        }).catch(error => {
            showScene('guardPage');
        });
    }

    document.addEventListener('click', function (event) {
        if (currentScene === 'welcome') {
            showScene('library');
        } else if (currentScene === 'library') {
            handleLibraryClick(event);
        }
    });

    const continueButton = document.getElementById('continueButton');
    continueButton.addEventListener('click', searchForTreasure);

    const scroll = document.querySelector('.scroll');
    const libraryMessage = document.getElementById('libraryMessage');

    // 将鼠标悬停事件改为点击事件
    scroll.addEventListener('click', () => {
        startTreasureHunt();
    });
});