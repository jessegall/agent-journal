<?php

declare(strict_types=1);

use App\Sessions\States\ProfileState;
use App\Sessions\States\ReadyState;
use App\Sessions\States\SendClosingWordsState;

$tunnels = env('SHARING_TUNNELS_DIR', storage_path('sharing'));

return [

    'sessions' => [

        /*
        |--------------------------------------------------------------------------
        | Base States
        |--------------------------------------------------------------------------
        |
        | These states are held by every session for its whole life, listed from
        | the bottom up. The ready state must come first. Each entry may be a
        | state class or the reference class that builds it for a session.
        |
        */

        'base_states' => [
            ReadyState::class,
            ProfileState::class,
            SendClosingWordsState::class,
        ],

    ],

    'access' => [
        /*
        |--------------------------------------------------------------------------
        | Owner Email
        |--------------------------------------------------------------------------
        |
        | The email address of the one user (users table) who may use the journal.
        | Unset means nobody may; the first account or a registration grants
        | nothing. Locally, `php artisan db:seed` creates owner@journal.local.
        |
        */

        'owner_email' => env('JOURNAL_OWNER_EMAIL'),

        /*
        |--------------------------------------------------------------------------
        | Owner Password
        |--------------------------------------------------------------------------
        |
        | The owner account's password on a server: access:owner-ensure makes the
        | owner with it on every install, so the login stays the same across
        | resets. Unset makes no account.
        |
        */

        'owner_password' => env('JOURNAL_OWNER_PASSWORD'),
    ],

    'accounts' => [
        /*
        |--------------------------------------------------------------------------
        | Sign in Minutes
        |--------------------------------------------------------------------------
        |
        | How long a sign-in may wait for its user; polling never prolongs it.
        |
        */

        'sign_in_minutes' => (int) env('ACCOUNTS_SIGN_IN_MINUTES', 15),

        /*
        |--------------------------------------------------------------------------
        | Claude Program
        |--------------------------------------------------------------------------
        |
        | The journal-owned folder on the host that holds each account's private
        | program folder. The Claude Code program the host's sign-in runner
        | starts, as installed on the host.
        |
        */

        'claude_program' => env('ACCOUNTS_CLAUDE_PROGRAM', 'claude'),

        /*
        |--------------------------------------------------------------------------
        | Codex Program
        |--------------------------------------------------------------------------
        |
        | The Codex program the host's sign-in runner starts, as installed on the
        | host.
        |
        */

        'codex_program' => env('ACCOUNTS_CODEX_PROGRAM', 'codex'),

        'root' => env('ACCOUNTS_ROOT', storage_path('app/private/accounts')),

        /*
        |--------------------------------------------------------------------------
        | Egress Proxy
        |--------------------------------------------------------------------------
        |
        | The allow-list proxy every sign-in program goes out through on a server
        | (doc 61, decision 5); empty on the Mac.
        |
        */

        'egress_proxy' => (string) env('JOURNAL_EGRESS_PROXY', ''),
    ],

    'actors' => [
        /*
        |--------------------------------------------------------------------------
        | Presence Seconds
        |--------------------------------------------------------------------------
        |
        | How long a heartbeat keeps an actor present, in seconds. It is also how
        | long an agent session may send no beat before it is silent. A beat
        | counts while database now is strictly less than the beat plus this
        | window.
        |
        */

        'presence_seconds' => (int) env('ACTOR_PRESENCE_SECONDS', 120),

        /*
        |--------------------------------------------------------------------------
        | Heartbeat Seconds
        |--------------------------------------------------------------------------
        |
        | How often a healthy sender beats, in seconds; never more than 60, so a
        | beat always lands inside the window.
        |
        */

        'heartbeat_seconds' => 30,

        /*
        |--------------------------------------------------------------------------
        | Signed Call Refresh Seconds
        |--------------------------------------------------------------------------
        |
        | How old an agent session's stored beat must be before a signed call of
        | that agent records a new one, in seconds, so a busy agent stays present
        | without a write on every request.
        |
        */

        'signed_call_refresh_seconds' => 15,
    ],

    'agents' => [
        'transport_profile' => (string) env('AGENTS_TRANSPORT_PROFILE', 'mcp'),

        /*
        |--------------------------------------------------------------------------
        | Arrangement
        |--------------------------------------------------------------------------
        |
        | Where agents run: local (on this machine, the default) or contained
        | (each in a container of the agent daemon, docker compose --profile
        | contained; doc 61). A start on a host of the other arrangement is
        | refused.
        |
        */

        'arrangement' => (string) env('AGENTS_ARRANGEMENT', 'local'),

        /*
        |--------------------------------------------------------------------------
        | Protected Account Trial
        |--------------------------------------------------------------------------
        |
        | Contained only, for the acceptance run of doc 78: the drivers whose
        | signed-in starts use the protected-account start profile before their
        | account-isolation row is proven, as a comma list such as claude-
        | code,codex.
        |
        */

        'protected_account_trial' => (string) env('AGENTS_PROTECTED_ACCOUNT_TRIAL', ''),

        /*
        |--------------------------------------------------------------------------
        | Agent Image
        |--------------------------------------------------------------------------
        |
        | The agent image a server's session containers run, by its digest; the
        | same variable compose pins it with.
        |
        */

        'agent_image' => (string) env('AGENT_IMAGE', ''),

        /*
        |--------------------------------------------------------------------------
        | Session Journal URL
        |--------------------------------------------------------------------------
        |
        | The address a session container reaches the journal at; a host that runs
        | agents itself fills in its own.
        |
        */

        'session_journal_url' => (string) env('AGENTS_SESSION_JOURNAL_URL', ''),

        /*
        |--------------------------------------------------------------------------
        | Installation Name
        |--------------------------------------------------------------------------
        |
        | The prefix of every container, network and volume of this journal on the
        | agent daemon, required when contained; compose passes its project name.
        | The profiles folder holds the seccomp and AppArmor profiles a manifest
        | may name.
        |
        */

        'installation_name' => (string) env('AGENTS_INSTALLATION_NAME', (string) env('COMPOSE_PROJECT_NAME', '')),
        'security_profiles' => (string) env('AGENTS_SECURITY_PROFILES', ''),
        /*
        |--------------------------------------------------------------------------
        | Recording
        |--------------------------------------------------------------------------
        |
        | Whether the journal records the calls on its wires for the recordings
        | the tests play; a deployed journal never does.
        |
        */

        'recording' => (bool) env('AGENTS_RECORDING', false),

        /*
        |--------------------------------------------------------------------------
        | Release
        |--------------------------------------------------------------------------
        |
        | The version of the journal-agent release connected machines install, a
        | folder of the releases place (files.places.releases) that journal-
        | release wrote; empty while no release is published.
        |
        */

        'release' => (string) env('JOURNAL_RELEASE', ''),

        /*
        |--------------------------------------------------------------------------
        | Server Origin
        |--------------------------------------------------------------------------
        |
        | The canonical origin connected machines reach this journal at, such as
        | https://journal.example.com; never taken from a request's Host header.
        | Install lines are issued only for an https origin.
        |
        */

        'server_origin' => (string) env('JOURNAL_SERVER_ORIGIN', ''),

        /*
        |--------------------------------------------------------------------------
        | Workspaces
        |--------------------------------------------------------------------------
        |
        | Contained only: where each environment's workspace comes from, as JSON
        | keyed by environment name, either {"git": <repository>, "revision":
        | <ref>, "deploy_key_secret": <secret>} or {"folder": <name under
        | /srv/journal/workspaces>}. Read once, by WorkspaceSources.
        |
        */

        'workspaces' => (string) env('AGENTS_WORKSPACES', '{}'),

        /*
        |--------------------------------------------------------------------------
        | Merge
        |--------------------------------------------------------------------------
        |
        | Where reviewed helper work is merged: the integration branch of this
        | checkout, and the branches no merge ever writes to.
        |
        */

        'merge' => [
            'target_branch' => env('JOURNAL_MERGE_TARGET', 'version-6'),
            'protected_branches' => ['main'],
        ],

        /*
        |--------------------------------------------------------------------------
        | Key Scripts
        |--------------------------------------------------------------------------
        |
        | The maintenance key scripts an operator may run on an agent's terminal,
        | by name, each with its version, its parameters and their rules. The host
        | registers exactly these names and versions
        | (programs/agent/keyscripts/scripts, recorded()); nothing else runs (doc
        | 40, section 26).
        |
        */

        'key_scripts' => [
            'ChangeModel' => ['version' => 2, 'parameters' => ['model' => 'required|string|max:200']],
            'ChangeEffort' => ['version' => 1, 'parameters' => ['effort' => 'required|string|max:200']],
        ],

        /*
        |--------------------------------------------------------------------------
        | Driver Budgets
        |--------------------------------------------------------------------------
        |
        | The budgets of the driver ledger: how much one host poll takes and
        | waits, and how large a delivery may be.
        |
        */

        'driver_budgets' => [
            /*
            |--------------------------------------------------------------------------
            | Claim Batch Max
            |--------------------------------------------------------------------------
            |
            | The most requests one host poll takes, and the longest a poll waits
            | for one (doc 40, sections 10 and 60).
            |
            */

            'claim_batch_max' => (int) env('AGENTS_CLAIM_BATCH_MAX', 20),
            'long_poll_max_seconds' => (int) env('AGENTS_LONG_POLL_MAX_SECONDS', 10),
            /*
            |--------------------------------------------------------------------------
            | Deliver Max Bytes
            |--------------------------------------------------------------------------
            |
            | The largest message a delivery carries; a longer one is refused
            | before it is accepted (section 19).
            |
            */

            'deliver_max_bytes' => (int) env('AGENTS_DELIVER_MAX_BYTES', 64 * 1024),
        ],

        /*
        |--------------------------------------------------------------------------
        | Navigation
        |--------------------------------------------------------------------------
        |
        | Navigation requests: how long one waits for the main agent before it
        | expires, and how soon a runtime that waits behind another runtime's open
        | request of the same menu asks again (doc 54, section 5).
        |
        */

        'navigation' => [
            'expire_minutes' => (int) env('AGENTS_NAVIGATION_EXPIRE_MINUTES', 30),
            'retry_after_seconds' => (int) env('AGENTS_NAVIGATION_RETRY_AFTER_SECONDS', 30),
        ],

        /*
        |--------------------------------------------------------------------------
        | Host Capacity
        |--------------------------------------------------------------------------
        |
        | What this host gives all its helper containers together; each required-
        | container start reserves its budgets from it and is refused when they do
        | not fit. The defaults are one helper's host maxima (doc 14, section 62).
        |
        */

        'host_capacity' => [
            'cpu_cores' => (int) env('AGENTS_HOST_CPU_CORES', 8),
            'memory_bytes' => (int) env('AGENTS_HOST_MEMORY_BYTES', 16 * 1024 * 1024 * 1024),
            'disk_bytes' => (int) env('AGENTS_HOST_DISK_BYTES', 50 * 1024 * 1024 * 1024),
            /*
            |--------------------------------------------------------------------------
            | Guarded
            |--------------------------------------------------------------------------
            |
            | False lets every start through whatever it asks of the host; its
            | reservation is still recorded.
            |
            */

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
    ],

    'engine' => [
        /*
        |--------------------------------------------------------------------------
        | Connection
        |--------------------------------------------------------------------------
        |
        | The database connection the engine holds its lock on and writes through;
        | see config/database.php.
        |
        */

        'connection' => 'engine',

        /*
        |--------------------------------------------------------------------------
        | Lock Key
        |--------------------------------------------------------------------------
        |
        | The PostgreSQL advisory lock key that makes one engine process the owner
        | for this installation.
        |
        */

        'lock_key' => (int) env('ENGINE_LOCK_KEY', 7_350_013_581_206),

        /*
        |--------------------------------------------------------------------------
        | Pass Budget Milliseconds
        |--------------------------------------------------------------------------
        |
        | How long one engine pass may run, in milliseconds. A provisional limit,
        | to be measured.
        |
        */

        'pass_budget_ms' => 800,

        /*
        |--------------------------------------------------------------------------
        | Command Budget Milliseconds
        |--------------------------------------------------------------------------
        |
        | How long one command of a pass may run, in milliseconds. A provisional
        | limit, to be measured.
        |
        */

        'command_budget_ms' => 250,

        /*
        |--------------------------------------------------------------------------
        | Batch Size
        |--------------------------------------------------------------------------
        |
        | How many ticking frames one pass restores at most. A provisional limit,
        | to be measured.
        |
        */

        'batch_size' => 100,

        /*
        |--------------------------------------------------------------------------
        | Watchdog Seconds
        |--------------------------------------------------------------------------
        |
        | After how many seconds the process alarm ends a pass that hangs. A
        | provisional limit, to be measured.
        |
        */

        'watchdog_seconds' => 10,

        /*
        |--------------------------------------------------------------------------
        | Auto Assignments
        |--------------------------------------------------------------------------
        |
        | Filling auto-assignments: how often the engine considers them, how many
        | enabled facts one pass reads and how many it claims for, the most time
        | one pass spends on them (a slice of the pass, at most max_slice_ms and
        | at most slice_share of it), and the most ids one ordered pool may list.
        |
        */

        'auto_assignments' => [
            'interval_seconds' => 5,
            'facts_per_pass' => 20,
            'claims_per_pass' => 5,
            'max_slice_ms' => 100,
            'slice_share' => 0.2,
            'ordered_ids_max' => 1000,
        ],
    ],

    'files' => [
        /*
        |--------------------------------------------------------------------------
        | Places
        |--------------------------------------------------------------------------
        |
        | The root folder of each place the file funnel may touch. The private
        | places of accounts and sharing keep their one setting where their own
        | areas read it (accounts.root, sharing.secrets_dir, sharing.tunnels_dir),
        | as process-output keeps its disk's root.
        |
        */

        'places' => [
            'project' => base_path(),
            'temporary' => sys_get_temp_dir(),
            /*
            |--------------------------------------------------------------------------
            | Hook Runtime
            |--------------------------------------------------------------------------
            |
            | The agent host's runtime folder of one start, set by the hook relay
            | from the folder of its bypass log.
            |
            */

            'hook-runtime' => null,
            /*
            |--------------------------------------------------------------------------
            | Releases
            |--------------------------------------------------------------------------
            |
            | The published journal-agent releases, one folder per version as
            | journal-release writes it.
            |
            */

            'releases' => env('JOURNAL_RELEASES_FOLDER', storage_path('app/releases')),
        ],

        /*
        |--------------------------------------------------------------------------
        | Cached Bytes
        |--------------------------------------------------------------------------
        |
        | The most bytes of file contents kept for repeated reads in one process,
        | and the largest file kept.
        |
        */

        'cached_bytes' => 32 * 1024 * 1024,
        'largest_cached_file' => 1024 * 1024,
    ],

    'hooks' => [
        /*
        |--------------------------------------------------------------------------
        | Retry Seconds
        |--------------------------------------------------------------------------
        |
        | How long after an agent issued a hook call a retry of it is still
        | accepted, in seconds. Doc 3 caps it at five minutes.
        |
        */

        'retry_seconds' => (int) env('HOOK_RETRY_SECONDS', 300),

        /*
        |--------------------------------------------------------------------------
        | Hook Call Days
        |--------------------------------------------------------------------------
        |
        | How long an answered hook call is kept, in days; it must be longer than
        | the retry window.
        |
        */

        'hook_call_days' => (int) env('HOOK_CALL_DAYS', 7),

        /*
        |--------------------------------------------------------------------------
        | Closed Stack Days
        |--------------------------------------------------------------------------
        |
        | How long a closed stack is kept, in days. Active stacks and stacks held
        | for an investigation are never pruned.
        |
        */

        'closed_stack_days' => (int) env('HOOK_CLOSED_STACK_DAYS', 30),

        /*
        |--------------------------------------------------------------------------
        | Answer Budget
        |--------------------------------------------------------------------------
        |
        | How many tool uses an agent may make after it was shown a chat message
        | before it must answer in the chat.
        |
        */

        'answer_budget' => (int) env('HOOK_ANSWER_BUDGET', 5),

        /*
        |--------------------------------------------------------------------------
        | Operation Deadline Milliseconds
        |--------------------------------------------------------------------------
        |
        | How long one stack operation outside a hook may take.
        |
        */

        'operation_deadline_milliseconds' => (int) env('HOOK_OPERATION_DEADLINE_MILLISECONDS', 5000),

        /*
        |--------------------------------------------------------------------------
        | Context Budget Characters
        |--------------------------------------------------------------------------
        |
        | How many characters of reminders beyond the required ones a start,
        | clear, resume or compaction may carry.
        |
        */

        'context_budget_characters' => (int) env('HOOK_CONTEXT_BUDGET_CHARACTERS', 8000),
    ],

    'operations' => [
        /*
        |--------------------------------------------------------------------------
        | Names
        |--------------------------------------------------------------------------
        |
        | The operation names trusted owners declare, which a profile may grant,
        | remove or deny by name. A profile proposal cannot add to this list.
        |
        */

        'names' => [
            'shell:git.push',
            'shell:journal-check.cleanup',
            'tool:journal.web_read',
            'workspace.status',
            'script.run-evidence',
        ],
    ],

    'pipelines' => [
        /*
        |--------------------------------------------------------------------------
        | Middleware
        |--------------------------------------------------------------------------
        |
        | Pipes that run around a pipeline, before its own steps, keyed by the
        | pipeline class. Each takes the context or the carried value and $next,
        | and returns the pipeline's output.
        |
        */

        'middleware' => [],
    ],

    'processes' => [
        /*
        |--------------------------------------------------------------------------
        | Runner
        |--------------------------------------------------------------------------
        |
        | Whether this host may run admitted command lines under the supervisor.
        | Off until a host is set up for it; while off, every start refuses with
        | runner-unavailable and nothing spawns.
        |
        */

        'runner' => (bool) env('JOURNAL_PROCESS_RUNNER', false),

        'minimum_free_bytes' => (int) env('JOURNAL_PROCESS_MINIMUM_FREE_BYTES', 104_857_600),

        /*
        |--------------------------------------------------------------------------
        | Project Key
        |--------------------------------------------------------------------------
        |
        | The key and label projects:local-provision gives the installation's own
        | project when it makes it; the project row, not this setting, owns what
        | is stored under it.
        |
        */

        'project_key' => (string) env('JOURNAL_PROJECT_KEY', env('APP_NAME', 'journal')),

        'project_label' => (string) env('JOURNAL_PROJECT_LABEL', env('APP_NAME', 'Journal')),

        /*
        |--------------------------------------------------------------------------
        | Local Execution
        |--------------------------------------------------------------------------
        |
        | Whether this installation runs agents itself, so it needs a local
        | project, its Main environment and the owner's grants on it; off,
        | projects:local-provision makes nothing and the installation still opens.
        |
        */

        'local_execution' => (bool) env('JOURNAL_LOCAL_EXECUTION', true),
    ],

    'profiles' => [
        /*
        |--------------------------------------------------------------------------
        | Revision
        |--------------------------------------------------------------------------
        |
        | A proposal of the project's profiles, in the shape doc 14 section 63
        | describes. It is not live authority: an owner activates it with php
        | artisan profile:activate, which validates it whole and appends one
        | revision per profile. A profile's tier (1 simplest, 2 general, 3
        | complex, 4 exceptional) names its default model in each driver family,
        | and preferred_driver the driver a start preselects; every driver and
        | model can still be chosen.
        |
        */

        'revision' => 1,

        'base_overrides' => [],

        'profiles' => [
            'journal-main' => [
                'description' => 'The main agent that works the project\'s plans and talks with you.',
                'base' => 'main-agent',
                'tier' => 3,
                'supervisor' => ['default' => 'owner'],
            ],
            'journal-worker' => [
                'description' => 'Writes one assigned task or plan in a worktree of its own.',
                'base' => 'writing-helper',
                'tier' => 2,
                'supervisor' => ['default' => 'profile:journal-code-reviewer'],
                'instances' => 'per_job',
            ],
            'journal-code-reviewer' => [
                'description' => 'Reviews a worker\'s changes before they are merged.',
                'base' => 'read-only-helper',
                'tier' => 2,
                'supervisor' => ['default' => 'profile:journal-main'],
                'instances' => 'single',
            ],
            'journal-merger' => [
                'description' => 'Checks a finished worker\'s proofs and merges its work.',
                'base' => 'writing-helper',
                'tier' => 2,
                'supervisor' => ['default' => 'profile:journal-main'],
                'instances' => 'single',
            ],
        ],
    ],

    'reads' => [
        /*
        |--------------------------------------------------------------------------
        | Default Limit
        |--------------------------------------------------------------------------
        |
        | The rows a plain read returns, the largest page a list may ask for, and
        | the keys one batch reads at once.
        |
        */

        'default_limit' => 50,

        'page_max' => 100,

        'batch_size' => 100,
    ],

    'sharing' => [
        /*
        |--------------------------------------------------------------------------
        | Tunnels Dir
        |--------------------------------------------------------------------------
        |
        | The folder that holds every gateway's configuration folder: the root of
        | the file funnel's private place sharing-tunnels, so a gateway's folder
        | must lie inside it.
        |
        */

        'tunnels_dir' => $tunnels,

        /*
        |--------------------------------------------------------------------------
        | Rate Limit Store
        |--------------------------------------------------------------------------
        |
        | The cache store the public listener counts its rate limits in; Redis, so
        | every listener process shares them.
        |
        */

        'rate_limit_store' => env('SHARING_RATE_LIMIT_STORE', 'redis'),

        /*
        |--------------------------------------------------------------------------
        | Tunler
        |--------------------------------------------------------------------------
        |
        | The Tunler gateway: its pinned program, the configuration folder kept
        | for the journal alone (never a user's home), and the subdomain it opens,
        | the setting version 5 named journal.tunnels.tunler.subdomain.
        |
        */

        'tunler' => [
            'binary' => env('SHARING_TUNLER_BINARY', '/opt/sharing/bin/tunler'),
            'config_dir' => env('SHARING_TUNLER_CONFIG_DIR', "{$tunnels}/tunler"),
            'subdomain' => env('SHARING_TUNLER_SUBDOMAIN'),
        ],

        /*
        |--------------------------------------------------------------------------
        | Ngrok
        |--------------------------------------------------------------------------
        |
        | The ngrok gateway: its pinned program, the journal's own configuration
        | folder and the loopback port of its control API.
        |
        */

        'ngrok' => [
            'binary' => env('SHARING_NGROK_BINARY', '/opt/sharing/bin/ngrok'),
            'config_dir' => env('SHARING_NGROK_CONFIG_DIR', "{$tunnels}/ngrok"),
            'control_port' => (int) env('SHARING_NGROK_CONTROL_PORT', 4041),
        ],

        /*
        |--------------------------------------------------------------------------
        | Secrets Dir
        |--------------------------------------------------------------------------
        |
        | The gateways' secrets, one file per secret reference, readable by the
        | share service alone.
        |
        */

        'secrets_dir' => env('SHARING_SECRETS_DIR', storage_path('sharing/secrets')),

        /*
        |--------------------------------------------------------------------------
        | Listener
        |--------------------------------------------------------------------------
        |
        | The share-only listener: it serves public share links and nothing else,
        | on loopback inside its container, on its own port. Gateways forward only
        | there.
        |
        */

        'listener' => [
            'host' => '127.0.0.1',
            'port' => (int) env('SHARING_LISTENER_PORT', 8090),
        ],

        /*
        |--------------------------------------------------------------------------
        | Timers
        |--------------------------------------------------------------------------
        |
        | How often the sharing supervisor checks the gateways' health, expires
        | shares and prunes the audit, in seconds.
        |
        */

        'timers' => [
            'health_seconds' => 15,
            'expiry_seconds' => 60,
            'audit_prune_seconds' => 86_400,
        ],
    ],

    'web' => [
        /*
        |--------------------------------------------------------------------------
        | Local Sign in
        |--------------------------------------------------------------------------
        |
        | The sign-in form's starting values in local development only, so opening
        | the journal in Docker needs only Enter. Leave both empty outside local
        | development; they are never used in any other environment.
        |
        */

        'local_sign_in' => [
            'email' => env('LOCAL_SIGN_IN_EMAIL', ''),
            'password' => env('LOCAL_SIGN_IN_PASSWORD', ''),
        ],
    ],

];
