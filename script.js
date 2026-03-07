import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCf8QhDBdAhXGBmwRfAe7ih0hsKV1_E_nI",
    authDomain: "portfolio-web-5d0a8.firebaseapp.com",
    projectId: "portfolio-web-5d0a8",
    storageBucket: "portfolio-web-5d0a8.firebasestorage.app",
    messagingSenderId: "141934741919",
    appId: "1:141934741919:web:c9219cacd8997ba97dd5aa",
    measurementId: "G-CMGE65TSH8"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const contactForm = document.querySelector('.contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const fullName = document.getElementById('full-name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        const submitBtn = document.querySelector('.contact-submit');

        submitBtn.textContent = 'Se trimite...';
        submitBtn.disabled = true;

        try {
            await addDoc(collection(db, "contactMessages"), {
                name: fullName,
                email: email,
                message: message,
                timestamp: serverTimestamp()
            });

            alert('Mesajul tău a fost trimis cu succes!');
            contactForm.reset();

        } catch (error) {
            console.error("Eroare la trimiterea mesajului: ", error);
            alert('A apărut o eroare. Te rog să încerci din nou.');
        } finally {
            submitBtn.textContent = 'Send Message';
            submitBtn.disabled = false;
        }
    });
}

const courseModal = document.getElementById("course-modal");
const courseModalTitle = document.getElementById("course-modal-title");
const courseExpandButtons = document.querySelectorAll(".course-expand-btn");

let lastTriggerButton = null;

function getCourseModalMedia() {
    return document.getElementById("course-modal-media");
}

function createCourseMedia(imagePath, title) {
    if (imagePath) {
        const image = document.createElement("img");
        image.src = imagePath;
        image.alt = `${title} diploma`;
        image.className = "course-modal-media";
        return image;
    }

    const placeholder = document.createElement("div");
    placeholder.className = "course-modal-media course-image-placeholder";
    placeholder.textContent = "Add diploma image";
    return placeholder;
}

function openCourseModal(triggerButton) {
    const courseModalMedia = getCourseModalMedia();
    if (!courseModal || !courseModalTitle || !courseModalMedia) {
        return;
    }

    const title = triggerButton.dataset.courseTitle || "Course diploma";
    const imagePath = triggerButton.dataset.courseImage || "";

    lastTriggerButton = triggerButton;
    courseModalTitle.textContent = title;

    const mediaNode = createCourseMedia(imagePath, title);
    courseModalMedia.replaceWith(mediaNode);
    mediaNode.id = "course-modal-media";

    courseModal.hidden = false;
    document.body.style.overflow = "hidden";

    const closeButton = courseModal.querySelector(".course-modal-close");
    if (closeButton) {
        closeButton.focus();
    }
}

function closeCourseModal() {
    if (!courseModal) {
        return;
    }

    courseModal.hidden = true;
    document.body.style.overflow = "";

    if (lastTriggerButton) {
        lastTriggerButton.focus();
    }
}

courseExpandButtons.forEach((button) => {
    button.addEventListener("click", () => openCourseModal(button));
});

if (courseModal) {
    courseModal.addEventListener("click", (event) => {
        const target = event.target;
        if (!(target instanceof Element)) {
            return;
        }
        const closeControl = target.closest("[data-close-modal]");
        if (closeControl && courseModal.contains(closeControl)) {
            closeCourseModal();
        }
    });
}

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && courseModal && !courseModal.hidden) {
        closeCourseModal();
    }
});