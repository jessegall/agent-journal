<?php

declare(strict_types=1);

namespace App\Support\Drivers\Profiles;

use App\Contracts\Drivers\DriverProfile;
use App\Contracts\Drivers\PinnedBuilds;
use App\Contracts\Drivers\TurnResult;
use App\Enums\Drivers\HoldReason;
use App\Enums\Hosts\HostProcessPurpose;
use App\Enums\Hosts\HostProcessType;
use App\Enums\Hosts\RestartPolicy;
use App\Enums\Navigation\NavigationKey;
use App\Exceptions\BuildNotPinned;
use App\Exceptions\ProfileRefused;
use App\Support\DefaultDrivers;
use App\Support\Drivers\Processes\CodexResult;
use App\Support\KeyScripts\KeyScript;
use App\Support\KeyScripts\KeyStep;
use App\Support\KeyScripts\ScreenExpectation;
use App\Support\Screens\MarkedRow;
use App\Support\Screens\MenuFamily;
use App\Support\Screens\OptionList;
use App\Support\Screens\ScreenLayout;
use App\Values\DriverStart;
use App\Values\HostProcessPlan;
use App\Values\PlanFile;

/**
 * The start profile of codex-cli 0.165.0: an isolated CODEX_HOME whose config turns every agent-spawning feature off,
 * a workspace-write sandbox, no approval asked of a user, and a resume only by the conversation Codex acknowledged.
 * Codex's sandbox limits writes only, so its tools could read its sign-in: it never starts on a protected account.
 */
