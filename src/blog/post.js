// Adds a "Copy" button to every code block on a blog post page.
// The post content itself is plain HTML and does not depend on this script.
document.querySelectorAll('pre code').forEach(codeBlock => {
    const pre = codeBlock.parentNode;

    const wrapper = document.createElement('div');
    wrapper.className = 'code-block-wrapper';
    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(pre);

    const button = document.createElement('button');
    button.className = 'copy-button';
    button.type = 'button';
    button.textContent = 'Copy';
    wrapper.appendChild(button);

    button.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(codeBlock.innerText);
            button.textContent = 'Copied!';
            button.classList.add('copied');
            setTimeout(() => {
                button.textContent = 'Copy';
                button.classList.remove('copied');
            }, 1500);
        } catch (err) {
            console.error('Failed to copy', err);
        }
    });
});
