/* =====================================================
   DOCRENEW
   Document Expiry & Renewal Manager
===================================================== */


/* ================= DATA ================= */

const defaultDocuments = [

    {
        id: 1,
        name: "Passport",
        category: "Travel",
        number: "P1234567",
        issueDate: "2020-06-10",
        expiryDate: "2027-06-10",
        owner: "Me",
        fileName: "passport.pdf"
    },

    {
        id: 2,
        name: "Driving License",
        category: "Vehicle",
        number: "AP0123456789",
        issueDate: "2022-03-15",
        expiryDate: "2027-03-15",
        owner: "Me",
        fileName: "driving-license.pdf"
    },

    {
        id: 3,
        name: "Health Insurance",
        category: "Insurance",
        number: "HI987654",
        issueDate: "2026-01-01",
        expiryDate: "2026-11-20",
        owner: "Me",
        fileName: "insurance.pdf"
    },

    {
        id: 4,
        name: "Vehicle Insurance",
        category: "Insurance",
        number: "VI123456",
        issueDate: "2025-11-01",
        expiryDate: "2026-10-20",
        owner: "Me",
        fileName: "vehicle-insurance.pdf"
    },

    {
        id: 5,
        name: "Aadhaar Card",
        category: "Identity",
        number: "XXXX-XXXX-1234",
        issueDate: "2020-01-01",
        expiryDate: "2030-01-01",
        owner: "Me",
        fileName: "aadhaar.pdf"
    }

];


let documents =
    JSON.parse(localStorage.getItem("docRenewDocuments"))
    || defaultDocuments;


let familyMembers =
    JSON.parse(localStorage.getItem("docRenewFamily"))
    || [

        {
            id: 1,
            name: "Jadidya",
            relationship: "Self"
        }

    ];


let activities =
    JSON.parse(localStorage.getItem("docRenewActivities"))
    || [];


let notifications =
    JSON.parse(localStorage.getItem("docRenewNotifications"))
    || [];


let currentCalendarDate = new Date();


/* ================= ELEMENTS ================= */

const navItems =
    document.querySelectorAll(".nav-item");

const pageSections =
    document.querySelectorAll(".page-section");

const pageTitle =
    document.getElementById("pageTitle");

const pageSubtitle =
    document.getElementById("pageSubtitle");

const documentModal =
    document.getElementById("documentModal");

const familyModal =
    document.getElementById("familyModal");

const documentForm =
    document.getElementById("documentForm");

const familyForm =
    document.getElementById("familyForm");

const toast =
    document.getElementById("toast");

const toastMessage =
    document.getElementById("toastMessage");


/* ================= INITIALIZE ================= */

document.addEventListener("DOMContentLoaded", () => {

    lucide.createIcons();

    initializeNavigation();

    initializeButtons();

    initializeForms();

    initializeFilters();

    initializeTheme();

    createAutomaticNotifications();

    renderEverything();

});


/* ================= NAVIGATION ================= */

function initializeNavigation() {

    navItems.forEach(item => {

        item.addEventListener("click", () => {

            const section =
                item.dataset.section;

            showSection(section);

        });

    });


    document.querySelectorAll("[data-section-link]")
        .forEach(button => {

            button.addEventListener("click", () => {

                showSection(
                    button.dataset.sectionLink
                );

            });

        });

}


