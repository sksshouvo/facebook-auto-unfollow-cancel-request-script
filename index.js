(function () {
    const CLICK_INTERVAL = 5000;
    const SCROLL_DELAY = 3000;
    const MAX_SCROLL_ATTEMPTS = 5;

    window.__STOP_UNFOLLOW__ = false;
    let scrollAttempts = 0;

    function findAndClick() {
        if (window.__STOP_UNFOLLOW__) {
            console.log('Process stopped manually.');
            return;
        }

        const buttons = document.querySelectorAll('div[role="button"]');

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

                setTimeout(findAndClick, CLICK_INTERVAL);
                return;
            }
        }

        if (scrollAttempts >= MAX_SCROLL_ATTEMPTS) {
            console.log('Process ended: no more requests found.');
            return;
        }

        scrollAttempts++;
        console.log(`Scrolling... (${scrollAttempts}/${MAX_SCROLL_ATTEMPTS})`);

        window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
        setTimeout(findAndClick, SCROLL_DELAY);
    }

    console.log('Auto-unfollow started.');
    findAndClick();
})();
