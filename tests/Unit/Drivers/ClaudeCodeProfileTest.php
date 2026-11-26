<?php

declare(strict_types=1);

namespace Tests\Unit\Drivers;

use App\Agents\Drivers\ClaudeCode\ClaudeAccountProtection;
use App\Agents\Drivers\DefaultDrivers;
use App\Agents\Drivers\Setup\DriverProfile;
use App\Enums\Drivers\ExecutablePlace;
use App\Enums\Hosts\HostProcessPurpose;
use App\Enums\Hosts\HostProcessType;
use App\Enums\Hosts\RestartPolicy;
use App\Enums\Sessions\TransportProfileType;
use App\Exceptions\BuildNotPinned;
use App\Exceptions\ProfileRefused;
use App\Support\AccountStartRecipe;
use App\Support\StartSetting;
use App\Values\DriverAccount;
use App\Values\DriverStart;
use App\Values\HostProcessPlan;
use App\Values\JournalServer;
use Tests\TestCase;

/**
 * The PHP profile plans a headless Claude Code turn exactly as the pinned build was recorded running it, apart from
 * paths and ids; it refuses a build other than the pinned one, account settings that would undo it, and contrary
 * arguments.
 */
final class ClaudeCodeProfileTest extends TestCase
{
    private const string RECORDINGS = __DIR__.'/../../../resources/recordings/claude-code/2.1.323';

    /** How the driver prints its version, as its version probe shows it. */
    private const string PRINTED_VERSION = '%s (Claude Code)';

    public function test_a_headless_turn_is_planned_as_each_recorded_turn_ran(): void
    {
        foreach ([
            'turns/process-turn',
            'one-shot-allowlist',
        ] as $name) {
            $recorded = $this->recordedStart($name);
            $arguments = $recorded['arguments'];
            $start = new DriverStart(
                sessionId: $arguments[array_search('--session-id', $arguments, true) + 1],
                type: HostProcessType::Pipe,
                workFolder: $recorded['working_folder'],
                prompt: $arguments[array_key_last($arguments)],
            );

            $plan = $this->profile()->startPlan($start);
            $arguments[array_search('--settings', $arguments, true) + 1] = '{folder:files}/settings.json';

            $this->journal->assertResult(
                [$arguments, [], HostProcessPurpose::AgentTurn],
                [$plan->argv, array_diff($this->namesOf($plan), $recorded['environment_names']), $plan->purpose],
            );
        }
    }

    public function test_a_headless_turn_allows_and_denies_what_the_recorded_settings_did(): void
    {
        $recorded = json_decode(
            (string) file_get_contents(self::RECORDINGS.'/one-shot-allowlist/settings/settings.json'),
            true,
            flags: JSON_THROW_ON_ERROR,
        );

        $settings = $this->settingsOf($this->profile()->startPlan($this->turn()));

        $this->journal->assertResult(
            [$recorded['permissions']['allow'], $recorded['permissions']['deny'], 'bypassPermissions'],
            [
                $settings['permissions']['allow'],
                $settings['permissions']['deny'],
                $settings['permissions']['defaultMode'],
            ],
        );
    }

    public function test_only_the_pinned_build_is_accepted(): void
    {
        $profile = $this->profile();
        $profile->assertPinnedBuild(sprintf(self::PRINTED_VERSION, $profile->build())."\n");

        $this->journal->assertRefused(
            BuildNotPinned::class,
            fn () => $profile->assertPinnedBuild(sprintf(self::PRINTED_VERSION, '2.1.400')),
        );
        $this->journal->assertResult(
            [[
                '{host:INSTALLATION}/bin/claude',
                '--version',
            ], HostProcessPurpose::BuildProbe],
            [
                $profile->versionProbe('/work', ExecutablePlace::Host)->argv,
                $profile->versionProbe('/work', ExecutablePlace::Host)->purpose,
            ],
        );
    }

    public function test_a_connected_machine_runs_every_plan_from_its_sealed_program(): void
    {
        $profile = $this->profile();
        $start = new DriverStart(
            '3d9b1c22-7e40-4a51-9f63-5b8e2a1c0d77',
            HostProcessType::Pipe,
            '/work',
            'Run: ls.',
            account: $this->account(),
            executablePlace: ExecutablePlace::Sealed,
        );

        $this->journal->assertResult(
            array_fill(0, 3, '{host:CLAUDE_CODE_EXECUTABLE}'),
            [
                $profile->startPlan($start)->argv[0],
                $profile->versionProbe('/work', ExecutablePlace::Sealed)->argv[0],
                $profile->signInProbe($start)->argv[0],
            ],
        );
    }

