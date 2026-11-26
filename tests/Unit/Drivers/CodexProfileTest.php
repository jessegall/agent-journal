<?php

declare(strict_types=1);

namespace Tests\Unit\Drivers;

use App\Accounts\AccountStartRecipe;
use App\Agents\Drivers\Codex\CodexArguments;
use App\Agents\Drivers\DefaultDrivers;
use App\Agents\Drivers\Enums\ExecutablePlace;
use App\Agents\Drivers\Setup\DriverProfile;
use App\Agents\Exceptions\BuildNotPinned;
use App\Agents\Exceptions\ProfileRefused;
use App\Hosts\Enums\HostProcessPurpose;
use App\Hosts\Enums\HostProcessType;
use App\Hosts\Enums\RestartPolicy;
use App\Sessions\Enums\TransportProfileType;
use App\Values\DriverAccount;
use App\Values\DriverStart;
use Tests\TestCase;

/**
 * The PHP profile plans a Codex terminal exactly as the pinned build was recorded running it, apart from paths and
 * ids, and an account's headless turns on one app-server; it refuses another build, a protected account and an argument that would undo it.
 */
final class CodexProfileTest extends TestCase
{
    private const string RECORDINGS = __DIR__.'/../../../resources/recordings/codex/0.165.0';

    private const string CONVERSATION = '019a0000-0000-7000-8000-000000000001';

    public function test_an_accounts_headless_turns_run_on_one_app_server_that_is_never_restarted(): void
    {
        $start = new DriverStart(self::CONVERSATION, HostProcessType::Pipe, '/work');

        $plan = $this->profile()->ownerPlan($start);

        $this->journal->assertResult(
            [['codex', 'app-server'], HostProcessPurpose::AccountOwner, HostProcessType::Pipe, RestartPolicy::Never],
            [$plan->argv, $plan->purpose, $plan->type, $plan->restart],
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

    public function test_a_resumed_terminal_names_the_conversation_first(): void
    {
        $terminal = new DriverStart(self::CONVERSATION, HostProcessType::Terminal, '/work', isResume: true);

        $terminalArguments = $this->profile()->startPlan($terminal)->argv;

        $this->journal->assertResult(['codex', 'resume', self::CONVERSATION], array_slice($terminalArguments, 0, 3));
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
        $account = $this->account(isProtected: true);
        $start = new DriverStart(self::CONVERSATION, HostProcessType::Terminal, '/work', account: $account);

        $this->journal->assertRefused(ProfileRefused::class, fn () => $this->profile()->startPlan($start));
    }

    public function test_a_connected_machine_runs_every_plan_from_its_sealed_program(): void
    {
        $profile = $this->profile();
        $start = new DriverStart(
            self::CONVERSATION,
            HostProcessType::Terminal,
            '/work',
            account: $this->account(isProtected: false),
            executablePlace: ExecutablePlace::Sealed,
        );

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

    private function account(bool $isProtected): DriverAccount
    {
        return new DriverAccount(
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
            isProtected: $isProtected,
        );
    }

    private function profile(): DriverProfile
    {
        return $this->journal->driverProfile(DefaultDrivers::CODEX);
    }
}
