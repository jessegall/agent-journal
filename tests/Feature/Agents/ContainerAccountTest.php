<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Commands\Accounts\SwitchAccount\SwitchAccountCommand;
use App\Commands\Agents\ClaimStart\ClaimStartCommand;
use App\Commands\Agents\OpenAgentRuntime\OpenAgentRuntimeCommand;
use App\Commands\Agents\ReconcileStarts\ReconcileStartsCommand;
use App\Commands\Projects\EnrollHost\EnrollHostCommand;
use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Drivers\DriverCompatibilities;
use App\Contracts\Sessions\AgentDirectory;
use App\Enums\Agents\AgentPresence;
use App\Enums\Agents\SessionProcessState;
use App\Enums\Drivers\DriverEvidence;
use App\Enums\Drivers\DriverType;
use App\Enums\Runs\RuntimeActivity;
use App\Models\Accounts\Account;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentRuntime;
use App\Models\Agents\AgentSession;
use App\Models\Sessions\SessionProcess;
use App\Support\ActorContext;
use App\Support\Compatibility\DriverCompatibility;
use App\Support\DefaultDrivers;
use App\Support\EnrolledHost;
use App\Support\OpenedRuntime;
use App\Values\AccountLabel;
use App\Values\OwnerAuthority;
use Illuminate\Support\Str;
use Tests\Support\CommitsHookRows;
use Tests\Support\RunsTrustedCommands;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * A start keeps the account it was accepted on and is never started twice: switching the active account
 * while a helper runs moves only the next start, a repeated claim after a lost acknowledgement starts no second
 * process, a restarted host's claimed start stays possibly running until its exit is proven, and a driver that
 * cannot start here ends its start with the refusal the agent then shows.
 */
#[TimeLimit(seconds: 5, reason: 'It enrolls a host, opens runtimes and commits each start step, emptying many tables.')]
final class ContainerAccountTest extends TestCase
{
    use CommitsHookRows;
    use RunsTrustedCommands;
    use WithActiveAccount;

    private const string REPORT_MISSING = 'cannot start in a container: its protection report is missing';

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
        'session_processes',
        'links',
        'command_receipts',
        'assignments',
    ];

    private const string FOLDER = '/work/project';

    private Account $first;

    protected function setUp(): void
    {
        parent::setUp();

        $this->first = $this->chooseActiveAccounts()['claude-code'];
        $this->app->instance(DriverCompatibilities::class, new class implements DriverCompatibilities
        {
            public function for(string $driver): DriverCompatibility
            {
                return DriverCompatibility::pinned($driver)->withEvidence(DriverEvidence::NativeShown, 'this test');
            }
        });
    }

    public function test_switching_the_account_moves_only_the_next_start(): void
    {
        $host = $this->enrollHost();
        $running = $this->open($host);
        $this->asSystem(new ClaimStartCommand($host->hostId, $running->sessionId));
        $second = Account::create(DefaultDrivers::CLAUDE_CODE, AccountLabel::from('Second'), '/journal/accounts/second');
        $this->actAsOwner();
        $this->app->make(CommandBus::class)->run(new SwitchAccountCommand($second->id));

        $next = $this->open($host);

        $this->assertSame($this->first->id, $this->startOf($running)->account_id);
        $this->assertSame($second->id, $this->startOf($next)->account_id);
    }

    public function test_a_repeated_claim_after_a_lost_acknowledgement_starts_no_second_process(): void
    {
        $host = $this->enrollHost();
        $start = $this->open($host);

        $claimed = $this->asSystem(new ClaimStartCommand($host->hostId, $start->sessionId));
        $again = $this->asSystem(new ClaimStartCommand($host->hostId, $start->sessionId));

        $this->assertNotNull($claimed);
        $this->assertNull($again);
    }

    public function test_a_restarted_hosts_claimed_start_stays_possibly_running_until_its_exit_is_proven(): void
    {
        $host = $this->enrollHost();
        $start = $this->open($host);
        $this->asSystem(new ClaimStartCommand($host->hostId, $start->sessionId));
        $key = $this->startOf($start)->start_key;

        $this->asSystem(new ReconcileStartsCommand($host->hostId, []));

        $this->assertSame([$key], SessionProcess::unresolvedKeysOf($host->hostId));

        $this->asSystem(new ReconcileStartsCommand($host->hostId, [$key]));

        $this->assertSame([], SessionProcess::unresolvedKeysOf($host->hostId));
        $this->assertFalse(AgentSession::query()->findOrFail($start->sessionId)->isActive());
        $this->assertSame(
            RuntimeActivity::Stopped,
            AgentRuntime::query()->where('agent_session_id', $start->sessionId)->sole()->activity,
        );
    }

    public function test_a_claim_of_a_program_that_cannot_start_here_ends_the_start_with_its_refusal(): void
    {
        $this->app->instance(DriverCompatibilities::class, new class implements DriverCompatibilities
        {
            public function for(string $driver): DriverCompatibility
            {
                return DriverCompatibility::pinned($driver)->withContainedShortfall('its protection report is missing');
            }
        });
        $host = $this->enrollHost();
        $start = $this->open($host);

        $this->assertNull($this->asSystem(new ClaimStartCommand($host->hostId, $start->sessionId)));

        $start = $this->startOf($start);
        $this->assertSame(SessionProcessState::Stopped, $start->state);
        $this->assertStringContainsString(
            self::REPORT_MISSING,
            (string) $start->refusal,
        );
        $this->assertNull($this->asSystem(new ClaimStartCommand($host->hostId, $start->sessionId)));
        $this->actAsOwner();
        $agent = $this->app->make(AgentDirectory::class)->visibleAgent($start->agent_id);
        $this->assertSame(AgentPresence::Failed, $agent->presence);
        $this->assertSame($start->refusal, $agent->startRefusal);
    }

    private function startOf(OpenedRuntime $runtime): SessionProcess
    {
        return SessionProcess::query()->withoutGlobalScopes()->where('session_id', $runtime->sessionId)->sole();
    }

    private function open(EnrolledHost $host): OpenedRuntime
    {
        $this->actAsOwner();
        $agent = Agent::create('Helper '.Str::random(6), 'main-agent');
        $command = new OpenAgentRuntimeCommand(
            $agent->id,
            $host->hostId,
            self::FOLDER,
            'claude-code',
            '2.1.323',
            'claude',
            DriverType::Headless,
            'claude-opus-5-5',
        );

        return $this->app->make(CommandBus::class)->run($command);
    }

    private function enrollHost(): EnrolledHost
    {
        $host = $this->asSystem(new EnrollHostCommand('test host '.Str::random(6), [self::FOLDER]));
        $this->actAsOwner();

        return $host;
    }

    private function actAsOwner(): void
    {
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser('owner'), new OwnerAuthority('test'));
    }
}