    public function test_an_account_turn_loads_the_journal_server_and_keeps_the_accounts_protection(): void
    {
        $plan = $this->profile()->startPlan($this->turn($this->account()));
        $settings = $this->settingsOf($plan);
        $descriptor = json_decode($plan->files[1]->content, true, flags: JSON_THROW_ON_ERROR);

        $this->journal->assertResult(
            [
                [
                    '--mcp-config',
                    '{folder:files}/mcp.json',
                ],
                true,
                true,
                ['{host:INSTALLATION}/bin/journal-mcp'],
                [
                    'home',
                    'empty-anthropic_config_dir',
                ],
                true,
            ],
            [
                array_slice($plan->argv, array_search('--mcp-config', $plan->argv, true), 2),
                in_array('mcp__journal__*', $settings['permissions']['allow'], true),
                $settings['sandbox']['enabled'],
                $descriptor['mcpServers']['journal']['args'],
                $plan->folders,
                in_array('--strict-mcp-config', $plan->argv, true),
            ],
        );
        $this->journal->assertResult(
            [true, true, false],
            [
                in_array('ANTHROPIC_CONFIG_DIR={folder:empty-anthropic_config_dir}', $plan->environment, true),
                in_array('JOURNAL_START_REF=start-1', $plan->environment, true),
                in_array('ANTHROPIC_API_KEY=leaked', $plan->environment, true),
            ],
        );
    }

    public function test_an_account_terminal_is_healed_by_resuming_its_conversation_once_its_transcript_exists(): void
    {
        $id = '3d9b1c22-7e40-4a51-9f63-5b8e2a1c0d77';
        $terminal = new DriverStart($id, HostProcessType::Terminal, '/work', account: $this->account());

        $plan = $this->profile()->startPlan($terminal);
        $resumed = $plan->argv;
        $resumed[array_search('--session-id', $resumed, true)] = '--resume';

        $this->journal->assertResult(
            [RestartPolicy::OnCrash, $resumed, [
                'folder' => '/accounts/a/projects',
                'glob' => "*{$id}.jsonl",
            ]],
            [$plan->restart, $plan->restartArgv, $plan->restartWhenFile?->jsonSerialize()],
        );
    }

    public function test_a_terminal_is_planned_as_the_recorded_terminal_ran(): void
    {
        $recorded = $this->recordedStart('turns/terminal-turn');
        $arguments = $recorded['arguments'];
        $start = new DriverStart(
            sessionId: $arguments[array_search('--session-id', $arguments, true) + 1],
            type: HostProcessType::Terminal,
            workFolder: $recorded['working_folder'],
        );

        $plan = $this->profile()->startPlan($start);
        $arguments[array_search('--settings', $arguments, true) + 1] = '{folder:files}/settings.json';

        $this->journal->assertResult(
            [$arguments, HostProcessPurpose::AgentTerminal],
            [$plan->argv, $plan->purpose],
        );
    }

    public function test_an_account_terminal_hands_its_status_line_to_a_side_socket(): void
    {
        $terminal = new DriverStart('3d9b1c22-7e40-4a51-9f63-5b8e2a1c0d77', HostProcessType::Terminal, '/work', account: $this->account());

        $plan = $this->profile()->startPlan($terminal);
        $turn = $this->profile()->startPlan($this->turn($this->account()));

        $this->journal->assertResult(
            [['status'], '{host:JOURNAL_AGENT} status-line --relay {folder:sockets}/status', [], false],
            [
                $plan->sideSockets,
                $this->settingsOf($plan)['statusLine']['command'],
                $turn->sideSockets,
                array_key_exists('statusLine', $this->settingsOf($turn)),
            ],
        );
    }