function showSection(sectionId) {

    pageSections.forEach(section => {

        section.classList.remove("active");

    });


    navItems.forEach(item => {

        item.classList.remove("active");

    });


    const section =
        document.getElementById(sectionId);

    const nav =
        document.querySelector(
            `.nav-item[data-section="${sectionId}"]`
        );


    if (section) {

        section.classList.add("active");

    }


    if (nav) {

        nav.classList.add("active");

    }


    const titles = {

        dashboard: [
            "Dashboard",
            "Keep your important documents safe and up to date."
        ],

        documents: [
            "My Documents",
            "Manage all your personal documents."
        ],

        renewals: [
            "Renewal Center",
            "Track and manage your document renewal process."
        ],

        calendar: [
            "Expiry Calendar",
            "See your upcoming document expirations."
        ],

        notifications: [
            "Notifications",
            "Important reminders about your documents."
        ],

        family: [
            "Family Profiles",
            "Manage documents for your family members."
        ],

        settings: [
            "Settings",
            "Customize your DocRenew experience."
        ]

    };


    if (titles[sectionId]) {

        pageTitle.textContent =
            titles[sectionId][0];

        pageSubtitle.textContent =
            titles[sectionId][1];

    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* ================= BUTTONS ================= */

function initializeButtons() {

    document
        .getElementById("addDocumentButton")
        .addEventListener(
            "click",
            () => openDocumentModal()
        );


    document
        .getElementById("addDocumentButton2")
        .addEventListener(
            "click",
            () => openDocumentModal()
        );


    document
        .getElementById("addFamilyButton")
        .addEventListener(
            "click",
            () => openFamilyModal()
        );


    document
        .getElementById("mobileMenu")
        .addEventListener(
            "click",
            () => {

                document
                    .querySelector(".sidebar")
                    .classList.toggle("mobile-open");

            }
        );


    document
        .getElementById("notificationButton")
        .addEventListener(
            "click",
            () => showSection("notifications")
        );


    document
        .getElementById("markAllRead")
        .addEventListener(
            "click",
            markAllNotificationsRead
        );


    document
        .getElementById("previousMonth")
        .addEventListener(
            "click",
            () => {

                currentCalendarDate.setMonth(
                    currentCalendarDate.getMonth() - 1
                );

                renderCalendar();

            }
        );


    document
        .getElementById("nextMonth")
        .addEventListener(
            "click",
            () => {

                currentCalendarDate.setMonth(
                    currentCalendarDate.getMonth() + 1
                );

                renderCalendar();

            }
        );


    document
        .querySelectorAll("[data-close]")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    closeModal(
                        button.dataset.close
                    );

                }
            );

        });


    document
        .getElementById("themeToggle")
        .addEventListener(
            "click",
            toggleTheme
        );


    document
        .getElementById("darkModeSetting")
        .addEventListener(
            "change",
            event => {

                setDarkMode(
                    event.target.checked
                );

            }
        );

}


/* ================= FORMS ================= */

function initializeForms() {

    documentForm.addEventListener(
        "submit",
        saveDocument
    );


    familyForm.addEventListener(
        "submit",
        saveFamilyMember
    );

}


/* ================= ADD DOCUMENT ================= */

function openDocumentModal(documentId = null) {

    documentForm.reset();

    document.getElementById(
        "editingDocumentId"
    ).value = "";


    if (documentId) {

        const doc =
            documents.find(
                item => item.id === documentId
            );

        if (!doc) return;


        document.getElementById(
            "editingDocumentId"
        ).value = doc.id;


        document.getElementById(
            "documentName"
        ).value = doc.name;


        document.getElementById(
            "documentCategory"
        ).value = doc.category;


        document.getElementById(
            "documentNumber"
        ).value = doc.number;


        document.getElementById(
            "issueDate"
        ).value = doc.issueDate;


        document.getElementById(
            "expiryDate"
        ).value = doc.expiryDate;


        document.getElementById(
            "documentOwner"
        ).value = doc.owner;


        document.querySelector(
            "#documentModal h2"
        ).textContent =
            "Edit Document";

    }

    else {

        document.querySelector(
            "#documentModal h2"
        ).textContent =
            "Add Document";

    }


    documentModal.classList.add("show");

}


function closeModal(id) {

    const modal =
        document.getElementById(id);

    if (modal) {

        modal.classList.remove("show");

    }

}


/* ================= SAVE DOCUMENT ================= */

