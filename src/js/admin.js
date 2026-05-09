/**
 * @fileoverview Admin dashboard entry point for cbadmin.
 *
 * Bootstraps the admin page by:
 * 1. Registering Web Components (custom-accordion, custom-switch).
 * 2. Setting the page title from the device hostname.
 * 3. Wiring the logout button to clear the session and redirect.
 * 4. On window load: fetching current config values (load), attaching save
 *    callbacks to all form controls (attachUpdateCallbacks), initialising the
 *    reports section (initReports), and attaching system-action buttons
 *    (attachSystemScripts).
 * 5. Closing the popup modal when its backdrop is clicked.
 */

import './components/custom-accordion'
import './components/custom-switch'

import logout from "./admin/logout";
import load from "./admin/load";
import attachUpdateCallbacks from "./admin/update";
import initReports from "./admin/reports";
import attachSystemScripts from "./admin/scripts";

// Auth token — currently unused (session-based auth via cookie replaces the
// token approach, but the token plumbing is kept in place for future use).
let token;

/**
 * Store a new auth token in memory.
 *
 * @param {string|null} nToken - New token value, or null to clear on logout.
 */
function setToken(nToken) {
    token = nToken
}

// Reflect the device hostname in the browser tab and page heading so the
// admin knows which device they're connected to when managing multiple boxes.
const storedToken = localStorage.getItem('admin-authorization')

document.getElementById('title').innerText = `Admin: ${window.location.hostname}`;
document.title = `Admin: ${window.location.hostname}`;

// Wire logout button — clears token, removes stored credentials, calls the
// logout API endpoint, and redirects to the login page.
document.getElementById('logout').addEventListener('click', () => logout(setToken))

// Defer all data loading and callback wiring until after the DOM is fully
// parsed — ensures all input elements referenced by id exist before being
// queried by load() and attachUpdateCallbacks().
window.addEventListener('load', () => {
    load(token);
    attachUpdateCallbacks(token);
    initReports(token)
    attachSystemScripts(token);
})

// Close the popup modal when the user clicks its backdrop rather than the
// explicit close button — standard light-dismiss behaviour.
const popup = document.getElementById("popup");
popup.addEventListener('click', () => popup.style.display = 'none');

