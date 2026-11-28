<?php

declare(strict_types=1);

namespace Tests\Unit\Drivers;

use App\Accounts\AccountStartRecipe;
use App\Accounts\StartSetting;
use App\Agents\Drivers\ClaudeCode\ClaudeAccountProtection;
use App\Agents\Drivers\DefaultDrivers;
use App\Agents\Drivers\Enums\ExecutablePlace;
use App\Agents\Drivers\Hooks\HookReplies;
use App\Agents\Drivers\Setup\DriverProfile;
use App\Agents\Exceptions\BuildNotPinned;
use App\Agents\Exceptions\ProfileRefused;
use App\Agents\Values\JournalServer;
use App\Files\Contracts\Files;
use App\Files\Enums\Place;
use App\Hosts\Enums\HostProcessPurpose;
use App\Hosts\Enums\RestartPolicy;
use App\Hosts\Protocol\HostProcessType;
use App\Recordings\Enums\Wire;
use App\Recordings\RecordingOpening;
use App\Recordings\Recordings;
use App\Sessions\Enums\TransportProfileType;
use App\Values\DriverAccount;
use App\Values\DriverStart;
use App\Values\FilePath;
use App\Values\HostProcessPlan;
use Tests\Support\Recordings\RecordedProgram;
use Tests\TestCase;

/**
 * The PHP profile plans a headless Claude Code turn exactly as the pinned build was recorded running it, apart from
 * paths and ids; it refuses a build other than the pinned one, account settings that would undo it, and contrary
 * arguments.
 */
final class ClaudeCodeProfileTest extends TestCase
{
    private const string MODEL = 'chosen-model';

    private const string EFFORT = 'high';

    public function test_a_headless_turn_is_planned_as_each_recorded_turn_ran(): void
    {
        foreach (['headless-turn', 'one-shot-allowlist'] as $name) {
            foreach ($this->recordedHeadlessStarts($name) as $recorded) {
                $this->assertHeadlessStart($recorded);
            }
        }
    }

    private function assertHeadlessStart(RecordingOpening $recorded): void
    {
        // The contained recording starts after the init's -- and mounts the account's MCP configuration.
        $arguments = array_slice($recorded->argv, 1);
        $resume = array_search('--resume', $arguments, true);
        $conversation = $resume === false ? array_search('--session-id', $arguments, true) : $resume;
        $start = new DriverStart(
            sessionId: $arguments[$conversation + 1],
            type: HostProcessType::Pipe,
            workFolder: $recorded->folder,
            prompt: $arguments[array_key_last($arguments)],
            isResume: $resume !== false,
            model: $arguments[array_search('--model', $arguments, true) + 1],
            effort: self::EFFORT,
        );
        $plan = $this->profile()->startPlan($start);
        $arguments[array_search('--settings', $arguments, true) + 1] = '{folder:files}/settings.json';
        array_splice($arguments, (int) array_search('--mcp-config', $arguments, true), 2);

        $this->journal->assertResult(
            [$arguments, [], HostProcessPurpose::AgentTurn],
            [$plan->argv, array_diff($this->namesOf($plan), $recorded->environmentNames()), $plan->purpose],
        );
    }

    public function test_a_headless_turn_uses_the_images_shell_and_delegation_rules(): void
    {
        $managed = $this->journal->service(Files::class)->readJson(
            FilePath::in(Place::Project, '.docker/drivers/claude-code/managed-settings.json'),
        );
        $settings = $this->settingsOf($this->profile()->startPlan($this->turn()));
        $shell = fn (string $rule) => str_starts_with($rule, 'Bash(');
        $withoutPaths = fn (string $rule) => ! str_contains($rule, '(//');

        $this->journal->assertResult(
            [
                array_values(array_filter($managed['permissions']['allow'], $shell)),
                [...array_filter($managed['permissions']['deny'], $withoutPaths), $this->replyKeyRule()],
                $managed['permissions']['defaultMode'],
            ],
            [
                array_values(array_filter($settings['permissions']['allow'], $shell)),
                $settings['permissions']['deny'],
                $settings['permissions']['defaultMode'],
            ],
        );
    }

