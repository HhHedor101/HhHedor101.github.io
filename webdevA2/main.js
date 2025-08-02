// Fullscreen
const btnFS = document.querySelector("#btnFS");
const btnWS = document.querySelector("#btnWS");
btnFS.addEventListener("click", enterFullscreen);
btnWS.addEventListener("click", exitFullscreen);

function enterFullscreen() {
    if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
    }
}

function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}

// File loading for audio sfx
const wateraudio = document.getElementById('putwater');
const fireaudio = document.getElementById('putfire');
const groundaudio = document.getElementById('putground');
const airaudio = document.getElementById('putair');
airaudio.volume = 0.5;

// Collapsing navigation bar
document.getElementById('navbutton').addEventListener('click', checknav);

function checknav() {
    const collapsibleDiv = document.getElementById('collapsingnav');
    collapsibleDiv.classList.toggle('open');
}

function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(function (section) {
        section.style.display = 'none';
    });

    document.getElementById(sectionId).style.display = 'block';
}

const dropzone = document.getElementById('dropzone');
const resetBtn = document.getElementById('resetBtn');

const dd = document.getElementById('shermandd');
const calliope = document.getElementById('shermancalliope');
const crab = document.getElementById('shermancrab');
const flame = document.getElementById('shermanflame');

const originalParents = new Map();

UpdateDropzoneContent();

// Drag start
document.querySelectorAll('.draggable').forEach(function (icon) {
    originalParents.set(icon.id, icon.parentElement);

    icon.addEventListener('dragstart', function (e) {
        e.dataTransfer.setData('text/plain', icon.id);
    });
});

// Drop support
dropzone.addEventListener('dragover', function (e) {
    e.preventDefault();
});

dropzone.addEventListener('drop', function (e) {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    const draggedElement = document.getElementById(id);

    const existing = dropzone.querySelector('.draggable');
    if (existing) {
        const originalParent = originalParents.get(existing.id);
        if (originalParent) {
            originalParent.appendChild(existing);
        }
    }

    dropzone.appendChild(draggedElement);
    UpdateDropzoneContent();
});

// Reset button
resetBtn.addEventListener('click', function () {
    document.querySelectorAll('.draggable').forEach(function (icon) {
        const originalParent = originalParents.get(icon.id);
        if (originalParent) {
            originalParent.appendChild(icon);
        }
    });

    UpdateDropzoneContent();
});

function UpdateDropzoneContent() {
    dd.classList.add('hiding');
    calliope.classList.add('hiding');
    crab.classList.add('hiding');
    flame.classList.add('hiding');

    const current = dropzone.querySelector('.draggable');
    if (!current) return;

    if (current.id === 'icon1') {
        calliope.classList.remove('hiding');
        airaudio.play();
    } else if (current.id === 'icon2') {
        flame.classList.remove('hiding');
        fireaudio.play();
    } else if (current.id === 'icon3') {
        dd.classList.remove('hiding');
        wateraudio.play();
    } else if (current.id === 'icon4') {
        crab.classList.remove('hiding');
        groundaudio.play();
    }
}

// Touch support
document.querySelectorAll('.draggable').forEach(function (icon) {
    icon.addEventListener('touchstart', onTouchStart, { passive: false });
});

let touchTarget = null;
let offsetX = 0;
let offsetY = 0;

function onTouchStart(e) {
    e.preventDefault();
    touchTarget = e.target;

    const touch = e.touches[0];
    const rect = touchTarget.getBoundingClientRect();
    offsetX = touch.clientX - rect.left;
    offsetY = touch.clientY - rect.top;

    touchTarget.style.position = 'absolute';
    touchTarget.style.zIndex = '1000';

    document.addEventListener('touchmove', onTouchMove, { passive: false });
    document.addEventListener('touchend', onTouchEnd);
}

function onTouchMove(e) {
    if (!touchTarget) return;

    const touch = e.touches[0];
    touchTarget.style.left = (touch.clientX - offsetX) + 'px';
    touchTarget.style.top = (touch.clientY - offsetY) + 'px';
}