function saveDocument(event) {

    event.preventDefault();


    const name =
        document.getElementById("documentName").value.trim();

    const category =
        document.getElementById("documentCategory").value;

    const number =
        document.getElementById("documentNumber").value.trim();

    const issueDate =
        document.getElementById("issueDate").value;

    const expiryDate =
        document.getElementById("expiryDate").value;

    const owner =
        document.getElementById("documentOwner").value;

    const file =
        document.getElementById("documentFile").files[0];


    if (!name || !category || !issueDate || !expiryDate) {

        showToast(
            "Please fill all required fields."
        );

        return;

    }


    if (
        new Date(expiryDate)
        < new Date(issueDate)
    ) {

        showToast(
            "Expiry date cannot be before issue date."
        );

        return;

    }


    const editingId =
        document.getElementById(
            "editingDocumentId"
        ).value;


    if (editingId) {

        const index =
            documents.findIndex(
                item => item.id == editingId
            );


        if (index !== -1) {

            documents[index] = {

                ...documents[index],

                name,
                category,
                number,
                issueDate,
                expiryDate,
                owner,

                fileName:
                    file
                        ? file.name
                        : documents[index].fileName

            };


            addActivity(
                `Updated ${name}`
            );

            showToast(
                "Document updated successfully."
            );

        }

    }

    else {

        const newDocument = {

            id: Date.now(),

            name,

            category,

            number,

            issueDate,

            expiryDate,

            owner,

            fileName:
                file
                    ? file.name
                    : ""

        };


        documents.push(newDocument);


        addActivity(
            `Added ${name}`
        );


        showToast(
            "Document added successfully."
        );

    }


    saveDocuments();

    closeModal("documentModal");

    renderEverything();

}


/* ================= DELETE DOCUMENT ================= */

function deleteDocument(id) {

    const doc =
        documents.find(
            item => item.id === id
        );


    if (!doc) return;


    documents =
        documents.filter(
            item => item.id !== id
        );


    addActivity(
        `Removed ${doc.name}`
    );


    saveDocuments();

    renderEverything();

    showToast(
        "Document removed."
    );

}


/* ================= DOCUMENT STATUS ================= */

function getDaysRemaining(expiryDate) {

    const today =
        new Date();

    today.setHours(
        0, 0, 0, 0
    );


    const expiry =
        new Date(expiryDate);

    expiry.setHours(
        0, 0, 0, 0
    );


    const difference =
        expiry - today;


    return Math.ceil(
        difference /
        (1000 * 60 * 60 * 24)
    );

}


function getStatus(expiryDate) {

    const days =
        getDaysRemaining(expiryDate);


    if (days < 0) {

        return "expired";

    }


    if (days <= 30) {

        return "expiring";

    }


    return "valid";

}


function getStatusText(status) {

    if (status === "expired")
        return "Expired";

    if (status === "expiring")
        return "Expiring Soon";

    return "Valid";

}


/* ================= DOCUMENT RENDER ================= */

function renderDocuments() {

    const grid =
        document.getElementById(
            "documentsGrid"
        );


    const search =
        document.getElementById(
            "documentSearch"
        ).value
        .toLowerCase();


    const category =
        document.getElementById(
            "categoryFilter"
        ).value;


    const statusFilter =
        document.getElementById(
            "statusFilter"
        ).value;


    const filtered =
        documents.filter(doc => {

            const status =
                getStatus(
                    doc.expiryDate
                );


            const matchesSearch =
                doc.name
                    .toLowerCase()
                    .includes(search);


            const matchesCategory =
                category === "all"
                ||
                doc.category === category;


            const matchesStatus =
                statusFilter === "all"
                ||
                status === statusFilter;


            return (
                matchesSearch
                &&
                matchesCategory
                &&
                matchesStatus
            );

        });


    if (!filtered.length) {

        grid.innerHTML = `
            <div class="empty-state">
                <h3>No documents found</h3>
                <p>Try changing your search or filters.</p>
            </div>
        `;

        return;

    }


    grid.innerHTML =
        filtered.map(
            createDocumentCard
        ).join("");


    attachDocumentActions();

    lucide.createIcons();

}


