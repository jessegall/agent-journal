<?php

declare(strict_types=1);

namespace Tests\Unit\Drivers;

use App\Accounts\AccountStartRecipe;
use App\Agents\Drivers\Codex\CodexArguments;
use App\Agents\Drivers\DefaultDrivers;
use App\Agents\Drivers\Enums\ExecutablePlace;
use App\Agents\Drivers\Setup\DriverProfile;
use App\Agents\Exceptions\BuildNotPinned;
use App\Files\Contracts\Files;
use App\Hosts\Protocol\HostProcessType;
use App\Sessions\Enums\TransportProfileType;
use App\Values\DriverAccount;
use App\Values\DriverStart;
use Tests\Support\Recordings\TerminalCapture;
use Tests\TestCase;

/**
 * The PHP profile plans a Codex terminal exactly as the pinned build was recorded running it, apart from paths and
 * ids, and each headless turn as a codex exec of its own that a later turn resumes; it refuses another build and an
 * argument that would undo it.
 */
final class CodexProfileTest extends TestCase
{
    private const string MODEL = 'chosen-model';

    private const string EFFORT = 'high';

    private const string CONVERSATION = '019a0000-0000-7000-8000-000000000001';

    public function test_a_headless_turn_runs_a_codex_exec_of_its_own_and_a_later_turn_resumes_its_thread(): void
    {
        $first = new DriverStart(self::CONVERSATION, HostProcessType::Pipe, '/work', 'Run: ls.', false, self::MODEL, self::EFFORT);
        $later = new DriverStart(self::CONVERSATION, HostProcessType::Pipe, '/work', 'Again.', true, self::MODEL, self::EFFORT);

        $this->journal->assertResult(
            [
                ['codex', 'exec', '--json', '--skip-git-repo-check', '--dangerously-bypass-approvals-and-sandbox', '-m', self::MODEL],
                'Run: ls.',
                ['codex', 'exec', 'resume', self::CONVERSATION, '--json'],
                'Again.',
            ],
            [
                array_slice($this->profile()->startPlan($first)->argv, 0, 7),
                array_last($this->profile()->startPlan($first)->argv),
                array_slice($this->profile()->startPlan($later)->argv, 0, 5),
                array_last($this->profile()->startPlan($later)->argv),
            ],
        );
    }

    public function test_a_terminal_is_planned_as_the_recorded_terminals_ran_with_no_approval_or_sandbox(): void
    {
        $planned = [];
        $expected = [];

        foreach ([
            'terminal-turn',
            'model-choice',
            'first-start',
        ] as $name) {
            $recorded = $this->recordedStart($name);
            $start = new DriverStart(self::CONVERSATION, HostProcessType::Terminal, $recorded['working_folder'], model: self::MODEL, effort: self::EFFORT);
            $planned[] = $this->profile()->startPlan($start)->argv;
            // The recordings ran under Codex's own sandbox, which the journal never uses: their sandbox flag pair is the
            // one flag that skips every approval and sandbox now, and the rest is as they ran.
            $expected[] = [
                $recorded['arguments'][0],
                '--dangerously-bypass-approvals-and-sandbox',
                '-m',
                self::MODEL,
                '-c',
                'model_reasoning_effort='.self::EFFORT,
                ...array_slice($recorded['arguments'], 3),
            ];
        }

        $this->journal->assertResult($expected, $planned);
    }

    public function test_a_resumed_terminal_names_the_conversation_first(): void
    {
        $terminal = new DriverStart(self::CONVERSATION, HostProcessType::Terminal, '/work', isResume: true, model: self::MODEL, effort: self::EFFORT);

        $terminalArguments = $this->profile()->startPlan($terminal)->argv;

        $this->journal->assertResult(['codex', 'resume', self::CONVERSATION], array_slice($terminalArguments, 0, 3));
    }

    public function test_only_the_pinned_build_is_accepted(): void
    {
        $profile = $this->profile();
        $printed = fn (string $build) => sprintf('%s-cli %s', CodexArguments::EXECUTABLE, $build);
        $profile->assertPinnedBuild($printed($profile->build()).PHP_EOL, $profile->build());

        $this->journal->assertRefused(
            BuildNotPinned::class,
            fn () => $profile->assertPinnedBuild($printed('0.170.0'), $profile->build()),
        );
    }

    public function test_a_connected_machine_runs_every_plan_from_its_sealed_program(): void
    {
        $profile = $this->profile();
        $start = new DriverStart(
            self::CONVERSATION,
            HostProcessType::Terminal,
            '/work',
            account: $this->account(),
            executablePlace: ExecutablePlace::Sealed,
            model: self::MODEL,
            effort: self::EFFORT,
        );

        $this->journal->assertResult(
            ['{host:CODEX_EXECUTABLE}', '{host:CODEX_EXECUTABLE}'],
            [$profile->startPlan($start)->argv[0], $profile->versionProbe('/work', ExecutablePlace::Sealed)->argv[0]],
        );
    }

    public function test_a_start_with_no_account_trusts_each_hook_it_writes(): void
    {
        $start = new DriverStart(self::CONVERSATION, HostProcessType::Terminal, '/work', hookCommand: '/opt/journal/bin/hook', model: self::MODEL, effort: self::EFFORT);

        $files = $this->profile()->startPlan($start)->files;
        $config = $files[1]->content;

        $this->journal->assertResult(
            ['hooks.json', 'config.toml', 6, true],
            [
                $files[0]->name,
                $files[1]->name,
                substr_count($config, 'trusted_hash = "sha256:'),
                str_contains($files[0]->content, '/opt/journal/bin/hook codex'),
            ],
        );
    }

    /**
     * @return array{working_folder: string, arguments: list<string>, environment_names: list<string>}
     */
    private function recordedStart(string $name): array
    {
        $path = TerminalCapture::folderOf(DefaultDrivers::CODEX, $name)->child('fixture.json');
        $fixture = $this->journal->service(Files::class)->readJson($path);
        $state = $fixture['initial_state'];
        // The recorded argv starts with the program it ran; the plan's does too.
        $state['arguments'][0] = CodexArguments::EXECUTABLE;

        return $state;
    }

    private function account(): DriverAccount
    {
        return new DriverAccount(
            new AccountStartRecipe(
                environment: [],
                emptyFolderVariables: [],
                removedVariables: [],
                startFlags: [],
                accountSettings: [],
                driverVersion: '0.172.0',
                binaryDigest: '',
                arrangement: 'contained',
                protectionSettings: '',
                transportProfile: TransportProfileType::Cli,
                readFiles: [],
            ),
            'start-reference',
        );
    }

    private function profile(): DriverProfile
    {
        return $this->journal->driverProfile(DefaultDrivers::CODEX);
    }
}
