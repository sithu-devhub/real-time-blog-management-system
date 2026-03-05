// AutoGrow + Character Counter - Create / Edit Post

document.addEventListener('DOMContentLoaded', function () {
function getRealCharacterLength(text) {
    return text.length;
}

function autoGrow(field) {
    const currentScrollY = window.scrollY;
    field.style.height = 'auto';
    field.style.height = field.scrollHeight + 'px';
    window.scrollTo(0, currentScrollY);
}

const titleField = document.getElementById('titleArea');
const titleCharCount = document.getElementById('titleCharCount');
if (titleField && titleCharCount) {
    titleCharCount.textContent = `${getRealCharacterLength(titleField.value)} / 2000`;
    setTimeout(() => autoGrow(titleField), 0);
    titleField.addEventListener('input', function () {
    const charCount = getRealCharacterLength(this.value);
    titleCharCount.textContent = `${charCount} / 2000`;
    autoGrow(this);
    });
}

const contentField = document.getElementById('contentArea');
const contentCharCount = document.getElementById('contentCharCount');
if (contentField && contentCharCount) {
    contentCharCount.textContent = `${getRealCharacterLength(contentField.value)} / 20000`;
    setTimeout(() => autoGrow(contentField), 0);
    contentField.addEventListener('input', function () {
    const charCount = getRealCharacterLength(this.value);
    contentCharCount.textContent = `${charCount} / 20000`;
    autoGrow(this);
    });
}
});