function createDocumentCard(doc) {

    const status =
        getStatus(
            doc.expiryDate
        );


    const days =
        getDaysRemaining(
            doc.expiryDate
        );


    let countdown;


    if (days < 0) {

        countdown =
            `${Math.abs(days)} days ago`;

    }

    else if (days === 0) {

        countdown =
            "Expires today";

    }

    else {

        countdown =
            `${days} days remaining`;

    }


    return `

        <div class="document-card">

            <div class="document-top">

                <div class="document-icon">

                    <i data-lucide="file-text"></i>

                </div>

                <span class="status ${status}">
                    ${getStatusText(status)}
                </span>

            </div>


            <h3>
                ${escapeHTML(doc.name)}
            </h3>


            <div class="document-number">
                ${maskDocumentNumber(doc.number)}
            </div>


            <div class="expiry-info">

                <span>EXPIRY DATE</span>

                <strong>
                    ${formatDate(doc.expiryDate)}
                </strong>

                <small>
                    ${countdown}
                </small>

            </div>


            <div class="document-actions">

                <button
                    class="small-button edit-document"
                    data-id="${doc.id}"
                >
                    Edit
                </button>

                <button
                    class="small-button renew-document"
                    data-id="${doc.id}"
                >
                    Renew
                </button>

                <button
                    class="small-button delete-document"
                    data-id="${doc.id}"
                >
                    Delete
                </button>

            </div>

        </div>

    `;

}


function attachDocumentActions() {

    document
        .querySelectorAll(".edit-document")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    openDocumentModal(
                        Number(button.dataset.id)
                    );

                }
            );

        });


    document
        .querySelectorAll(".delete-document")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    deleteDocument(
                        Number(button.dataset.id)
                    );

                }
            );

        });


    document
        .querySelectorAll(".renew-document")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    startRenewal(
                        Number(button.dataset.id)
                    );

                }
            );

        });

}


/* ================= DASHBOARD ================= */

function renderDashboard() {

    const total =
        documents.length;


    const valid =
        documents.filter(
            doc =>
                getStatus(doc.expiryDate)
                === "valid"
        ).length;


    const expiring =
        documents.filter(
            doc =>
                getStatus(doc.expiryDate)
                === "expiring"
        ).length;


    const expired =
        documents.filter(
            doc =>
                getStatus(doc.expiryDate)
                === "expired"
        ).length;


    document.getElementById(
        "totalDocuments"
    ).textContent = total;


    document.getElementById(
        "validDocuments"
    ).textContent = valid;


    document.getElementById(
        "expiringDocuments"
    ).textContent = expiring;


    document.getElementById(
        "expiredDocuments"
    ).textContent = expired;


    renderAttentionDocuments();

    renderActivities();

}


function renderAttentionDocuments() {

    const container =
        document.getElementById(
            "attentionDocuments"
        );


    const important =
        documents
            .filter(doc => {

                const status =
                    getStatus(
                        doc.expiryDate
                    );

                return (
                    status === "expired"
                    ||
                    status === "expiring"
                );

            })
            .sort(
                (a, b) =>
                    new Date(a.expiryDate)
                    -
                    new Date(b.expiryDate)
            )
            .slice(0, 3);


    if (!important.length) {

        container.innerHTML = `
            <div class="empty-state">
                <h3>Everything looks good!</h3>
                <p>No documents currently require attention.</p>
            </div>
        `;

        return;

    }


    container.innerHTML =
        important.map(
            createDocumentCard
        ).join("");


    attachDocumentActions();

    lucide.createIcons();

}


/* ================= ACTIVITY ================= */

function addActivity(text) {

    activities.unshift({

        id: Date.now(),

        text,

        date: new Date().toISOString()

    });


    activities =
        activities.slice(0, 20);


    localStorage.setItem(
        "docRenewActivities",
        JSON.stringify(activities)
    );

}


