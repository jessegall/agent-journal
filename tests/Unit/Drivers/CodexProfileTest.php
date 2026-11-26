<?php

declare(strict_types=1);

namespace Tests\Unit\Drivers;

use App\Agents\Drivers\Codex\CodexArguments;
use App\Agents\Drivers\DefaultDrivers;
use App\Agents\Drivers\Setup\DriverProfile;
use App\Enums\Drivers\ExecutablePlace;
use App\Enums\Hosts\HostProcessPurpose;
use App\Enums\Hosts\HostProcessType;
use App\Enums\Sessions\TransportProfileType;
use App\Exceptions\BuildNotPinned;
use App\Exceptions\ProfileRefused;
use App\Support\AccountStartRecipe;
use App\Values\DriverAccount;
use App\Values\DriverStart;
use Tests\TestCase;

/**
 * The PHP profile plans a Codex terminal and an exec turn exactly as the pinned build was recorded running them,
 * apart from paths and ids; it refuses another build, a protected account and an argument that would undo it.
 */
final class CodexProfileTest extends TestCase
{
    private const string RECORDINGS = __DIR__.'/../../../resources/recordings/codex/0.165.0';

    private const string CONVERSATION = '019a0000-0000-7000-8000-000000000001';

    public function test_an_exec_turn_is_planned_as_the_recorded_turn_ran(): void
    {
        $recorded = $this->recordedStart('turns/process-turn');
        $arguments = $recorded['arguments'];
        $start = new DriverStart(
            sessionId: self::CONVERSATION,
            type: HostProcessType::Pipe,
            workFolder: $recorded['working_folder'],
            prompt: $arguments[array_key_last($arguments)],
        );

        $plan = $this->profile()->startPlan($start);

        $this->journal->assertResult(
            [$arguments, HostProcessPurpose::AgentTurn],
            [$plan->argv, $plan->purpose],
        );
    }

    public function test_a_terminal_is_planned_as_the_recorded_terminals_ran_and_asks_no_user(): void
    {
        $planned = [];
        $expected = [];

        foreach ([
            'turns/terminal-turn',
            'keyscripts/model-choice',
            'screens/first-start',
        ] as $name) {
            $recorded = $this->recordedStart($name);
            $start = new DriverStart(self::CONVERSATION, HostProcessType::Terminal, $recorded['working_folder']);
            $planned[] = $this->profile()->startPlan($start)->argv;
            // The recordings were made before the terminal asked no user; the rest is as they ran.
            $expected[] = [
                ...array_slice($recorded['arguments'], 0, 3),
                '--ask-for-approval',
                'never',
                ...array_slice($recorded['arguments'], 3),
            ];
        }

        $this->journal->assertResult($expected, $planned);
    }

    public function test_a_resumed_turn_names_the_conversation_after_its_options_and_a_terminal_before_them(): void
    {
        $turn = new DriverStart(self::CONVERSATION, HostProcessType::Pipe, '/work', prompt: 'go on', isResume: true);
        $terminal = new DriverStart(self::CONVERSATION, HostProcessType::Terminal, '/work', isResume: true);

        $turnArguments = $this->profile()->startPlan($turn)->argv;
        $terminalArguments = $this->profile()->startPlan($terminal)->argv;

        $this->journal->assertResult(
            [[
                'resume',
                self::CONVERSATION,
                'go on',
            ], [
                'codex',
                'resume',
                self::CONVERSATION,
            ]],
            [array_slice($turnArguments, -3), array_slice($terminalArguments, 0, 3)],
        );
    }

    public function test_only_the_pinned_build_is_accepted(): void
    {
        $profile = $this->profile();
        $printed = fn (string $build) => sprintf('%s-cli %s', CodexArguments::EXECUTABLE, $build);
        $profile->assertPinnedBuild($printed($profile->build()).PHP_EOL);

        $this->journal->assertRefused(BuildNotPinned::class, fn () => $profile->assertPinnedBuild($printed('0.170.0')));
    }

    public function test_a_start_on_a_protected_account_is_refused(): void
    {
        $account = new DriverAccount(
            new AccountStartRecipe(
                environment: [],
                emptyFolderVariables: [],
                removedVariables: [],
                startFlags: [],
                accountSettings: [],
                driverVersion: '0.165.0',
                binaryDigest: '',
                arrangement: 'contained',
                protectionSettings: '',
                transportProfile: TransportProfileType::Cli,
                readFiles: [],
            ),
            'start-reference',
            isProtected: true,
        );
        $start = new DriverStart(self::CONVERSATION, HostProcessType::Terminal, '/work', account: $account);

        $this->journal->assertRefused(ProfileRefused::class, fn () => $this->profile()->startPlan($start));
    }

    public function test_a_connected_machine_runs_every_plan_from_its_sealed_program(): void
    {
        $profile = $this->profile();
        $start = new DriverStart(self::CONVERSATION, HostProcessType::Terminal, '/work', executablePlace: ExecutablePlace::Sealed);

        $this->journal->assertResult(
            ['{host:CODEX_EXECUTABLE}', '{host:CODEX_EXECUTABLE}'],
            [$profile->startPlan($start)->argv[0], $profile->versionProbe('/work', ExecutablePlace::Sealed)->argv[0]],
        );
    }

    public function test_a_start_with_no_account_trusts_each_hook_it_writes(): void
    {
        $start = new DriverStart(self::CONVERSATION, HostProcessType::Terminal, '/work', hookCommand: '/opt/journal/bin/hook');

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
        $fixture = json_decode((string) file_get_contents(self::RECORDINGS."/{$name}/fixture.json"), true, flags: JSON_THROW_ON_ERROR);
        $state = $fixture['initial_state'];
        // The recorded argv starts with the program it ran; the plan's does too.
        $state['arguments'][0] = CodexArguments::EXECUTABLE;

        return $state;
    }

    private function profile(): DriverProfile
    {
        return $this->journal->driverProfile(DefaultDrivers::CODEX);
    }
}
