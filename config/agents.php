<?php

declare(strict_types=1);

return [
    'transport_profile' => (string) env('AGENTS_TRANSPORT_PROFILE', 'mcp'),

    /*
    | Where agents run: local (on this machine, the default) or contained (each in a container of the agent daemon,
    | docker compose --profile contained; doc 61). A start on a host of the other arrangement is refused.
    */
    'arrangement' => (string) env('AGENTS_ARRANGEMENT', 'local'),

    /*
    | Contained only, for the acceptance run of doc 78: the drivers whose signed-in starts use the protected-account
    | start profile before their account-isolation row is proven, as a comma list such as claude-code,codex.
    */
    'protected_account_trial' => (string) env('AGENTS_PROTECTED_ACCOUNT_TRIAL', ''),

    // The agent image a server's session containers run, by its digest; the same variable compose pins it with.
    'agent_image' => (string) env('AGENT_IMAGE', ''),

    /*
    | The prefix of every container, network and volume of this journal on the agent daemon, required when contained;
    | compose passes its project name. The profiles folder holds the seccomp and AppArmor profiles a manifest may name.
    */
    'installation_name' => (string) env('AGENTS_INSTALLATION_NAME', (string) env('COMPOSE_PROJECT_NAME', '')),
    'security_profiles' => (string) env('AGENTS_SECURITY_PROFILES', ''),

    /*
    | The version of the journal-agent release connected machines install, a folder of the releases place
    | (files.places.releases) that journal-release wrote; empty while no release is published.
    */
    'release' => (string) env('JOURNAL_RELEASE', ''),

    /*
    | The canonical origin connected machines reach this journal at, such as https://journal.example.com; never taken
    | from a request's Host header. Install lines are issued only for an https origin.
    */
    'server_origin' => (string) env('JOURNAL_SERVER_ORIGIN', ''),

    /*
    | Contained only: where each environment's workspace comes from, as JSON keyed by environment name, either
    | {"git": <repository>, "revision": <ref>, "deploy_key_secret": <secret>} or {"folder": <name under
    | /srv/journal/workspaces>}. Read once, by WorkspaceSources.
    */
    'workspaces' => (string) env('AGENTS_WORKSPACES', '{}'),

    /*
    | The maintenance key scripts an operator may run on an agent's terminal, by name, each with its version, its
    | parameters and their rules. The host registers exactly these names and versions
    | (programs/agent/keyscripts/scripts, recorded()); nothing else runs (doc 40, section 26).
    */
    /*
     * Where reviewed helper work is merged: the integration branch of this checkout, and the branches no merge
     * ever writes to.
     */
    'merge' => [
        'target_branch' => env('JOURNAL_MERGE_TARGET', 'version-6'),
        'protected_branches' => ['main'],
    ],

    'key_scripts' => [
        'ChangeModel' => ['version' => 2, 'parameters' => ['model' => 'required|string|max:200']],
        'ChangeEffort' => ['version' => 1, 'parameters' => ['effort' => 'required|string|max:200']],
    ],

    /*
    | The budgets of the driver ledger: how much one host poll takes and waits, and how large a delivery may be.
    */
    'driver_budgets' => [
        // The most requests one host poll takes, and the longest a poll waits for one (doc 40, sections 10 and 60).
        'claim_batch_max' => (int) env('AGENTS_CLAIM_BATCH_MAX', 20),
        'long_poll_max_seconds' => (int) env('AGENTS_LONG_POLL_MAX_SECONDS', 10),
        // The largest message a delivery carries; a longer one is refused before it is accepted (section 19).
        'deliver_max_bytes' => (int) env('AGENTS_DELIVER_MAX_BYTES', 64 * 1024),
    ],

    /*
    | Navigation requests: how long one waits for the main agent before it expires, and how soon a runtime that
    | waits behind another runtime's open request of the same menu asks again (doc 54, section 5).
    */
    'navigation' => [
        'expire_minutes' => (int) env('AGENTS_NAVIGATION_EXPIRE_MINUTES', 30),
        'retry_after_seconds' => (int) env('AGENTS_NAVIGATION_RETRY_AFTER_SECONDS', 30),
    ],

    /*
    | What this host gives all its helper containers together; each required-container start reserves its budgets
    | from it and is refused when they do not fit. The defaults are one helper's host maxima (doc 14, section 62).
    */
    'host_capacity' => [
        'cpu_cores' => (int) env('AGENTS_HOST_CPU_CORES', 8),
        'memory_bytes' => (int) env('AGENTS_HOST_MEMORY_BYTES', 16 * 1024 * 1024 * 1024),
        'disk_bytes' => (int) env('AGENTS_HOST_DISK_BYTES', 50 * 1024 * 1024 * 1024),
        // false lets every start through whatever it asks of the host; its reservation is still recorded.
        'guarded' => (bool) env('AGENTS_HOST_CAPACITY_GUARDED', true),
    ],

    /*
    |--------------------------------------------------------------------------
    | A host's idle window
    |--------------------------------------------------------------------------
    |
    | How long, in seconds, a host that holds no live process stays online, as each claim answer tells it; a connected
    | folder's relay leaves once it passed.
    */
    'idle_window_seconds' => (int) env('AGENTS_HOST_IDLE_WINDOW_SECONDS', 600),

];