function renderActivities() {

    const container =
        document.getElementById(
            "activityList"
        );


    if (!activities.length) {

        container.innerHTML = `
            <div class="activity-item">
                <div class="activity-icon">
                    <i data-lucide="info"></i>
                </div>

                <div>
                    <strong>No recent activity</strong>
                    <span>Your activity will appear here.</span>
                </div>
            </div>
        `;

        lucide.createIcons();

        return;

    }


    container.innerHTML =
        activities
            .slice(0, 6)
            .map(activity => `

                <div class="activity-item">

                    <div class="activity-icon">

                        <i data-lucide="activity"></i>

                    </div>

                    <div>

                        <strong>
                            ${escapeHTML(activity.text)}
                        </strong>

                        <span>
                            ${timeAgo(activity.date)}
                        </span>

                    </div>

                </div>

            `)
            .join("");


    lucide.createIcons();

}


/* ================= RENEWALS ================= */

function renderRenewals() {

    const container =
        document.getElementById(
            "renewalList"
        );


    const renewalDocs =
        documents
            .filter(doc => {

                const status =
                    getStatus(
                        doc.expiryDate
                    );

                return (
                    status === "expired"
                    ||
                    status === "expiring"
                );

            })
            .sort(
                (a, b) =>
                    new Date(a.expiryDate)
                    -
                    new Date(b.expiryDate)
            );


    if (!renewalDocs.length) {

        container.innerHTML = `
            <div class="empty-state">
                <h3>No renewals required</h3>
                <p>Your documents are currently up to date.</p>
            </div>
        `;

        return;

    }


    container.innerHTML =
        renewalDocs.map(doc => {

            const days =
                getDaysRemaining(
                    doc.expiryDate
                );


            const progress =
                days < 0
                    ? 100
                    : Math.max(
                        10,
                        Math.min(
                            90,
                            100 -
                            (days / 365 * 100)
                        )
                    );


            return `

                <div class="renewal-card">

                    <div class="renewal-icon">

                        <i data-lucide="refresh-cw"></i>

                    </div>


                    <div class="renewal-content">

                        <h3>
                            ${escapeHTML(doc.name)}
                        </h3>

                        <p>
                            ${getStatusText(
                                getStatus(
                                    doc.expiryDate
                                )
                            )}
                            · Expires
                            ${formatDate(
                                doc.expiryDate
                            )}
                        </p>


                        <div class="progress">

                            <div
                                class="progress-bar"
                                style="width:${progress}%"
                            ></div>

                        </div>

                    </div>


                    <div class="renewal-price">
                        Renewal Required
                    </div>


                    <button
                        class="primary-button"
                        onclick="startRenewal(${doc.id})"
                    >
                        Start
                    </button>

                </div>

            `;

        }).join("");


    lucide.createIcons();

}


function startRenewal(id) {

    const doc =
        documents.find(
            item => item.id === id
        );


    if (!doc) return;


    addActivity(
        `Started renewal for ${doc.name}`
    );


    renderActivities();


    showSection("renewals");


    showToast(
        `Renewal started for ${doc.name}.`
    );

}


/* ================= NOTIFICATIONS ================= */

function createAutomaticNotifications() {

    documents.forEach(doc => {

        const days =
            getDaysRemaining(
                doc.expiryDate
            );


        if (
            days === 30
            ||
            days === 7
            ||
            days === 0
            ||
            days < 0
        ) {

            const exists =
                notifications.some(
                    item =>
                        item.documentId === doc.id
                        &&
                        item.days === days
                );


            if (!exists) {

                notifications.unshift({

                    id: Date.now()
                        +
                        Math.random(),

                    documentId: doc.id,

                    days,

                    read: false,

                    title:
                        days < 0
                            ? `${doc.name} has expired`
                            : `${doc.name} expires soon`,

                    message:
                        days < 0
                            ? "Renew this document as soon as possible."
                            : `${days} days remaining.`

                });

            }

        }

    });


    notifications =
        notifications.slice(0, 30);


    localStorage.setItem(
        "docRenewNotifications",
        JSON.stringify(notifications)
    );

}


