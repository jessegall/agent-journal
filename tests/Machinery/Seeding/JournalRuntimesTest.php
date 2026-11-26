<?php

declare(strict_types=1);

namespace Tests\Machinery\Seeding;

use App\Agents\Drivers\DefaultDrivers;
use App\Agents\Drivers\Enums\DriverType;
use App\Models\Agents\AgentRuntime;
use App\Models\Projects\Host;
use Carbon\CarbonImmutable;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\Support\Seeding\Exceptions\FixtureRefused;
use Tests\Support\Seeding\TestJournal;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * The journal opens an agent's runtime on a host it enrolled, through the real start path, and gives the one-session
 * agent shortcut its open runtime.
 */
#[TestsMachinery(TestJournal::class)]
final class JournalRuntimesTest extends TestCase
{
    use CommitsHookRows;
    use WithActiveAccount;

    protected const array TABLES = [
        'agents',
        'agent_sessions',
        'session_tokens',
        'agent_stacks',
        'hook_calls',
        'hosts',
        'agent_runtimes',
        'driver_requests',
        'driver_turns',
        'accounts',
        'active_accounts',
        'session_processes',
        'inboxes',
        'inbox_members',
        'links',
        'users',
    ];

    public function test_a_runtime_opened_on_an_enrolled_host_belongs_to_the_named_agent(): void
    {
        $this->chooseActiveAccounts();
        $this->journal->owner()->idleAgent('Driven')->enrollHost('Laptop', ['/work/project']);

        $opened = $this->journal->openRuntimeOn('Driven', 'Laptop', '/work/project');

        $runtime = AgentRuntime::query()->findOrFail($opened->runtimeId);
        $host = $this->journal->hostCalled('Laptop')->hostId;
        $this->assertSame([$host, $opened->sessionId], [$runtime->host_id, $runtime->agent_session_id]);
    }

    public function test_a_runtimes_requests_and_start_are_claimed_once(): void
    {
        $this->chooseActiveAccounts();
        $this->journal->owner()->idleAgent('Driven')->enrollHost('Laptop', ['/work/project']);
        $opened = $this->journal->openRuntimeOn(
            'Driven',
            'Laptop',
            '/work/project',
            driverType: DriverType::Terminal,
            firstMessage: 'Hello',
        );
        $hostId = $this->journal->hostCalled('Laptop')->hostId;

        $start = $this->journal->claimStartOf($hostId, $opened->sessionId);
        $this->journal->claimRequestsOnHost($hostId);

        $this->journal->assertResult(
            [$start->id, []],
            [
                $this->journal->claimStartOf($hostId, $opened->sessionId)->id,
                $this->journal->claimRequestsOnHost($hostId)->requests,
            ],
        );
        $this->assertThrows(fn () => $this->journal->claimedRequestOnHost($hostId, 'no-such-request'), FixtureRefused::class);
    }

    public function test_the_owner_chooses_an_account_for_every_driver_and_a_start_runs_with_it(): void
    {
        $this->journal->owner()->chooseActiveAccounts()->showDriverArrangements()->idleAgent('Driven')->enrollHost('Laptop', ['/work/project']);

        $opened = $this->journal->openRuntimeOn('Driven', 'Laptop', '/work/project');

        $chosen = $this->journal->chosenAccounts();
        $this->journal->assertResult(
            [DefaultDrivers::familyKeys(), $chosen['claude-code']->id],
            [array_keys($chosen), $this->journal->startOfSession($opened->sessionId)->account_id],
        );
    }

    public function test_the_one_session_agent_has_its_runtime(): void
    {
        $this->journal->owner()->agent('Ada');

        $session = $this->journal->sessionOf('Ada')->id;
        $this->assertSame(1, AgentRuntime::query()->where('agent_session_id', $session)->count());
    }

    public function test_a_synthetic_runtime_is_one_open_headless_runtime_of_the_session(): void
    {
        $this->journal->owner()->idleAgent('Ada')->startSession('Ada', 'Ada');
        $session = $this->journal->sessionOf('Ada')->id;
        $before = AgentRuntime::query()->where('agent_session_id', $session)->count();

        $this->journal->syntheticRuntime('Ada');

        $runtime = AgentRuntime::query()->where('agent_session_id', $session)->latest('id')->firstOrFail();
        $this->assertSame(
            [$before + 1, DriverType::Headless],
            [AgentRuntime::query()->where('agent_session_id', $session)->count(), $runtime->driver_type],
        );
    }

    public function test_an_enrolled_host_is_a_host_of_its_own(): void
    {
        $first = $this->journal->enrolledHost();
        $second = $this->journal->enrolledHost();

        $this->assertNotSame($first->hostId, $second->hostId);
        $this->assertSame(2, Host::query()->whereKey([$first->hostId, $second->hostId])->count());
    }

    public function test_a_host_marked_answered_was_answered_just_now(): void
    {
        $host = $this->journal->enrolledHost();
        $this->journal->markHostAnswered($host);

        $this->assertFalse(
            Host::query()->findOrFail($host->hostId)->hasAnswerToRecord('/host/orders/claim', [], CarbonImmutable::now()),
        );
    }
}
