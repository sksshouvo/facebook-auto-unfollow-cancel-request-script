(async function () {
    const CLICK_INTERVAL = 5000;
    const SCROLL_DELAY = 2000;
    const MAX_IDLE_SCROLL = 3;

    window.__STOP_UNFOLLOW__ = false;

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function scrollToBottom() {
        console.log('Scrolling to bottom...');
        let lastHeight = 0;
        let idleCount = 0;

        while (!window.__STOP_UNFOLLOW__) {
            window.scrollTo(0, document.body.scrollHeight);
            await sleep(SCROLL_DELAY);

            const newHeight = document.body.scrollHeight;
            if (newHeight === lastHeight) {
                idleCount++;
                console.log(`No new data (${idleCount}/${MAX_IDLE_SCROLL})`);
            } else {
                idleCount = 0;
                lastHeight = newHeight;
            }

            if (idleCount >= MAX_IDLE_SCROLL) {
                console.log('Reached bottom.');
                break;
            }
        }
    }

    function collectButtons() {
        return Array.from(document.querySelectorAll('div[role="button"]'))
            .filter(btn => {
                const aria = (btn.getAttribute('aria-label') || '').toLowerCase();
                const text = (btn.innerText || '').toLowerCase();
                return (
                    aria.includes('cancel request') ||
                    aria.includes('unfollow') ||
                    text.includes('cancel request') ||
                    text.includes('unfollow')
                );
            });
    }

    async function cancelFromBottom() {
        let buttons = collectButtons();
        console.log(`Found ${buttons.length} cancel buttons.`);

        for (let i = buttons.length - 1; i >= 0; i--) {
            if (window.__STOP_UNFOLLOW__) {
                console.log('Process stopped manually.');
                return;
            }

            const btn = buttons[i];
            btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
            await sleep(800);

            btn.click();
            console.log(`Cancelled ${buttons.length - i}/${buttons.length}`);
            await sleep(CLICK_INTERVAL);
        }

        console.log('All cancel requests processed.');
    }

    console.log('Auto-unfollow started (bottom → top).');

    await scrollToBottom();
    if (!window.__STOP_UNFOLLOW__) {
        await cancelFromBottom();
    }
})();
