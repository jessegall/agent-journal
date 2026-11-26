<?php

declare(strict_types=1);

namespace App\Support\Drivers\Profiles;

use App\Contracts\Drivers\PinnedBuilds;
use App\Data\Accounts\ClaudeStatusData;
use App\Enums\Hosts\HostProcessPurpose;
use App\Enums\Hosts\HostProcessType;
use App\Enums\Hosts\RestartPolicy;
use App\Exceptions\BuildNotPinned;
use App\Exceptions\ProfileRefused;
use App\Support\DefaultDrivers;
use App\Support\Drivers\Processes\StatusLineLimits;
use App\Values\DriverAccount;
use App\Values\DriverStart;
use App\Values\HostProcessPlan;
use App\Values\PlanFile;
use JsonException;

/**
 * How the journal starts the pinned build of Claude Code: isolated settings, no user, project or local settings, no MCP
 * server but the journal's, an explicit tool set without any route that starts another agent, and exact session ids.
 * The host writes its settings files into the process's own files folder and knows nothing else of the driver.
 */
final readonly class ClaudeCodeProfile
{
    /**
     * The driver's executable, as it is installed on every host.
     */
    public const string EXECUTABLE = 'claude';

    /**
     * The pinned build in the host's protected installation, which every account start runs.
     */
    private const string INSTALLED_EXECUTABLE = '{host:INSTALLATION}/bin/claude';

    /**
     * The evidence-checked tool inventory; it leaves out every tool that starts or reaches another agent.
     */
    public const array ALLOWED_TOOLS = [
        'Bash',
        'Read',
        'Edit',
        'Write',
        'NotebookEdit',
        'WebFetch',
        'WebSearch',
        'ToolSearch',
    ];

    /**
     * The native routes to another agent, denied by name on top of the explicit set.
     */
    public const array DELEGATION_TOOLS = [
        'Agent',
        'Task',
        'Workflow',
        'SendMessage',
        'ListAgents',
        'RemoteTrigger',
        'Skill',
    ];

    /**
     * The tools a headless turn runs without asking, as nobody is there to answer: files, the journal and read-only
     * git.
     */
    private const array ALLOWED_WITHOUT_ASKING = [
        'Read',
        'Edit',
        'Write',
        'NotebookEdit',
        'Bash(journal:*)',
        'Bash(ls:*)',
        'Bash(git status:*)',
        'Bash(git diff:*)',
        'Bash(git log:*)',
    ];

    /**
     * Agent drivers a shell command could start as an unseen child; Bash may not run them.
     */
    private const array NESTED_DRIVERS = [
        'Bash(claude:*)',
        'Bash(codex:*)',
        'Bash(*claude -p*)',
        'Bash(*codex exec*)',
    ];

    /**
     * The hook events the journal answers.
     */
    private const array HOOK_EVENTS = [
        'SessionStart',
        'UserPromptSubmit',
        'PreToolUse',
        'PostToolUse',
        'Stop',
        'SessionEnd',
    ];

    /**
     * The arguments that would undo the profile, refused on their own and as name=value.
     */
    private const array CONTRARY_ARGUMENTS = [
        '--allowedTools',
        '--allowed-tools',
        '--tools',
        '--agents',
        '--setting-sources',
        '--continue',
        '-c',
        '--mcp-config',
        '--bare',
        '--permission-mode',
    ];

    /**
     * The names a protected start fixes, refused anywhere in an argument.
     */
    private const array FIXED_NAMES = [
        'CLAUDE_CODE_SHELL',
        'shellPrefix',
        'CLAUDE_CONFIG_DIR',
    ];

    /**
     * The host's own variables a driver needs to run, draw and read text; no other host variable reaches it.
     */
    private const array PLATFORM_VARIABLES = [
        'LANG',
        'LC_ALL',
        'LC_CTYPE',
        'LC_MESSAGES',
        'TERM',
        'COLORTERM',
        'TZ',
        'USER',
        'LOGNAME',
        'SHELL',
    ];

    /**
     * Every session runs in this mode: Claude Code asks nobody before a tool call.
     */
    private const string NEVER_ASKS = 'bypassPermissions';

    /**
     * The normal buffer, the one every recording of the build was made on.
     */
    private const string NORMAL_BUFFER = 'CLAUDE_CODE_DISABLE_ALTERNATE_SCREEN=1';

    /**
     * The shell bridge of a protected start, which hands every command, unparsed, to the executor's user.
     */
    private const string PROTECTED_SHELL = '/opt/journal/shell/bash';

    /**
     * The part of an account start's PATH outside the protected installation.
     */
    private const string SYSTEM_PATH = '/usr/bin:/bin:/usr/sbin:/sbin';

    /**
     * The name the hook relay is told the driver by.
     */
    private const string HOOK_NAME = 'claude-code';

    /**
     * The journal's MCP server: its name, its one allow rule, and the client's timeouts in milliseconds.
     */
    private const string JOURNAL_SERVER = 'journal';

    private const string JOURNAL_TOOLS = 'mcp__journal__*';

    private const int JOURNAL_TIMEOUT_MS = 30000;

    private const string MCP_START_TIMEOUT_MS = '15000';

    private const string MCP_TOOL_TIMEOUT_MS = '30000';

    private const string SETTINGS = '{folder:files}/settings.json';

    private const string MCP_CONFIG = '{folder:files}/mcp.json';

    private const string HOME_FOLDER = 'home';

    /**
     * The sign-in methods the journal accepts for an account, as `claude auth status --json` names them.
     */
    private const array SIGN_IN_METHODS = [
        'claude.ai',
        'oauth_token',
        'api_key_helper',
    ];

    /**
     * The plan file a turn's Seatbelt profile is written to.
     */
    private const string SEATBELT_PROFILE = 'session.sb';

    public function __construct(private PinnedBuilds $builds) {}

    public function build(): string
    {
        return $this->builds->versionOf(DefaultDrivers::CLAUDE_CODE);
    }

    public function assertPinnedBuild(string $printed): void
    {
        $version = trim($printed);

        if (! str_starts_with($version, $this->build().' ')) {
            throw BuildNotPinned::of(self::EXECUTABLE, $version, $this->build());
        }
    }

    public function startPlan(DriverStart $start): HostProcessPlan
    {
        $account = $start->account;
        $files = [new PlanFile('settings.json', $this->encode($this->settings($start)))];

        if ($account?->loadsJournalServer() === true) {
            $files[] = new PlanFile('mcp.json', $this->journalDescriptor($account));
        }

        $isSeatbelted = $start->isTurn() && $account?->isSeatbelted() === true;

        if ($isSeatbelted) {
            $profile = $this->seatbeltProfile((string) $account->folder, $start->workFolder);
            $files[] = new PlanFile(self::SEATBELT_PROFILE, $profile);
        }

        return new HostProcessPlan(
            purpose: $start->isTurn() ? HostProcessPurpose::AgentTurn : HostProcessPurpose::AgentTerminal,
            type: $start->type,
            restart: RestartPolicy::Never,
            argv: [
                $account === null ? self::EXECUTABLE : self::INSTALLED_EXECUTABLE,
                ...$this->arguments($start),
            ],
            environment: $this->environment($start),
            folder: $start->workFolder,
            files: $files,
            folders: $account === null ? [] : [
                self::HOME_FOLDER,
                ...$this->emptyFolders($account),
            ],
            inherit: $account === null ? [
                ...self::PLATFORM_VARIABLES,
                'HOME',
                'PATH',
            ] : self::PLATFORM_VARIABLES,
            sideSockets: self::readsStatusLine($start) ? [StatusLineLimits::SOCKET] : [],
            seatbelt: $isSeatbelted ? self::SEATBELT_PROFILE : null,
            readFiles: $account === null ? [] : $account->recipe->readFiles,
        );
    }

    /**
     * The Seatbelt profile one turn and every tool it starts run under: they cannot read or write another workspace's
     * history in the account folder, nor see or signal a process outside the turn, which Claude Code's own sandbox
     * does not close.
     */
    public function seatbeltProfile(string $accountFolder, string $workFolder): string
    {
        foreach ([
            $accountFolder,
            $workFolder,
        ] as $folder) {
            if (! str_starts_with($folder, '/') || strpbrk($folder, "\"\\\n") !== false) {
                throw ProfileRefused::unresolvedSetting("the Seatbelt folder {$folder} is not a plain absolute path");
            }
        }

        $history = rtrim($accountFolder, '/').'/projects';

        $ownHistory = $history.'/'.strtr(rtrim($workFolder, '/'), [
            '/' => '-',
            '.' => '-',
        ]);

        return <<<SB
            (version 1)
            (allow default)
            (deny file-read* file-write* (subpath "{$history}"))
            (allow file-read* file-write* (subpath "{$ownHistory}"))
            (deny process-info*)
            (allow process-info* (target same-sandbox))
            (deny signal)
            (allow signal (target same-sandbox))

            SB;
    }

    /**
     * The short process that prints whether the start's account is signed in, in the start's own environment.
     */
    public function signInProbe(DriverStart $start): HostProcessPlan
    {
        $account = $start->account ?? throw ProfileRefused::unresolvedSetting('no account to check the sign-in of');

        return new HostProcessPlan(
            purpose: HostProcessPurpose::SignInProbe,
            type: HostProcessType::Pipe,
            restart: RestartPolicy::Never,
            argv: [
                self::INSTALLED_EXECUTABLE,
                'auth',
                'status',
                '--json',
            ],
            environment: $this->environment($start),
            folder: $start->workFolder,
            folders: [
                self::HOME_FOLDER,
                ...$this->emptyFolders($account),
            ],
            inherit: self::PLATFORM_VARIABLES,
            readFiles: $account->recipe->readFiles,
        );
    }

    /**
     * Whether what the sign-in probe printed is a sign-in by a method the journal accepts, kept in exactly the
     * account's own folder; nothing else of it is read.
     */
    public function hasAcceptedSignIn(string $printed, string $accountFolder): bool
    {
        try {
            $status = ClaudeStatusData::from(json_decode($printed, true, flags: JSON_THROW_ON_ERROR));
        } catch (JsonException) {
            return false;
        }

        return $status->isLoggedIn
            && in_array($status->authMethod, self::SIGN_IN_METHODS, true)
            && $status->configDirectory !== null
            && rtrim($status->configDirectory, '/') === rtrim($accountFolder, '/');
    }

    public function versionProbe(string $workFolder): HostProcessPlan
    {
        return new HostProcessPlan(
            purpose: HostProcessPurpose::BuildProbe,
            type: HostProcessType::Pipe,
            restart: RestartPolicy::Never,
            argv: [
                self::INSTALLED_EXECUTABLE,
                '--version',
            ],
            environment: [],
            folder: $workFolder,
            inherit: [
                ...self::PLATFORM_VARIABLES,
                'HOME',
                'PATH',
            ],
        );
    }

    /**
     * Refuses an extra argument that would undo the profile, such as one that turns a delegation tool back on.
     *
     * @param  list<string>  $arguments
     *
     * @throws ProfileRefused
     */
    public function assertNoContraryArgument(array $arguments): void
    {
        foreach ($arguments as $argument) {
            foreach (self::CONTRARY_ARGUMENTS as $refused) {
                if ($argument === $refused || str_starts_with($argument, $refused.'=')) {
                    throw ProfileRefused::contraryArgument($argument, 'would undo the claude profile');
                }
            }

            foreach ([
                ...self::FIXED_NAMES,
                ...self::DELEGATION_TOOLS,
            ] as $name) {
                if (str_contains($argument, $name)) {
                    throw ProfileRefused::contraryArgument($argument, "names {$name}, which the profile fixes");
                }
            }
        }
    }

    /**
     * @return list<string>
     */
    private function arguments(DriverStart $start): array
    {
        $arguments = ['--settings', self::SETTINGS, '--setting-sources', ''];

        if ($start->account?->loadsJournalServer() !== false) {
            $arguments[] = '--strict-mcp-config';
        }

        $arguments = [
            ...$arguments,
            '--agents', '{}',
            '--tools', implode(',', self::ALLOWED_TOOLS),
            '--disallowedTools', ...self::DELEGATION_TOOLS,
        ];

        if ($start->account?->loadsJournalServer() === true) {
            $arguments = [...$arguments, '--mcp-config', self::MCP_CONFIG];
        }

        if ($start->model !== null) {
            $arguments = [...$arguments, '--model', $start->model];
        }

        $arguments = [...$arguments, $start->isResume ? '--resume' : '--session-id', $start->sessionId];

        if ($start->isTurn()) {
            $arguments = [...$arguments, '--print', '--output-format', 'stream-json', '--verbose'];
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
     * The start's own variables; the host adds the platform variables it has. An account start gets a home of its
     * own, a PATH of the protected installation, an empty folder for each variable its recipe names and its recipe's
     * settings, never a variable the recipe removes.
     *
     * @return list<string>
     */
    private function environment(DriverStart $start): array
    {
        $account = $start->account;
        $environment = [...$this->accountEnvironment($account), self::NORMAL_BUFFER];

        if ($account?->loadsJournalServer() === true) {
            $environment = [
                ...$environment,
                'MCP_TIMEOUT='.self::MCP_START_TIMEOUT_MS,
                'MCP_TOOL_TIMEOUT='.self::MCP_TOOL_TIMEOUT_MS,
            ];
        }

        if ($account !== null) {
            $environment[] = 'JOURNAL_START_REF='.$account->startReference;
        }

        if ($account?->isProtected === true) {
            $environment = [...$environment, 'CLAUDE_CODE_SHELL='.self::PROTECTED_SHELL, 'IS_SANDBOX=1'];
        }

        return $environment;
    }

    /**
     * @return list<string>
     */
    private function accountEnvironment(DriverAccount|null $account): array
    {
        if ($account === null) {
            return [];
        }

        $recipe = $account->recipe;

        $environment = [
            'HOME={folder:'.self::HOME_FOLDER.'}',
            'PATH={host:INSTALLATION}/journal/tools/accounts/no-keychain:{host:INSTALLATION}/bin:'.self::SYSTEM_PATH,
            ...array_map(
                fn (string $name) => "{$name}={folder:".self::emptyFolderOf($name).'}',
                $recipe->emptyFolderVariables,
            ),
            ...array_map(fn ($setting) => "{$setting->name}={$setting->settingText}", $recipe->environment),
        ];

        return array_values(array_filter(
            $environment,
            fn (string $entry) => ! in_array(strstr($entry, '=', true), $recipe->removedVariables, true),
        ));
    }

    /**
     * @return list<string>
     */
    private function emptyFolders(DriverAccount $account): array
    {
        return array_map(self::emptyFolderOf(...), $account->recipe->emptyFolderVariables);
    }

    private static function emptyFolderOf(string $variable): string
    {
        return 'empty-'.strtolower($variable);
    }

    /**
     * @return array<string, mixed>
     */
    private function settings(DriverStart $start): array
    {
        $settings = [
            'permissions' => [
                'allow' => self::ALLOWED_WITHOUT_ASKING,
                'deny' => [...self::DELEGATION_TOOLS, ...self::NESTED_DRIVERS],
                'defaultMode' => self::NEVER_ASKS,
            ],
            // The mode's own warning is answered here once, so no session opens on it.
            'skipDangerousModePermissionPrompt' => true,
        ];

        if ($start->effort !== null) {
            $settings['effortLevel'] = $start->effort;
        }

        if ($start->hookCommand !== null) {
            $settings['hooks'] = $this->hooks($start->hookCommand, $start->account !== null);
        }

        $account = $start->account;

        if ($account === null) {
            return $settings;
        }

        if ($account->loadsJournalServer()) {
            $settings['permissions']['allow'] = [
                ...self::ALLOWED_WITHOUT_ASKING,
                self::JOURNAL_TOOLS,
            ];
        }

        $settings = new ClaudeSettingsMerge($settings)->withProtection($account->recipe->protectionSettings);

        if (self::readsStatusLine($start)) {
            $settings = $this->withStatusLine($settings);
        }

        if ($account->isProtected) {
            // Bubblewrap cannot make its namespaces in the agent container, and every command already runs as the
            // executor's user through the shell bridge, which with the container is the boundary there.
            $settings['sandbox'] = ['enabled' => false];
        }

        $this->requireBoundary($settings, $account->isProtected);

        return $settings;
    }

    /**
     * A terminal on an account reports its limit windows through its status line; a headless turn prints them itself.
     */
    private static function readsStatusLine(DriverStart $start): bool
    {
        return $start->account !== null && ! $start->isTurn();
    }

    /**
     * The status line hands its input to the side socket the journal reads the windows from. A status line the
     * settings already hold runs after it on the same input, so it still renders; one that is no command stays as it is
     * and nothing is read.
     *
     * @param  array<string, mixed>  $settings
     * @return array<string, mixed>
     */
    private function withStatusLine(array $settings): array
    {
        $reader = '{host:JOURNAL_AGENT} status-line --relay {folder:sockets}/'.StatusLineLimits::SOCKET;
        $existing = $settings['statusLine'] ?? null;

        if ($existing === null) {
            return [
                ...$settings,
                'statusLine' => [
                    'type' => 'command',
                    'command' => $reader,
                ],
            ];
        }

        $isCommand = is_array($existing) && ($existing['type'] ?? null) === 'command';

        if (! $isCommand || ! is_string($existing['command'] ?? null)) {
            return $settings;
        }

        $composed = $reader.' --then '.escapeshellarg($existing['command']);

        return [
            ...$settings,
            'statusLine' => [
                ...$existing,
                'command' => $composed,
            ],
        ];
    }

    /**
     * @return array<string, list<array{hooks: list<array{type: string, command: string}>}>>
     */
    private function hooks(string $command, bool $isAccountStart): array
    {
        if ($isAccountStart && ! self::isResolvedPath(explode(' ', trim($command))[0])) {
            throw ProfileRefused::unresolvedSetting("the hook command {$command}");
        }

        $relayed = str_ends_with(trim($command), ' '.self::HOOK_NAME) ? $command : $command.' '.self::HOOK_NAME;
        $hook = [['hooks' => [['type' => 'command', 'command' => $relayed]]]];

        return array_fill_keys(self::HOOK_EVENTS, $hook);
    }

    /**
     * Every account start runs without permission questions and, unless protected, with every tool in Claude Code's
     * sandbox; what a tool may do is decided by the journal's hook, the deny rules and the sandbox or the container.
     *
     * @param  array<string, mixed>  $settings
     */
    private function requireBoundary(array $settings, bool $isProtected): void
    {
        $permissions = $settings['permissions'];
        $sandbox = $settings['sandbox'] ?? [];

        $isBypassDisabled = ($permissions['disableBypassPermissionsMode'] ?? null) === 'disable';

        if ($permissions['defaultMode'] !== self::NEVER_ASKS || $isBypassDisabled) {
            throw ProfileRefused::asksUser();
        }

        $isSandboxed = ($sandbox['enabled'] ?? null) === true
            && ($sandbox['allowUnsandboxedCommands'] ?? null) === false;

        if (! $isProtected && ! $isSandboxed) {
            throw ProfileRefused::toolsOutsideSandbox();
        }
    }

    /**
     * The journal's server alone, started by a resolved path, with no token, environment or placeholder of the model's.
     */
    private function journalDescriptor(DriverAccount $account): string
    {
        $server = $account->journalServer ?? throw ProfileRefused::unresolvedSetting('no journal MCP server');

        foreach ([
            $server->command,
            ...$server->arguments(),
        ] as $path) {
            if (! self::isResolvedPath($path)) {
                throw ProfileRefused::unresolvedSetting("the journal MCP path {$path}");
            }
        }

        return $this->encode(['mcpServers' => [self::JOURNAL_SERVER => [
            'type' => 'stdio',
            'command' => $server->command,
            'args' => $server->arguments(),
            'timeout' => self::JOURNAL_TIMEOUT_MS,
        ]]]);
    }

    /**
     * A path the driver cannot resolve from a folder the model controls: absolute and clean, or under a folder the
     * host names itself, with no other placeholder or variable in it.
     */
    private static function isResolvedPath(string $path): bool
    {
        $rest = (string) preg_replace('/^\{(?:host:[A-Z_]+|folder:[a-z-]+)\}/', '', $path, 1, $named);

        if ($named === 1 && $rest === '') {
            return true;
        }

        return str_starts_with($rest, '/') && preg_match('#[$%{}<>]|/\.\.?(/|$)|//#', $rest) === 0;
    }

    /**
     * @param  array<string, mixed>  $value
     */
    private function encode(array $value): string
    {
        return json_encode($value, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);
    }
}
