<?php

declare(strict_types=1);

namespace Tests\Wire\Seeding;

use App\Hosts\Protocol\HostInstructionType;
use App\Models\Accounts\Account;
use App\Models\Projects\HostDriverImage;
use App\Recordings\Recordings;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\OverTheWire;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\Support\Hosts\TestHost;
use Tests\Support\Recordings\PlayedScenario;
use Tests\Support\Recordings\TestScenario;
use Tests\Support\Recordings\WireAssert;
use Tests\Support\Seeding\TestJournal;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * The test journal plays a recorded scenario in parts, on a host whose Docker daemon plays the recording, and reads
 * the orders it gave against the recorded ones.
 */
#[TestsMachinery(TestJournal::class)]
#[OverTheWire]
#[TimeLimit(seconds: 240, reason: 'It runs the real host, a played Docker daemon and a served journal through a whole turn.')]
final class JournalPlayedScenariosTest extends TestCase
{
    use CommitsHookRows;
    use WithActiveAccount;

    private const array TABLES = [
        'hosts',
        'host_processes',
        'host_instructions',
        'host_driver_images',
        'agents',
        'agent_sessions',
        'session_tokens',
        'agent_stacks',
        'hook_calls',
        'agent_runtimes',
        'driver_requests',
        'driver_turns',
        'accounts',
        'active_accounts',
        'session_processes',
        'session_requests',
        'inboxes',
        'inbox_members',
        'messages',
        'links',
        'users',
    ];

    public function test_a_scenario_plays_through_a_step_and_then_the_rest_and_counts_its_orders(): void
    {
        $this->journal->owner()
            ->scenario('claude-code/terminal-turn', fn (TestScenario $turn) => $turn
                ->playThrough('send-message')
                ->playRest()
                ->assertHostWire(fn (WireAssert $host) => $host
                    ->ordered(HostInstructionType::Stop, fn (WireAssert $stop) => $stop->count(1)))
                ->assertPlayedWhole());
    }

    public function test_the_journal_is_arranged_as_the_recorded_machine(): void
    {
        $playing = PlayedScenario::of(
            'claude-code/terminal-turn',
            $this->journal->service(Recordings::class)->scenario('claude-code', 'terminal-turn'),
        );
        $accounts = storage_path('framework/testing/played-accounts-'.bin2hex(random_bytes(4)));

        $this->journal->owner()
            ->arrangeContainedJournal()
            ->enrollContainedHost('Recorded', [base_path()])
            ->arrangeRecordedMachine($playing)
            ->readyRecordedDriverImagesOn('Recorded', $playing->driverImages)
            ->chooseActiveAccountsInIdFolders($accounts)
            ->assertResult(
                [$playing->agentImage, array_values($playing->driverImages), true],
                [
                    config('journal.agents.agent_image'),
                    array_values(array_intersect(HostDriverImage::resolveReadyImages(), $playing->driverImages)),
                    array_all(
                        $this->journal->chosenAccounts(),
                        fn (Account $account) => preg_match('#/[0-9a-z]{26}$#', (string) $account->directory) === 1,
                    ),
                ],
            );
    }

    public function test_a_test_host_runs_against_a_played_daemon(): void
    {
        $recording = $this->journal->service(Recordings::class)->scenario('claude-code', 'terminal-turn');

        $this->journal->owner()
            ->arrangeContainedJournal()
            ->enrollContainedHost('Recorded', [base_path()])
            ->runPlayingTestHost(
                'Recorded',
                PlayedScenario::of('claude-code/terminal-turn', $recording),
                fn (TestHost $host) => $host->assertPlayedNoFailure()->assertStopsWholly(),
            );
    }
}
