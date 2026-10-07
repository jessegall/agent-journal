import {ref} from "vue";
import {phone} from "../api/phone.js";

export const enrolled = ref(false);
export const asking = ref(null);
export const NOT_UNLOCKED = "Nothing ran: the phone was not unlocked.";

const bytes = (text) => Uint8Array.from(atob(text.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0));
const text = (buffer) =>
    btoa(String.fromCharCode(...new Uint8Array(buffer)))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
const hex = (buffer) => [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, "0")).join("");

export async function unlockable() {
    const check = window.PublicKeyCredential?.isUserVerifyingPlatformAuthenticatorAvailable;
    return Boolean(check && (await check.call(PublicKeyCredential).catch(() => false)));
}

async function requested(method, url, body) {
    const where = new URL(url, location.href);
    const encodedRequest = new TextEncoder().encode(`${method} ${where.pathname}${where.search}\n${body ?? ""}`);
    return hex(await crypto.subtle.digest("SHA-256", encodedRequest));
}

function confirmed(label, act) {
    return new Promise((resolve, reject) => {
        const refused = (error) => reject(error?.name === "NotAllowedError" ? new Error(NOT_UNLOCKED) : error);
        asking.value = {label, run: () => act().then(resolve, refused), cancel: () => reject(new Error(NOT_UNLOCKED))};
    });
}

async function withFace(label, act) {
    try {
        return await act();
    } catch (error) {
        if (error?.name !== "NotAllowedError") throw error;
        return confirmed(label, act);
    }
}

async function enrol() {
    const asked = await phone.passkeyBegin();
    const made = await withFace("Set up Face ID or the passcode for commands", () =>
        navigator.credentials.create({publicKey: {...asked, challenge: bytes(asked.challenge), user: {...asked.user, id: bytes(asked.user.id)}}})
    );
    await phone.passkey({client_data: text(made.response.clientDataJSON), attestation: text(made.response.attestationObject)});
    enrolled.value = true;
}

export async function unlocked(method, url, body) {
    const request = await requested(method, url, body);
    if (!enrolled.value) await enrol();
    const asked = await phone.unlockBegin(request);
    const allowCredentials = asked.allowCredentials.map((credential) => ({...credential, id: bytes(credential.id)}));
    const answer = await withFace("Unlock with Face ID or the passcode", () =>
        navigator.credentials.get({publicKey: {...asked, challenge: bytes(asked.challenge), allowCredentials}})
    );
    const {unlock} = await phone.unlock({
        id: answer.id,
        client_data: text(answer.response.clientDataJSON),
        authenticator_data: text(answer.response.authenticatorData),
        signature: text(answer.response.signature),
    });
    return {"X-Phone-Unlock": unlock};
}
