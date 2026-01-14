(function () {
    const CLICK_INTERVAL = 5000;     // 5 seconds between clicks
    const SCROLL_DELAY = 3000;       // wait after scroll
    const MAX_SCROLL_ATTEMPTS = 5;   // stop after N failed scrolls

    let scrollAttempts = 0;
    let isRunning = true;

    function findAndClick() {
        if (!isRunning) return;

        const buttons = document.querySelectorAll('div[role="button"]');
        let found = false;

        for (const btn of buttons) {
            const aria = (btn.getAttribute('aria-label') || '').toLowerCase();
            const text = (btn.innerText || '').toLowerCase();

            if (
                aria.includes('cancel request') ||
                aria.includes('unfollow') ||
                text.includes('cancel request') ||
                text.includes('unfollow')
            ) {
                btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
                btn.click();
                console.log('Clicked:', aria || text);
                found = true;
                scrollAttempts = 0;

                setTimeout(findAndClick, CLICK_INTERVAL);
                return;
            }
        }

        if (!found) {
            if (scrollAttempts >= MAX_SCROLL_ATTEMPTS) {
                console.log(
                    'Process ended: no more requests found after',
                    MAX_SCROLL_ATTEMPTS,
                    'scroll attempts.'
                );
                isRunning = false;
                return;
            }

            scrollAttempts++;
            console.log(
                `No button found. Scrolling down... (${scrollAttempts}/${MAX_SCROLL_ATTEMPTS})`
            );

            window.scrollBy({
                top: window.innerHeight,
                behavior: 'smooth'
            });

            setTimeout(findAndClick, SCROLL_DELAY);
        }
    }

    console.log('Auto-unfollow process started.');
    findAndClick();
})();