    public function test_only_the_pinned_build_is_accepted(): void
    {
        $profile = $this->profile();
        $recordings = $this->journal->service(Recordings::class);
        $version = RecordedProgram::versionOf($recordings, DefaultDrivers::CLAUDE_CODE, 'claude');
        $profile->assertPinnedBuild($version, $profile->build());

        $this->journal->assertRefused(
            BuildNotPinned::class,
            fn () => $profile->assertPinnedBuild(str_replace($profile->build(), '2.1.400', $version), $profile->build()),
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
            model: self::MODEL,
            effort: self::EFFORT,
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
                false,
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
                array_key_exists('sandbox', $settings),
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
        $terminal = new DriverStart($id, HostProcessType::Terminal, '/work', account: $this->account(), model: self::MODEL, effort: self::EFFORT);

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
            model: self::MODEL,
            effort: self::EFFORT,
        );

        $plan = $this->profile()->startPlan($start);
        $arguments[array_search('--settings', $arguments, true) + 1] = '{folder:files}/settings.json';
        // The recording ran at the driver's own model; every start names its model now.
        array_splice($arguments, (int) array_search('--session-id', $arguments, true), 0, ['--model', self::MODEL]);

        $this->journal->assertResult(
            [$arguments, HostProcessPurpose::AgentTerminal],
            [$plan->argv, $plan->purpose],
        );
    }

    public function test_an_account_terminal_hands_its_status_line_to_a_side_socket(): void
    {
        $terminal = new DriverStart('3d9b1c22-7e40-4a51-9f63-5b8e2a1c0d77', HostProcessType::Terminal, '/work', account: $this->account(), model: self::MODEL, effort: self::EFFORT);

        $plan = $this->profile()->startPlan($terminal);
        $turn = $this->profile()->startPlan($this->turn($this->account()));

        $this->journal->assertResult(
            [['status'], '{host:JOURNAL_RUNNER} status-line --relay {folder:sockets}/status', [], false],
            [
                $plan->sideSockets,
                $this->settingsOf($plan)['statusLine']['command'],
                $turn->sideSockets,
                array_key_exists('statusLine', $this->settingsOf($turn)),
            ],
        );
    }

    public function test_an_account_turn_reads_its_token_from_the_file_its_recipe_names(): void
    {
        $this->journal->assertResult(['/accounts/a/token'], $this->profile()->startPlan($this->turn(new DriverAccount(
            $this->recipe(readFiles: ['/accounts/a/token']),
            'start-1',
            new JournalServer('/i/bin/php', '/i/journal-mcp'),
        )))->readFiles);
    }

    public function test_account_settings_that_would_undo_the_profile_refuse_the_start(): void
    {
        $asking = '{"permissions":{"defaultMode":"default"}}';

        $this->journal->assertRefused(
            ProfileRefused::class,
            fn () => $this->profile()->startPlan($this->turn($this->account($asking))),
        );

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
        return new DriverStart('3d9b1c22-7e40-4a51-9f63-5b8e2a1c0d77', HostProcessType::Pipe, '/work', 'Run: ls.', account: $account, model: self::MODEL, effort: self::EFFORT);
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
            driverVersion: '2.1.332',
            binaryDigest: '',
            arrangement: 'local',
            protectionSettings: $protection ?? ClaudeAccountProtection::settingsFor('/accounts/a', '/accounts'),
            transportProfile: TransportProfileType::Mcp,
            readFiles: $readFiles,
        );
    }

    /**
     * @return list<RecordingOpening>
     */
    private function recordedHeadlessStarts(string $name): array
    {
        $recordings = $this->journal->service(Recordings::class);
        $scenario = $recordings->scenario(DefaultDrivers::CLAUDE_CODE, $name);
        $starts = [];

        foreach ($scenario->exchangesOn(Wire::Driver) as $exchange) {
            $opening = $scenario->exchange($exchange)->opening;

            if (in_array('--print', $opening->argv, true)) {
                $starts[] = $opening;
            }
        }

        $this->assertNotEmpty($starts);

        return $starts;
    }

    /** @return array{working_folder: string, arguments: list<string>, environment_names: list<string>} */
    private function recordedStart(string $name): array
    {
        $path = FilePath::in(Place::Project, "resources/recordings/claude-code/2.1.323/{$name}/fixture.json");

        return $this->journal->service(Files::class)->readJson($path)['initial_state'];
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

    /**
     * The deny rule that keeps the hook's reply key from the file tools, which the recording predates.
     */
    private function replyKeyRule(): string
    {
        return 'Read({folder:files}/'.HookReplies::KEY_FILE.')';
    }
}
