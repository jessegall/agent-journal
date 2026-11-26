<?php

declare(strict_types=1);

namespace App\Agents\Drivers\ClaudeCode;

use App\Agents\Drivers\Hooks\HookReplies;
use App\Agents\Drivers\StartConditions\AccountTerminal;
use App\Agents\Drivers\StartConditions\JournalServerAccount;
use App\Contracts\Drivers\PlanPart;
use App\Exceptions\ProfileRefused;
use App\Values\DriverStart;
use App\Values\HostPath;
use App\Values\PlanAddition;
use App\Values\PlanFile;
use App\Values\RelayedHookCommand;

/**
 * The one settings.json of a Claude Code start: no permission question, the journal's tools allowed where its server
 * loads, the hooks relayed to the journal, an account's protection merged in, the status line handed to its side
 * socket for an account terminal, and the boundary of the whole merged file checked.
 */
final readonly class ClaudeCodeSettingsFile implements PlanPart
{
    public const string NAME = 'settings.json';

    public const string PATH = '{folder:files}/'.self::NAME;

    private const string REPLY_KEY = '{folder:files}/'.HookReplies::KEY_FILE;

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
     * Every session runs in this mode: Claude Code asks nobody before a tool call.
     */
    private const string NEVER_ASKS = 'bypassPermissions';

    /**
     * The name the hook relay is told the driver by.
     */
    private const string HOOK_NAME = 'claude-code';

    private const string JOURNAL_TOOLS = 'mcp__journal__*';

    /**
     * @param  AccountTerminal  $statusLine  the start whose status line goes to its side socket, as StatusLineSocket
     * @param  JournalServerAccount  $journalServer  the start that loads the journal's server, as its mcp.json
     */
    public function __construct(private AccountTerminal $statusLine, private JournalServerAccount $journalServer) {}

    /**
     * The settings file of the start.
     *
     * @throws ProfileRefused
     */
    public function __invoke(DriverStart $start): PlanAddition
    {
        $content = json_encode($this->settings($start), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);

        return new PlanAddition([new PlanFile(self::NAME, $content)]);
    }

    /**
     * @return array<string, mixed>
     *
     * @throws ProfileRefused
     */
    private function settings(DriverStart $start): array
    {
        $settings = [
            'permissions' => [
                'allow' => ClaudeCodeTools::ALLOWED_WITHOUT_ASKING,
                // The key that seals the hook's reply file is the hook's alone (doc 135, Hook binary).
                'deny' => [
                    ...ClaudeCodeTools::DELEGATION,
                    ...ClaudeCodeTools::NESTED_DRIVERS,
                    'Read('.self::REPLY_KEY.')',
                ],
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

        if ($this->journalServer->holdsFor($start)) {
            $settings['permissions']['allow'] = [
                ...ClaudeCodeTools::ALLOWED_WITHOUT_ASKING,
                self::JOURNAL_TOOLS,
            ];
        }

        $settings = new ClaudeSettingsMerge($settings)->withProtection($account->recipe->protectionSettings);

        if ($this->statusLine->holdsFor($start)) {
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
     * @return array<string, mixed>
     */
    private function hooks(string $command, bool $isAccountStart): array
    {
        if ($isAccountStart && ! new HostPath(explode(' ', trim($command))[0])->isResolved()) {
            throw ProfileRefused::unresolvedSetting("the hook command {$command}");
        }

        $relayed = RelayedHookCommand::for($command, self::HOOK_NAME)->text;
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
}