function renderNotifications() {

    const container =
        document.getElementById(
            "notificationList"
        );


    if (!notifications.length) {

        container.innerHTML = `
            <div class="empty-state">
                <h3>No notifications</h3>
                <p>You are all caught up.</p>
            </div>
        `;

        return;

    }


    container.innerHTML =
        notifications.map(item => `

            <div class="
                notification-card
                ${item.read ? "" : "unread"}
            ">

                <div class="notification-icon">

                    <i data-lucide="bell-ring"></i>

                </div>


                <div>

                    <h3>
                        ${escapeHTML(item.title)}
                    </h3>

                    <p>
                        ${escapeHTML(item.message)}
                    </p>

                </div>

            </div>

        `).join("");


    lucide.createIcons();

}


function markAllNotificationsRead() {

    notifications =
        notifications.map(
            item => ({
                ...item,
                read: true
            })
        );


    localStorage.setItem(
        "docRenewNotifications",
        JSON.stringify(notifications)
    );


    renderNotifications();

    showToast(
        "All notifications marked as read."
    );

}


/* ================= CALENDAR ================= */

function renderCalendar() {

    const year =
        currentCalendarDate.getFullYear();


    const month =
        currentCalendarDate.getMonth();


    const monthName =
        currentCalendarDate.toLocaleDateString(
            "en-US",
            {
                month: "long",
                year: "numeric"
            }
        );


    document.getElementById(
        "calendarMonth"
    ).textContent = monthName;


    const firstDay =
        new Date(
            year,
            month,
            1
        ).getDay();


    const daysInMonth =
        new Date(
            year,
            month + 1,
            0
        ).getDate();


    const container =
        document.getElementById(
            "calendarDays"
        );


    let html = "";


    for (
        let i = 0;
        i < firstDay;
        i++
    ) {

        html += `
            <div class="calendar-day"></div>
        `;

    }


    for (
        let day = 1;
        day <= daysInMonth;
        day++
    ) {

        const date =
            `${year}-${String(
                month + 1
            ).padStart(2, "0")}-${String(
                day
            ).padStart(2, "0")}`;


        const events =
            documents.filter(
                doc =>
                    doc.expiryDate === date
            );


        html += `

            <div class="calendar-day">

                <span class="calendar-day-number">
                    ${day}
                </span>

                ${events.map(
                    event => `

                        <span
                            class="calendar-event"
                            title="${escapeHTML(
                                event.name
                            )}"
                        >
                            ${escapeHTML(
                                event.name
                            )}
                        </span>

                    `
                ).join("")}

            </div>

        `;

    }


    container.innerHTML = html;

}


/* ================= FAMILY ================= */

function openFamilyModal() {

    familyForm.reset();

    familyModal.classList.add("show");

}


function saveFamilyMember(event) {

    event.preventDefault();


    const name =
        document.getElementById(
            "familyName"
        ).value.trim();


    const relationship =
        document.getElementById(
            "familyRelationship"
        ).value;


    if (!name) {

        showToast(
            "Please enter a name."
        );

        return;

    }


    familyMembers.push({

        id: Date.now(),

        name,

        relationship

    });


    localStorage.setItem(
        "docRenewFamily",
        JSON.stringify(familyMembers)
    );


    addActivity(
        `Added family member ${name}`
    );


    closeModal("familyModal");

    renderFamily();

    showToast(
        "Family member added."
    );

}


function renderFamily() {

    const container =
        document.getElementById(
            "familyGrid"
        );


    container.innerHTML =
        familyMembers.map(member => `

            <div class="family-card">

                <div class="family-avatar">

                    ${getInitials(
                        member.name
                    )}

                </div>


                <h3>
                    ${escapeHTML(
                        member.name
                    )}
                </h3>


                <p>
                    ${escapeHTML(
                        member.relationship
                    )}
                </p>


                <button
                    class="small-button"
                    onclick="showFamilyDocuments(${member.id})"
                >
                    View Documents
                </button>

            </div>

        `).join("");


    lucide.createIcons();

}


function showFamilyDocuments(id) {

    const member =
        familyMembers.find(
            item => item.id === id
        );


    if (!member) return;


    showToast(
        `${member.name}'s documents can be managed here.`
    );

}


