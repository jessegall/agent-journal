<?php

declare(strict_types=1);

namespace Tests\Feature\Profiles;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\Actors\Support\ActorIdentity;
use App\Actors\Values\OwnerAuthority;
use App\Agents\Commands\ClaimStart;
use App\Agents\Commands\EnrollHost;
use App\Agents\Commands\OpenAgentRuntime;
use App\Agents\Commands\ReportStopped;
use App\Agents\Commands\RetireAgent;
use App\Agents\Enums\DriverVariant;
use App\Agents\Enums\ProcessStartState;
use App\Agents\Enums\StartUnavailableReason;
use App\Agents\Exceptions\AccountUnavailable;
use App\Agents\Models\Agent;
use App\Agents\Models\ProcessStart;
use App\Agents\Support\EnrolledHost;
use App\Agents\Support\OpenedRuntime;
use App\Bus\Contracts\CommandBus;
use App\Drivers\Enums\HookDriver;
use App\Hooks\Compatibility\DriverCompatibility;
use App\Hooks\Contracts\DriverCompatibilities;
use App\Hooks\Enums\DriverEvidence;
use App\Profiles\Enums\SignInMethod;
use App\Profiles\Models\Account;
use App\Profiles\Models\SignInAttempt;
use App\Profiles\Support\AccountMaintenance;
use Carbon\CarbonImmutable;
use Illuminate\Support\Str;
use Tests\Support\CommitsHookRows;
use Tests\Support\RunsTrustedCommands;
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
final class AccountMaintenanceTest extends TestCase
{
    use CommitsHookRows;
    use RunsTrustedCommands;
    use WithActiveAccount;

    private const array TABLES = [
        'agents',
        'agent_sessions',
        'start_tokens',
        'agent_stacks',
        'hook_calls',
        'hosts',
        'agent_runtimes',
        'driver_requests',
        'driver_turns',
        'accounts',
        'active_accounts',
        'sign_in_attempts',
        'process_starts',
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
        $this->app->instance(DriverCompatibilities::class, new class implements DriverCompatibilities
        {
            public function for(HookDriver $driver): DriverCompatibility
            {
                $pinned = DriverCompatibility::pinned($driver);

                return $pinned->withEvidence(DriverEvidence::NativeShown, 'this test');
            }
        });
    }

    public function test_maintenance_cancels_unclaimed_starts_and_settles_only_after_proven_exits(): void
    {
        $host = $this->enrollHost();
        $claimed = $this->open($host);
        $pending = $this->open($host);
        $key = $this->asSystem(new ClaimStart($host->hostId, $claimed->sessionId))?->startKey;

        $first = $this->maintenance()->advance($this->account->id);

        $this->assertSame([1, false], [$first->cancelledStarts, $first->settled]);
        $this->assertEqualsCanonicalizing([$claimed->sessionId, $pending->sessionId], $first->runningSessionIds);
        $this->assertNull($this->asSystem(new ClaimStart($host->hostId, $pending->sessionId)));
        $this->assertRefusedWhileHeld($host);

        $this->asSystem(new ReportStopped($host->hostId, (string) $key));
        $this->actAsOwner();

        $this->assertTrue($this->maintenance()->advance($this->account->id)->settled);
    }

    public function test_a_live_sign_in_writer_keeps_maintenance_from_settling(): void
    {
        $attempt = SignInAttempt::create(
            ActorIdentity::system(),
            $this->account,
            SignInMethod::OAuth,
            '/journal/accounts/staging-request-1',
            'request-1',
            CarbonImmutable::now()->addMinutes(10),
        );
        $this->account->writerFor($attempt);
        $attempt->writeInGeneration($this->account->sign_in_generation);

        $progress = $this->maintenance()->advance($this->account->id);

        $this->assertSame([true, false], [$progress->isCredentialWriteInProgress, $progress->settled]);
    }

    public function test_a_retired_agents_unclaimed_start_never_runs(): void
    {
        $host = $this->enrollHost();
        $opened = $this->open($host);
        $agentId = ProcessStart::query()->withoutGlobalScopes()->sole()->agent_id;

        $this->app->make(CommandBus::class)->run(new RetireAgent($agentId));

        $this->assertSame(ProcessStartState::Cancelled, ProcessStart::query()->withoutGlobalScopes()->sole()->state);
        $this->assertNull($this->asSystem(new ClaimStart($host->hostId, $opened->sessionId)));
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
        $agent = Agent::create('Held agent '.Str::random(6), 'main-agent');
        $command = new OpenAgentRuntime(
            $agent->id,
            $host->hostId,
            self::FOLDER,
            'claude-code',
            '2.1.323',
            'claude',
            DriverVariant::Headless,
            'claude-opus-5-5',
        );

        return $this->app->make(CommandBus::class)->run($command);
    }

    private function enrollHost(): EnrolledHost
    {
        $host = $this->asSystem(new EnrollHost('test host '.Str::random(6), [self::FOLDER]));
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
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser('owner'), new OwnerAuthority('test'));
    }
}
