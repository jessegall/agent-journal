<?php

declare(strict_types=1);

namespace Tests\Commands\Drivers;

use App\Commands\Agents\ClaimStart\ClaimStartCommand;
use App\Commands\Agents\OpenAgentRuntime\OpenAgentRuntimeCommand;
use App\Commands\Drivers\NotifyStopped\NotifyStoppedCommand;
use App\Commands\Projects\EnrollHost\EnrollHostCommand;
use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\CommandBus;
use App\Enums\Drivers\DriverType;
use App\Enums\Sessions\StartUnavailableReason;
use App\Exceptions\AccountUnavailable;
use App\Models\Accounts\Account;
use App\Models\Agents\Agent;
use App\Support\AccountMaintenance;
use App\Support\ActorReference;
use App\Support\EnrolledHost;
use App\Support\OpenedRuntime;
use App\Values\OwnerAuthority;
use Illuminate\Support\Str;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * An account's maintenance against every writer of it: it holds new starts, cancels starts no host took, waits for
 * claimed starts until their host proves them gone and for a live sign-in, and a retired agent's unclaimed start
 * never runs.
 */
#[TimeLimit(
    seconds: 5,
    reason: 'It opens runtimes, enrolls hosts and commits maintenance steps, emptying many tables.',
)]
#[TestsCommand(NotifyStoppedCommand::class)]
final class NotifyStoppedTest extends TestCase
{
    use CommitsHookRows;
    use WithActiveAccount;

    private const array TABLES = [
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
        'sign_in_attempts',
        'session_processes',
        'links',
        'command_receipts',
        'assignments',
    ];

    private const string FOLDER = '/work/project';

    private Account $account;

    protected function setUp(): void
    {
        parent::setUp();

        $this->account = $this->chooseActiveAccounts()['claude-code'];
        $this->journal->showDriverArrangements();
    }

    public function test_maintenance_cancels_unclaimed_starts_and_settles_only_after_proven_exits(): void
    {
        $host = $this->enrollHost();
        $claimed = $this->open($host);
        $pending = $this->open($host);
        $key = $this->journal->asSystem(new ClaimStartCommand($host->hostId, $claimed->sessionId))?->startKey;

        $first = $this->maintenance()->advance($this->account->id);

        $this->assertSame([1, false], [$first->cancelledStarts, $first->isSettled]);
        $this->assertEqualsCanonicalizing([$claimed->sessionId, $pending->sessionId], $first->runningSessionIds);
        $this->assertNull($this->journal->asSystem(new ClaimStartCommand($host->hostId, $pending->sessionId)));
        $this->assertRefusedWhileHeld($host);

        $this->journal->asSystem(new NotifyStoppedCommand($host->hostId, (string) $key));
        $this->actAsOwner();

        $this->assertTrue($this->maintenance()->advance($this->account->id)->isSettled);
    }

    private function assertRefusedWhileHeld(EnrolledHost $host): void
    {
        try {
            $this->open($host);
            $this->fail('A start selected a held account.');
        } catch (AccountUnavailable $refused) {
            $this->assertSame(StartUnavailableReason::Maintenance, $refused->reason);
        }
    }

    private function open(EnrolledHost $host): OpenedRuntime
    {
        $this->actAsOwner();
        $agent = Agent::create('Held agent '.Str::random(6), 'main-agent', $this->localProject());
        $command = new OpenAgentRuntimeCommand(
            $agent->id,
            $host->hostId,
            self::FOLDER,
            'claude-code',
            '2.1.323',
            'claude',
            DriverType::Terminal,
            'claude-opus-5-5',
        );

        return $this->app->make(CommandBus::class)->run($command);
    }

    private function enrollHost(): EnrolledHost
    {
        $host = $this->journal->asSystem(new EnrollHostCommand('test host '.Str::random(6), [self::FOLDER]));
        $this->actAsOwner();

        return $host;
    }

    private function maintenance(): AccountMaintenance
    {
        $this->actAsOwner();

        return $this->app->make(AccountMaintenance::class);
    }

    private function actAsOwner(): void
    {
        $this->app->make(CurrentActorSetter::class)->set(ActorReference::forUser('owner'), new OwnerAuthority('test'));
    }
}
