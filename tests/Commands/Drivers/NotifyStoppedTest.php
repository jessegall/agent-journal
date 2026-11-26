<?php

declare(strict_types=1);

namespace Tests\Commands\Drivers;

use App\Access\Values\OwnerAuthority;
use App\Accounts\AccountMaintenance;
use App\Accounts\Exceptions\AccountUnavailable;
use App\Actors\Contracts\CurrentActorSetter;
use App\Agents\Commands\OpenAgentRuntime\OpenAgentRuntimeCommand;
use App\Agents\Drivers\Commands\NotifyStopped\NotifyStoppedCommand;
use App\Agents\Drivers\Enums\DriverType;
use App\Bus\Contracts\CommandBus;
use App\Hosts\EnrolledHost;
use App\Models\Accounts\Account;
use App\Models\Agents\Agent;
use App\Projects\Commands\EnrollHost\EnrollHostCommand;
use App\Sessions\Enums\StartUnavailableReason;
use App\Sessions\OpenedRuntime;
use App\Support\ActorReference;
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

    public function test_maintenance_settles_only_once_every_start_the_journal_took_proved_its_exit(): void
    {
        $host = $this->enrollHost();
        $first = $this->open($host);
        $second = $this->open($host);
        $startKeyOf = fn (OpenedRuntime $opened) => $this->journal->claimStartOf($host->hostId, $opened->sessionId);
        $keys = array_map(fn (OpenedRuntime $opened) => (string) $startKeyOf($opened)->start_key, [$first, $second]);

        $held = $this->maintenance()->advance($this->account->id);

        $this->assertSame([0, false], [$held->cancelledStarts, $held->isSettled]);
        $this->assertEqualsCanonicalizing([$first->sessionId, $second->sessionId], $held->runningSessionIds);
        $this->assertRefusedWhileHeld($host);

        foreach ($keys as $key) {
            $this->journal->asSystem(new NotifyStoppedCommand($host->hostId, $key));
        }

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