function onTouchEnd() {
    if (!touchTarget) return;

    const dzRect = dropzone.getBoundingClientRect();
    const targetRect = touchTarget.getBoundingClientRect();

    if (
        targetRect.left < dzRect.right &&
        targetRect.right > dzRect.left &&
        targetRect.top < dzRect.bottom &&
        targetRect.bottom > dzRect.top
    ) {
        const existing = dropzone.querySelector('.draggable');
        if (existing && existing !== touchTarget) {
            const originalParent = originalParents.get(existing.id);
            if (originalParent) originalParent.appendChild(existing);
        }

        dropzone.appendChild(touchTarget);
        touchTarget.style.position = 'static';
        touchTarget.style.zIndex = '';
        touchTarget.style.left = '';
        touchTarget.style.top = '';

        UpdateDropzoneContent();
    } else {
        const originalParent = originalParents.get(touchTarget.id);
        if (originalParent) {
            originalParent.appendChild(touchTarget);
        }

        touchTarget.style.position = 'static';
        touchTarget.style.zIndex = '';
        touchTarget.style.left = '';
        touchTarget.style.top = '';

        UpdateDropzoneContent();
    }

    touchTarget = null;
    document.removeEventListener('touchmove', onTouchMove);
    document.removeEventListener('touchend', onTouchEnd);
}

// Slideshow logic
let slideindex1 = 0;
const imagearray_show1 = ["Images/ww2/ausf_a.jpg", "Images/ww2/ausf_g.jpg", "Images/ww2/ausf_h.jpg"];
const captionarray_show1 = [
    "The Ausführung A, which was the first Panzer IV model.",
    "The Ausführung G, a model that first appeared in 1942.",
    "The Ausführung H, one of the last models of the Panzer IV."
];
const imageElement1 = document.getElementById("firstimgarr");
const captionElement1 = document.getElementById("firstdyncaption");

document.getElementById('firstleft').addEventListener('click', function () {
    slideindex1 = decIndex(slideindex1, imagearray_show1);
    slidesTemplate(imageElement1, slideindex1, imagearray_show1, captionElement1, captionarray_show1);
});

document.getElementById('firstright').addEventListener('click', function () {
    slideindex1 = incIndex(slideindex1, imagearray_show1);
    slidesTemplate(imageElement1, slideindex1, imagearray_show1, captionElement1, captionarray_show1);
});

let slideindex2 = 0;
const imagearray_show2 = ["Images/coldwar+modernday/leopard_2sg.jpg", "Images/coldwar+modernday/bionix.jpg", "Images/coldwar+modernday/hunter.jpg"];
const captionarray_show2 = [
    "The Leopard 2SG, the mainstay of the Singapore Armour.",
    "The Bionix, an AFV which has been in Singaporean service since 1997.",
    "The Hunter AFV, apparently the first fully-digitalized combat platform."
];
const imageElement2 = document.getElementById("secondimgarr");
const captionElement2 = document.getElementById("seconddyncaption");

document.getElementById('secondleft').addEventListener('click', function () {
    slideindex2 = decIndex(slideindex2, imagearray_show2);
    slidesTemplate(imageElement2, slideindex2, imagearray_show2, captionElement2, captionarray_show2);
});

document.getElementById('secondright').addEventListener('click', function () {
    slideindex2 = incIndex(slideindex2, imagearray_show2);
    slidesTemplate(imageElement2, slideindex2, imagearray_show2, captionElement2, captionarray_show2);
});

slidesTemplate(imageElement1, slideindex1, imagearray_show1);
slidesTemplate(imageElement2, slideindex2, imagearray_show2);

function incIndex(index, imgarray) {
    return (index === imgarray.length - 1) ? 0 : index + 1;
}

function decIndex(index, imgarray) {
    return (index === 0) ? imgarray.length - 1 : index - 1;
}

function slidesTemplate(slideshowobj, slideindex, imagearray, captionobj, captionarray) {
    if (slideindex >= 0 && slideindex < imagearray.length) {
        slideshowobj.src = imagearray[slideindex];
        captionobj.textContent = captionarray[slideindex];
    } else {
        console.warn("Invalid slide index");
    }
}