final readonly class CodexProfile implements DriverProfile
{
    public const string EXECUTABLE = 'codex';

    /**
     * The features of 0.165.0 that start or coordinate another agent; all of them stay off.
     */
    private const array AGENT_FEATURES = [
        'multi_agent',
        'multi_agent_mode',
        'multi_agent_v2',
        'multi_agent_v2_dynamic_tools',
        'agent_message_board',
        'runtime_agent_instances',
    ];

    /**
     * The flags and settings that would change where a tool runs or what it may do; the profile alone sets them.
     */
    private const array ROUTE_SETTINGS = [
        '--sandbox',
        '-s',
        'sandbox_mode',
        'sandbox_workspace_write',
        '--ask-for-approval',
        '-a',
        'approval_policy',
        '--add-dir',
        'shell_environment_policy',
        'experimental_exec_server',
        'environments',
        'include_local',
        'features.view_image',
        'features.code_mode',
        'mcp_servers',
        '--cd',
        '-C',
    ];

    /**
     * The arguments that would undo the profile outright.
     */
    private const array CONTRARY_ARGUMENTS = [
        '--last',
        '--full-auto',
    ];

    /**
     * Every native hook event of 0.165.0 with its key in a trust entry and its timeout in seconds.
     */
    private const array HOOK_EVENTS = [
        'SessionStart' => [
            'session_start',
            600,
        ],
        'UserPromptSubmit' => [
            'user_prompt_submit',
            600,
        ],
        'PreToolUse' => [
            'pre_tool_use',
            600,
        ],
        'PostToolUse' => [
            'post_tool_use',
            600,
        ],
        'Stop' => [
            'stop',
            600,
        ],
        'SessionEnd' => [
            'session_end',
            1,
        ],
    ];

    private const string SANDBOX = 'workspace-write';

    private const string HOOK_NAME = 'codex';

    private const string SETTINGS_FOLDER = '{folder:files}';

    private const int STILL_MS = 300;

    /**
     * What Codex's login status prints for a signed-in home, whatever the method.
     */
    private const string SIGNED_IN = 'Logged in using';

    public function __construct(private PinnedBuilds $builds) {}

    /**
     * The key scripts recorded for Codex: each goes through the /model picker and ends on Codex's own line saying the
     * model changed (recordings codex/0.165.0/keyscripts/model-choice and effort-change).
     *
     * @return list<KeyScript>
     */
    public function keyScripts(): array
    {
        $enterIn = fn (string $name, string $family) => KeyStep::press(
            $name,
            ScreenExpectation::menu($family),
            NavigationKey::Enter->bytes(),
        );

        $openModelPicker = KeyScript::command('/model', '› /model');

        $changeModel = [
            ...$openModelPicker,
            KeyStep::find('find the model', 'model-picker', 'model'),
            $enterIn('choose the model', 'model-picker'),
            KeyStep::findMarked('find the default reasoning', 'reasoning-picker', '(default)'),
            $enterIn('keep the default reasoning', 'reasoning-picker'),
            KeyStep::evidence('see the model applied', 'model changed to {model}'),
        ];

        $changeEffort = [
            ...$openModelPicker,
            KeyStep::findMarked('find the current model', 'model-picker', '(current)'),
            $enterIn('keep the current model', 'model-picker'),
            KeyStep::find('find the reasoning level', 'reasoning-picker', 'effort'),
            $enterIn('choose the reasoning level', 'reasoning-picker'),
            KeyStep::evidence('see the reasoning applied', 'model changed to', ' {effort}'),
        ];

        $driver = DefaultDrivers::CODEX;

        return [
            new KeyScript('ChangeModel', $driver, $this->build(), ['model'], $changeModel),
            new KeyScript('ChangeEffort', $driver, $this->build(), ['effort'], $changeEffort),
        ];
    }

    /**
     * How the pinned build draws its terminal, measured from resources/recordings/codex/0.165.0: the alternate buffer,
     * a composer that is the lowest › row with at most its status lines below it, empty while the cursor sits right
     * after the ›, and no bracketed paste. Each menu is known by its › option list and two of its keywords and holds
     * the runtime for a user, but the background server's, which its recording answers.
     */
    public function layout(): ScreenLayout
    {
        $options = new OptionList('menu', ['› ']);

        $menu = fn (string $name, HoldReason $hold, string ...$keywords) => MenuFamily::of(
            $name,
            $hold,
            $options,
            ...$keywords,
        );

        return new ScreenLayout(
            buffer: 'alternate',
            composer: new MarkedRow('composer', ['› '], [], 3),
            emptyCursorColumn: 2,
            composerStillMs: self::STILL_MS,
            menus: [
                // Recorded in keyscripts/model-choice: its user ran without the daemon, two rows up from Cancel.
                $menu(
                    'background-server',
                    HoldReason::DriverInput,
                    'background server has incompatible feature settings',
                    'run without daemon this time',
                    'restart with these settings',
                )->answeredWith(str_repeat(NavigationKey::Up->bytes(), 2).NavigationKey::Enter->bytes()),
                $menu(
                    'folder-trust',
                    HoldReason::TrustRequired,
                    'trust this folder',
                    'open restricted',
                    'trust and continue',
                    'folder settings',
                ),
                $menu(
                    'hooks-review',
                    HoldReason::TrustRequired,
                    'hooks need review',
                    'trust all',
                    'continue without trusting',
                ),
                $menu(
                    'sign-in',
                    HoldReason::LoginRequired,
                    'sign in with chatgpt',
                    'device code',
                    'provide your own api key',
                    'welcome to codex',
                ),
                $menu(
                    'update',
                    HoldReason::UpdateRequired,
                    'update now',
                    'skip until next version',
                    'update available',
                ),
                $menu('rate-limit', HoldReason::UsageLimited, 'approaching rate limits', 'keep current model'),
                $menu('question', HoldReason::UserInput, 'question requested', 'none of the above', 'free-form'),
                $menu(
                    'resume-session',
                    HoldReason::UserInput,
                    'resume a previous session',
                    'fork a previous session',
                    'current directory',
                ),
                $menu(
                    'reasoning-picker',
                    HoldReason::UserInput,
                    'select reasoning level',
                    'enter default',
                    's session',
                ),
                $menu(
                    'model-picker',
                    HoldReason::UserInput,
                    'select model and effort',
                    '(current)',
                    'enter select',
                    'esc back',
                ),
                $menu(
                    'approval',
                    HoldReason::PermissionRequired,
                    'would you like to',
                    'yes, proceed',
                    'what to do differently',
                    'grant these permissions',
                    'this host',
                ),
            ],
            others: [
                new MarkedRow('status', [], ['for shortcuts'], 1),
            ],
        );
    }

    public function family(): string
    {
        return DefaultDrivers::CODEX;
    }

    public function build(): string
    {
        return $this->builds->versionOf(DefaultDrivers::CODEX);
    }

    public function assertPinnedBuild(string $printed): void
    {
        $version = trim($printed);

        if ($version !== self::EXECUTABLE.'-cli '.$this->build()) {
            throw BuildNotPinned::of(self::EXECUTABLE, $version, $this->build());
        }
    }

    /**
     * The plan of a terminal start or of one exec turn. A start on a protected account is refused: Codex's sandbox
     * limits writes only, so its tools could read the sign-in its container keeps.
     *
     * @throws ProfileRefused
     */
    public function startPlan(DriverStart $start): HostProcessPlan
    {
        if ($start->account?->isProtected === true) {
            throw ProfileRefused::notContainable(self::EXECUTABLE);
        }

        $isTerminal = $start->type === HostProcessType::Terminal;

        return new HostProcessPlan(
            purpose: $start->isTurn() ? HostProcessPurpose::AgentTurn : HostProcessPurpose::AgentTerminal,
            type: $start->type,
            restart: $isTerminal ? RestartPolicy::OnCrash : RestartPolicy::Never,
            argv: [
                self::EXECUTABLE,
                ...$this->arguments($start),
            ],
            environment: ['CODEX_HOME='.($start->account->folder ?? self::SETTINGS_FOLDER)],
            folder: $start->workFolder,
            files: $start->account === null ? $this->settingsFiles($start) : [],
            inherit: [
                'HOME',
                'PATH',
            ],
            shieldRules: $isTerminal ? $this->layout()->shieldRules() : [],
        );
    }

    public function turnResult(string $processId): TurnResult
    {
        return new CodexResult($processId);
    }

    public function versionProbe(string $workFolder): HostProcessPlan
    {
        return new HostProcessPlan(
            purpose: HostProcessPurpose::BuildProbe,
            type: HostProcessType::Pipe,
            restart: RestartPolicy::Never,
            argv: [
                self::EXECUTABLE,
                '--version',
            ],
            environment: [],
            folder: $workFolder,
            inherit: [
                'HOME',
                'PATH',
            ],
        );
    }

    /**
     * Codex prints its sign-in for the account's home; it writes that line to its error stream, so the probe hands it on
     * to its output, which the probe reads.
     */
    public function signInProbe(DriverStart $start): HostProcessPlan
    {
        $folder = $start->account->folder
            ?? throw ProfileRefused::unresolvedSetting('no account to check the sign-in of');

        return new HostProcessPlan(
            purpose: HostProcessPurpose::SignInProbe,
            type: HostProcessType::Pipe,
            restart: RestartPolicy::Never,
            argv: [
                'sh',
                '-c',
                'exec '.self::EXECUTABLE.' login status 2>&1',
            ],
            environment: ["CODEX_HOME={$folder}"],
            folder: $start->workFolder,
            inherit: [
                'HOME',
                'PATH',
            ],
        );
    }

    /**
     * Codex names how it is signed in, by ChatGPT or by an API key, in the account folder the probe ran on; nothing else
     * of what it printed is read.
     */
    public function hasAcceptedSignIn(string $printed, string $accountFolder): bool
    {
        return str_contains($printed, self::SIGNED_IN) && $accountFolder !== '';
    }

    /**
     * Refuses an extra argument that would undo the profile: one that turns an agent feature back on or changes where
     * a tool runs.
     *
     * @param  list<string>  $arguments
     *
     * @throws ProfileRefused
     */
    public function assertNoContraryArgument(array $arguments): void
    {
        foreach ($arguments as $argument) {
            $isContrary = str_starts_with($argument, '--dangerously')
                || in_array($argument, self::CONTRARY_ARGUMENTS, true);

            if ($isContrary) {
                throw ProfileRefused::contraryArgument($argument, 'would undo the codex profile');
            }

            foreach (self::AGENT_FEATURES as $feature) {
                if (str_contains($argument, $feature)) {
                    throw ProfileRefused::contraryArgument($argument, "touches the agent feature {$feature}");
                }
            }

            foreach (self::ROUTE_SETTINGS as $setting) {
                if (self::changes($argument, $setting)) {
                    throw ProfileRefused::contraryArgument($argument, "changes {$setting}, which the profile fixes");
                }
            }
        }
    }

    private static function changes(string $argument, string $setting): bool
    {
        return $argument === $setting
            || str_contains($argument, $setting.'=')
            || str_starts_with($argument, $setting.'.');
    }

    /**
     * The arguments of 0.165.0: exec for a turn, a resume only by the conversation Codex acknowledged, the sandbox, no
     * approval asked in the terminal, the model and effort, JSON events for a turn, and every agent feature off.
     *
     * @return list<string>
     */
    private function arguments(DriverStart $start): array
    {
        $isTurn = $start->isTurn();
        $arguments = $isTurn ? ['exec'] : [];

        // codex exec resume takes none of exec's options, so a turn's resume names the thread after them.
        if ($start->isResume && ! $isTurn) {
            $arguments = [...$arguments, 'resume', $start->sessionId];
        }

        $arguments = [...$arguments, '--sandbox', self::SANDBOX];

        // In the terminal Codex asks no user: the journal's hook decides each call. A turn never asks.
        if (! $isTurn) {
            $arguments = [...$arguments, '--ask-for-approval', 'never'];
        }

        if ($start->model !== null) {
            $arguments = [...$arguments, '-m', $start->model];
        }

        if ($start->effort !== null) {
            $arguments = [...$arguments, '-c', "model_reasoning_effort={$start->effort}"];
        }

        if ($isTurn) {
            $arguments = [...$arguments, '--json', '--skip-git-repo-check'];
        }

        foreach (self::AGENT_FEATURES as $feature) {
            $arguments = [...$arguments, '-c', "features.{$feature}=false"];
        }

        if ($start->isResume && $isTurn) {
            $arguments = [...$arguments, 'resume', $start->sessionId];
        }

        if ($start->prompt === null) {
            return $arguments;
        }

        return [
            ...$arguments,
            $start->prompt,
        ];
    }

    /**
     * The isolated home of a start with no account: a config.toml with every agent feature off, and, with a hook
     * command, the hooks.json that relays every native event and the config tables that trust each hook.
     *
     * @return list<PlanFile>
     */
    private function settingsFiles(DriverStart $start): array
    {
        $features = implode("\n", array_map(fn (string $feature) => "{$feature} = false", self::AGENT_FEATURES));
        $config = "[features]\n{$features}\n";

        if ($start->hookCommand === null) {
            return [new PlanFile('config.toml', $config)];
        }

        $command = str_ends_with(trim($start->hookCommand), ' '.self::HOOK_NAME)
            ? $start->hookCommand
            : $start->hookCommand.' '.self::HOOK_NAME;

        $hookFile = self::SETTINGS_FOLDER.'/hooks.json';

        return [
            new PlanFile('hooks.json', self::encode(['hooks' => $this->hooks($command)])),
            new PlanFile('config.toml', $config.self::trustTables($hookFile, $command)),
        ];
    }

    /**
     * @return array<string, list<array<string, mixed>>>
     */
    private function hooks(string $command): array
    {
        $hook = [['hooks' => [['type' => 'command', 'command' => $command]]]];

        return array_fill_keys(array_keys(self::HOOK_EVENTS), $hook);
    }

    /**
     * The [hooks.state] tables that mark each hook trusted, hashed the way Codex hashes a command hook's identity, so
     * the hooks run without a trust prompt.
     */
    private static function trustTables(string $hookFile, string $command): string
    {
        $tables = '';

        foreach (self::HOOK_EVENTS as [$key, $timeout]) {
            // Codex hashes the identity with its keys in order, as Go's encoding of a map writes them.
            $identity = [
                'event_name' => $key,
                'hooks' => [[
                    'async' => false,
                    'command' => $command,
                    'timeout' => $timeout,
                    'type' => 'command',
                ]],
            ];

            $digest = hash('sha256', json_encode($identity, JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES));
            $name = json_encode("{$hookFile}:{$key}:0:0", JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES);

            $tables .= <<<TOML

                [hooks.state.{$name}]
                enabled = true
                trusted_hash = "sha256:{$digest}"

                TOML;
        }

        return $tables;
    }

    /**
     * @param  array<string, mixed>  $value
     */
    private static function encode(array $value): string
    {
        return json_encode($value, JSON_THROW_ON_ERROR | JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    }
}
