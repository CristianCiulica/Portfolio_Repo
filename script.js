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
const mobileMenuIcon = document.getElementById("menu-icon");
const navLinks = document.querySelector(".nav-links");
const mobileMenuBreakpoint = window.matchMedia("(max-width: 600px)");

function closeMobileMenu() {
    if (!navLinks) {
        return;
    }
    navLinks.classList.remove("active");
}

if (mobileMenuIcon && navLinks) {
    const logoLink = mobileMenuIcon.closest("a");

    mobileMenuIcon.addEventListener("click", (event) => {
        if (!mobileMenuBreakpoint.matches) {
            return;
        }
        event.preventDefault();
        navLinks.classList.toggle("active");
    });

    if (logoLink) {
        logoLink.addEventListener("click", (event) => {
            if (!mobileMenuBreakpoint.matches) {
                return;
            }
            event.preventDefault();
        });
    }

    navLinks.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            if (mobileMenuBreakpoint.matches) {
                closeMobileMenu();
            }
        });
    });

    mobileMenuBreakpoint.addEventListener("change", (event) => {
        if (!event.matches) {
            closeMobileMenu();
        }
    });
}

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const fullName = document.getElementById('full-name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        const submitBtn = document.querySelector('.contact-submit');

        if (!message.trim()) {
            alert('Message cannot be empty.');
            document.getElementById('message').focus();
            return;
        }

        submitBtn.textContent = 'Se trimite...';
        submitBtn.disabled = true;

        try {
            await addDoc(collection(db, "contactMessages"), {
                name: fullName,
                email: email,
                message: message,
                timestamp: serverTimestamp()
            });

            alert('Message Sent!');
            contactForm.reset();

        } catch (error) {
            console.error("Error.", error);
            alert('Error sending message. Please try again later.');
        } finally {
            submitBtn.textContent = 'Send Message';
            submitBtn.disabled = false;
        }
    });
}

const courseModal = document.getElementById("course-modal");
const courseModalTitle = document.getElementById("course-modal-title");
const courseExpandButtons = document.querySelectorAll(".course-expand-btn");

const projectModal = document.getElementById("project-modal");
const projectModalTitle = document.getElementById("project-modal-title");
const projectExpandButtons = document.querySelectorAll(".project-expand-btn");

let lastTriggerButton = null;
let lastProjectTriggerButton = null;

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
    if (!projectModal || projectModal.hidden) {
        document.body.style.overflow = "";
    }

    if (lastTriggerButton) {
        lastTriggerButton.focus();
    }
}

function getProjectModalMedia() {
    return document.getElementById("project-modal-media");
}

function createProjectMedia(imagePath, title) {
    if (imagePath) {
        const image = document.createElement("img");
        image.src = imagePath;
        image.alt = `${title} preview`;
        image.className = "project-modal-media";
        return image;
    }

    const placeholder = document.createElement("div");
    placeholder.className = "project-modal-media project-image-placeholder";
    placeholder.textContent = "Add project image";
    return placeholder;
}

function openProjectModal(triggerButton) {
    const projectModalMedia = getProjectModalMedia();
    if (!projectModal || !projectModalTitle || !projectModalMedia) {
        return;
    }

    const title = triggerButton.dataset.projectTitle || "Project preview";
    const imagePath = triggerButton.dataset.projectImage || "";

    lastProjectTriggerButton = triggerButton;
    projectModalTitle.textContent = title;

    const mediaNode = createProjectMedia(imagePath, title);
    projectModalMedia.replaceWith(mediaNode);
    mediaNode.id = "project-modal-media";

    projectModal.hidden = false;
    document.body.style.overflow = "hidden";

    const closeButton = projectModal.querySelector(".project-modal-close");
    if (closeButton) {
        closeButton.focus();
    }
}

function closeProjectModal() {
    if (!projectModal) {
        return;
    }

    projectModal.hidden = true;
    if (!courseModal || courseModal.hidden) {
        document.body.style.overflow = "";
    }

    if (lastProjectTriggerButton) {
        lastProjectTriggerButton.focus();
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

projectExpandButtons.forEach((button) => {
    button.addEventListener("click", () => openProjectModal(button));
});

if (projectModal) {
    projectModal.addEventListener("click", (event) => {
        const target = event.target;
        if (!(target instanceof Element)) {
            return;
        }
        const closeControl = target.closest("[data-close-project-modal]");
        if (closeControl && projectModal.contains(closeControl)) {
            closeProjectModal();
        }
    });
}

document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
        return;
    }

    if (projectModal && !projectModal.hidden) {
        closeProjectModal();
        return;
    }

    if (courseModal && !courseModal.hidden) {
        closeCourseModal();
    }
});