    public function test_an_account_turn_on_the_host_runs_under_its_seatbelt_profile(): void
    {
        $account = new DriverAccount($this->recipe(), 'start-1', new JournalServer('/i/bin/php', '/i/journal-mcp'), folder: '/accounts/a');

        $plan = $this->profile()->startPlan($this->turn($account));
        $profile = $plan->files[array_key_last($plan->files)];

        $this->journal->assertResult(
            ['session.sb', 'session.sb', true, true],
            [
                $plan->seatbelt,
                $profile->name,
                str_contains($profile->content, '(deny file-read* file-write* (subpath "/accounts/a/projects"))'),
                str_contains($profile->content, '(allow file-read* file-write* (subpath "/accounts/a/projects/-work"))'),
            ],
        );
        $this->journal->assertResult(null, $this->profile()->startPlan($this->turn($this->account()))->seatbelt);
        $this->journal->assertResult(['/accounts/a/token'], $this->profile()->startPlan($this->turn(new DriverAccount(
            $this->recipe(readFiles: ['/accounts/a/token']),
            'start-1',
            new JournalServer('/i/bin/php', '/i/journal-mcp'),
        )))->readFiles);
        $this->journal->assertRefused(ProfileRefused::class, fn () => $this->profile()->startPlan($this->turn(new DriverAccount(
            $this->recipe(),
            'start-1',
            new JournalServer('/i/bin/php', '/i/journal-mcp'),
            folder: '/accounts/"a',
        ))));
    }

    public function test_account_settings_that_would_undo_the_profile_refuse_the_start(): void
    {
        $replacing = '{"permissions":{"defaultMode":"default"},"sandbox":{"enabled":true,"allowUnsandboxedCommands":false}}';
        $unsandboxed = '{"sandbox":{"enabled":false}}';

        foreach ([
            $replacing,
            $unsandboxed,
        ] as $protection) {
            $this->journal->assertRefused(
                ProfileRefused::class,
                fn () => $this->profile()->startPlan($this->turn($this->account($protection))),
            );
        }

        $this->journal->assertRefused(
            ProfileRefused::class,
            fn () => $this->profile()->startPlan($this->turn($this->account(server: new JournalServer('relative/journal-mcp')))),
        );
    }

    private function profile(): DriverProfile
    {
        return $this->journal->driverProfile(DefaultDrivers::CLAUDE_CODE);
    }

    private function turn(DriverAccount|null $account = null): DriverStart
    {
        return new DriverStart('3d9b1c22-7e40-4a51-9f63-5b8e2a1c0d77', HostProcessType::Pipe, '/work', 'Run: ls.', account: $account);
    }

    private function account(string|null $protection = null, JournalServer|null $server = null): DriverAccount
    {
        $recipe = $this->recipe($protection);

        return new DriverAccount($recipe, 'start-1', $server ?? new JournalServer('{host:INSTALLATION}/bin/php', '{host:INSTALLATION}/bin/journal-mcp'));
    }

    /**
     * @param  list<string>  $readFiles
     */
    private function recipe(string|null $protection = null, array $readFiles = []): AccountStartRecipe
    {
        return new AccountStartRecipe(
            environment: [
                new StartSetting('CLAUDE_CONFIG_DIR', '/accounts/a'),
                new StartSetting('ANTHROPIC_API_KEY', 'leaked'),
            ],
            emptyFolderVariables: ['ANTHROPIC_CONFIG_DIR'],
            removedVariables: ['ANTHROPIC_API_KEY'],
            startFlags: [],
            accountSettings: [],
            driverVersion: '2.1.323',
            binaryDigest: '',
            arrangement: 'local',
            protectionSettings: $protection ?? ClaudeAccountProtection::settingsFor('/accounts/a', '/accounts'),
            transportProfile: TransportProfileType::Mcp,
            readFiles: $readFiles,
        );
    }

    /**
     * @return array{working_folder: string, arguments: list<string>, environment_names: list<string>}
     */
    private function recordedStart(string $name): array
    {
        $fixture = json_decode((string) file_get_contents(self::RECORDINGS."/{$name}/fixture.json"), true, flags: JSON_THROW_ON_ERROR);

        return $fixture['initial_state'];
    }

    /**
     * @return list<string>
     */
    private function namesOf(HostProcessPlan $plan): array
    {
        return array_map(fn (string $entry) => (string) strstr($entry, '=', true), $plan->environment);
    }

    /**
     * @return array<string, mixed>
     */
    private function settingsOf(HostProcessPlan $plan): array
    {
        return json_decode($plan->files[0]->content, true, flags: JSON_THROW_ON_ERROR);
    }
}
