<script setup>
import {computed, onMounted, ref} from "vue";
import {api} from "../../api/client.js";
import {checkTunnel, tunnelStatus} from "../../composables/shares.js";
import {logInTunnel, logOutTunnel, noAccountYet, releaseDomain, tunnelDomains} from "../../composables/tunnel.js";
import ActionSheet from "../kit/ActionSheet.vue";
import Cell from "../kit/Cell.vue";
import CellGroup from "../kit/CellGroup.vue";
import FormSheet from "../kit/FormSheet.vue";
import {toast} from "../kit/toast.js";
import {runsAllowed} from "../runs.js";

const emit = defineEmits(["open"]);
const domains = ref([]);
const version = ref(null);
const open = ref("");
const domain = ref("");
const asking = ref("");
const login = ref({endpoint: "", username: "", password: "", master: ""});

const LOGIN_FIELDS = [
    {key: "endpoint", label: "tunler server address", placeholder: "tunler.example.com", required: true, verbatim: true},
    {key: "username", label: "Username", required: true, verbatim: true},
    {key: "password", label: "Password, at least 8 characters", required: true, secret: true},
];

const fields = computed(() => [
    ...LOGIN_FIELDS.map((field) => ({...field, value: field.secret ? "" : login.value[field.key] || ""})),
    {key: "master", label: asking.value ? "Master password" : "Master password, only to create a new account", required: Boolean(asking.value), secret: true},
]);
const account = computed(() => `Connected as ${tunnelStatus.value.account} on ${tunnelStatus.value.host}`);
const accountActions = computed(() => [
    ...(runsAllowed.value ? [{key: "switch", label: "Use another account", run: () => (open.value = "switch")}] : []),
    {key: "leave", label: "Log out", danger: true, run: () => (open.value = "leave")},
]);
const own = computed(() => domain.value === tunnelStatus.value?.address);
const domainActions = computed(() =>
    own.value
        ? runsAllowed.value
            ? [{key: "move", label: "Move to a new address", sub: "The old address stops working for this journal.", run: () => (open.value = "release")}]
            : []
        : [{key: "release", label: "Give up this address", sub: "Anyone can claim it afterwards.", danger: true, run: () => (open.value = "release")}]
);

async function load() {
    [domains.value, version.value] = await Promise.all([tunnelDomains(), api.tunlerVersion().catch(() => null)]);
}

async function attempt(work, done) {
    try {
        toast(done(await work()));
    } catch (error) {
        toast(error.message);
    }
    await load();
}

async function connect(values) {
    login.value = values;
    const got = await logInTunnel(values).catch((error) => ({error: error.message}));
    if (got.connected) {
        asking.value = "";
        toast(`Connected as ${values.username}`);
        return load();
    }
    if (got.needs_master) {
        asking.value = noAccountYet(values);
        open.value = "login";
        return null;
    }
    return toast(got.error);
}

const logOut = () => attempt(logOutTunnel, () => "Logged out of tunler");
const update = () => attempt(() => api.updateTunler(), (told) => told || "tunler updated");
const install = ({server}) => attempt(() => api.installTunler(server), (told) => told || "tunler installed");
const release = () => attempt(() => releaseDomain(domain.value, own.value), () => (own.value ? "Moved to a new address" : `Gave up ${domain.value}`));

function pickDomain(name) {
    domain.value = name;
    open.value = "domain";
}

onMounted(() => load().catch(() => null));
</script>

<template>
    <CellGroup head="Reaching the journal from outside" foot="Every journal on your computer uses this tunler login, this phone too.">
        <template v-if="!tunnelStatus">
            <Cell label="tunler account" sub="Checking…" still />
        </template>
        <template v-else-if="!tunnelStatus.installed">
            <template v-if="runsAllowed">
                <Cell label="Install tunler" sub="tunler is not installed on your computer" icon="download" @pick="open = 'install'" />
            </template>
            <template v-else>
                <Cell label="tunler" sub="Not installed on your computer" still />
            </template>
        </template>
        <template v-else-if="tunnelStatus.logged_in">
            <Cell label="tunler account" :sub="account" @pick="open = 'account'" />
        </template>
        <template v-else>
            <Cell label="Connect a tunler account" sub="Not connected on your computer" :still="!runsAllowed" @pick="open = 'login'" />
        </template>
        <template v-if="version && version.current">
            <Cell
                :label="`tunler ${version.current}`"
                :sub="version.update_available ? `${version.latest || 'A newer version'} is available` : 'Up to date'"
                :still="!version.update_available || !runsAllowed"
                @pick="open = 'update'"
            />
        </template>
        <Cell label="Share links" sub="Pages you shared with other people" icon="share" @pick="emit('open', 'list:share')" />
    </CellGroup>
    <template v-if="domains.length">
        <CellGroup head="Addresses" foot="Addresses your tunler account holds">
            <template v-for="name in domains" :key="name">
                <Cell
                    :label="name"
                    :sub="name === tunnelStatus?.address ? 'In use by this journal' : ''"
                    :still="name === tunnelStatus?.address && !runsAllowed"
                    @pick="pickDomain(name)"
                />
            </template>
        </CellGroup>
    </template>
    <template v-if="open === 'account'">
        <ActionSheet title="tunler account" :about="account" line="what you can do with it" :actions="accountActions" @close="open = ''" />
    </template>
    <template v-if="open === 'domain'">
        <ActionSheet :title="domain" about="Address" line="what you can do with it" :actions="domainActions" @close="open = ''" />
    </template>
    <template v-if="open === 'login' || open === 'switch'">
        <FormSheet
            :title="asking ? 'Create the account' : 'Connect a tunler account'"
            :sub="
                asking ||
                (open === 'switch'
                    ? 'Another account replaces the current login for every journal on your computer. Each address stays with the account that claimed it.'
                    : 'A forgotten password cannot be recovered: make a new account. Accounts unused for 30 days are deleted with their domains.')
            "
            :fields="fields"
            :button="asking ? 'Create the account' : 'Connect'"
            @close="open = ''"
            @submit="connect"
        />
    </template>
    <template v-if="open === 'leave'">
        <FormSheet
            title="Log out of tunler?"
            sub="Every journal on your computer stops reaching the outside, and this phone loses its way in until you connect again at home."
            button="Log out"
            keep="Stay connected"
            danger
            @close="open = ''"
            @submit="logOut"
        />
    </template>
    <template v-if="open === 'update'">
        <FormSheet :title="`Update tunler to ${version.latest || 'the newest version'}?`" button="Update tunler" @close="open = ''" @submit="update" />
    </template>
    <template v-if="open === 'install'">
        <FormSheet
            title="Install tunler"
            sub="No server yet? tunler on GitHub, github.com/jessegall/tunler, explains how to run one."
            :fields="[{key: 'server', label: 'tunler server address', placeholder: 'tunler.example.com', value: tunnelStatus.server || '', required: true, verbatim: true}]"
            button="Install tunler"
            @close="open = ''"
            @submit="install"
        />
    </template>
    <template v-if="open === 'release'">
        <FormSheet
            :title="own ? `Move ${domain} to a new address?` : `Give up ${domain}?`"
            :sub="own ? 'This journal gets a new address, and links to the old one stop working.' : 'Anyone can claim it afterwards.'"
            :button="own ? 'Move' : 'Give up this address'"
            keep="Keep it"
            :danger="!own"
            @close="open = ''"
            @submit="release"
        />
    </template>
</template>