/* ================= FILTERS ================= */

function initializeFilters() {

    document
        .getElementById("documentSearch")
        .addEventListener(
            "input",
            renderDocuments
        );


    document
        .getElementById("categoryFilter")
        .addEventListener(
            "change",
            renderDocuments
        );


    document
        .getElementById("statusFilter")
        .addEventListener(
            "change",
            renderDocuments
        );


    document
        .getElementById("globalSearch")
        .addEventListener(
            "input",
            event => {

                document.getElementById(
                    "documentSearch"
                ).value =
                    event.target.value;


                showSection("documents");

                renderDocuments();

            }
        );

}


/* ================= THEME ================= */

function initializeTheme() {

    const savedTheme =
        localStorage.getItem(
            "docRenewTheme"
        );


    if (savedTheme === "dark") {

        setDarkMode(true);

    }

}


function toggleTheme() {

    setDarkMode(
        !document.body.classList.contains(
            "dark"
        )
    );

}


function setDarkMode(enabled) {

    document.body.classList.toggle(
        "dark",
        enabled
    );


    localStorage.setItem(
        "docRenewTheme",
        enabled
            ? "dark"
            : "light"
    );


    document.getElementById(
        "darkModeSetting"
    ).checked = enabled;


    const themeButton =
        document.getElementById(
            "themeToggle"
        );


    themeButton.innerHTML =
        enabled
            ? `
                <i data-lucide="sun"></i>
                Light Mode
              `
            : `
                <i data-lucide="moon"></i>
                Dark Mode
              `;


    lucide.createIcons();

}


/* ================= RENDER EVERYTHING ================= */

function renderEverything() {

    renderDashboard();

    renderDocuments();

    renderRenewals();

    renderCalendar();

    renderNotifications();

    renderFamily();

    lucide.createIcons();

}


/* ================= LOCAL STORAGE ================= */

function saveDocuments() {

    localStorage.setItem(
        "docRenewDocuments",
        JSON.stringify(documents)
    );

}


/* ================= HELPERS ================= */

function formatDate(dateString) {

    if (!dateString)
        return "-";


    const date =
        new Date(dateString);


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


function maskDocumentNumber(number) {

    if (!number)
        return "No document number";


    if (number.length <= 4)
        return "••••";


    return (
        "•••• "
        +
        number.slice(-4)
    );

}


function getInitials(name) {

    return name
        .split(" ")
        .map(word => word[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();

}


function timeAgo(dateString) {

    const date =
        new Date(dateString);


    const seconds =
        Math.floor(
            (new Date() - date) / 1000
        );


    if (seconds < 60)
        return "Just now";


    const minutes =
        Math.floor(
            seconds / 60
        );


    if (minutes < 60)
        return `${minutes} minutes ago`;


    const hours =
        Math.floor(
            minutes / 60
        );


    if (hours < 24)
        return `${hours} hours ago`;


    const days =
        Math.floor(
            hours / 24
        );


    return `${days} days ago`;

}


function escapeHTML(value) {

    return String(value || "")
        .replace(
            /[&<>"']/g,
            char => ({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;"
            }[char])
        );

}


/* ================= TOAST ================= */

let toastTimer;


function showToast(message) {

    toastMessage.textContent =
        message;


    toast.classList.add("show");


    clearTimeout(toastTimer);


    toastTimer =
        setTimeout(() => {

            toast.classList.remove(
                "show"
            );

        }, 3000);

}


/* ================= CLOSE MODAL ON BACKDROP ================= */

document.addEventListener(
    "click",
    event => {

        if (
            event.target.classList.contains(
                "modal"
            )
        ) {

            event.target.classList.remove(
                "show"
            );

        }

    }
);


/* ================= KEYBOARD ================= */

document.addEventListener(
    "keydown",
    event => {

        if (event.key === "Escape") {

            document
                .querySelectorAll(".modal.show")
                .forEach(modal => {

                    modal.classList.remove(
                        "show"
                    );

                });

        }

    }
);