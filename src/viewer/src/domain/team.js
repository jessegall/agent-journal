import {clock} from "../format/time.js";

// How the Team pages read the team's people and machines: who is online, the words for when they were last seen, and each
// person's machines out of the devices an admin is shown.
const ONLINE_SECONDS = 120;

export const isOnline = (at, now = Date.now() / 1000) => Boolean(at) && now - at < ONLINE_SECONDS;

export const ROLES = {admin: "Admin", member: "Member", relay: "Hosted journal"};

export const initial = (name) => (name || "?").trim().charAt(0).toUpperCase();

export const machinesOf = (person, devices) => devices.filter((device) => device.person === person.name);

export const onlineCount = (people) => people.filter((person) => person.online).length;

export const presence = (online, at) => (online ? "Online" : at ? `Last seen ${clock(at)}` : "Not seen yet");
