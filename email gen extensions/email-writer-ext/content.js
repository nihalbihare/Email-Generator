console.log("Email writer script loaded")
function findComposeToolbar() {
    const selectors = ['.btC', '.aDh', '[role="toolbar"]', '.gU.Up'];
    for (const selector of selectors) {
        const toolbar = document.querySelector(selector);
        if (toolbar) return toolbar;
    }
    return null; 
}

function getEmailContent() {
    const selectors = [
        '.h7',
        '.a3s.aiL',
        '.gmail_quote',
        '[role="presentation"]',
    ]
    for (const selector of selectors) {
        const content = document.querySelector(selector)
        if (content) {
            return content.innerText.trim()
        }
    }
    return ''

}
function createAiButton() {
const button = document.createElement('div');
    button.className = 'T-I J-J5-Ji aoO v7 T-I-atl L3'
    button.style.marginRight = '8px'
    button.innerHTML = 'AI Reply'
    button.setAttribute('role', 'button')
    button.setAttribute('data-tooltip', 'Generate AI Reply')
    return button

}
async function injectButton() {
    const existingButton = document.querySelector('.ai-reply');
    if (existingButton) existingButton.remove();

    const toolbar = findComposeToolbar();
    if (!toolbar) {
        console.log('Toolbar not found');
        return;
    }

    console.log('Toolbar found creating AI button');
    const button = createAiButton();
    button.classList.add('ai-reply');

    // ✅ Only run API when clicked
    button.addEventListener('click', async () => {
        try {
            button.innerHTML = 'Generating...';
            button.disabled = true;

            const emailContent = getEmailContent();
            const response = await fetch('http://localhost:8080/api/email/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ emailContent, tone: "Professional" })
            });

            if (!response.ok) throw new Error('API Request Failed');

            const generatedReply = await response.text();
            const composeBox = document.querySelector('[role="textbox"][g_editable="true"]');
            if (composeBox) {
                composeBox.focus();
                document.execCommand('insertText', false, generatedReply);
            } else {
                console.log('Compose box not found');
            }
        } catch (error) {
            console.log(error);
        } finally {
            button.innerHTML = 'AI Reply';
            button.disabled = false;
        }
    });

    toolbar.insertBefore(button, toolbar.firstChild);
}

const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        const addedNodes = Array.from(mutation.addedNodes);
        const hasComposeElement = addedNodes.some(node =>
            node.nodeType === Node.ELEMENT_NODE &&
            (node.matches('.aDh, .btC, [role ="dialog"]') ||
             document.querySelector('.aDh, .btC, [role ="dialog"]'))
        );

        if (hasComposeElement) {
            // ✅ Prevent multiple injections
            if (!document.querySelector('.ai-reply')) {
              console.log("Compose window detected → injecting button");
                setTimeout(injectButton, 500);
            }
        }
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true
})
// Purpose: This script detects when a Gmail compose window opens and injects a custom button.
// It keeps observing the DOM (webpage structure) so that if Gmail dynamically loads new elements,
// the button can still be added without needing a page refresh.