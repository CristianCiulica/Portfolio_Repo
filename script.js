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
        if (target instanceof Element && target.hasAttribute("data-close-modal")) {
            closeCourseModal();
        }
    });
}

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && courseModal && !courseModal.hidden) {
        closeCourseModal();
    }
});
