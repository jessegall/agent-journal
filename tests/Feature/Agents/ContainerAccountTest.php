<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\Actors\Values\OwnerAuthority;
use App\Agents\Commands\ClaimStart\ClaimStartCommand;
use App\Agents\Commands\EnrollHost\EnrollHostCommand;
use App\Agents\Commands\OpenAgentRuntime\OpenAgentRuntimeCommand;
use App\Agents\Commands\ReconcileStarts\ReconcileStartsCommand;
use App\Agents\Contracts\AgentDirectory;
use App\Agents\Enums\AgentPresence;
use App\Agents\Enums\DriverVariant;
use App\Agents\Enums\ProcessStartState;
use App\Agents\Enums\RuntimeActivity;
use App\Agents\Models\Agent;
use App\Agents\Models\AgentRuntime;
use App\Agents\Models\AgentSession;
use App\Agents\Models\ProcessStart;
use App\Agents\Support\EnrolledHost;
use App\Agents\Support\OpenedRuntime;
use App\Bus\Contracts\CommandBus;
use App\Drivers\Support\DefaultDrivers;
use App\Hooks\Compatibility\DriverCompatibility;
use App\Hooks\Contracts\DriverCompatibilities;
use App\Hooks\Enums\DriverEvidence;
use App\Profiles\Commands\SwitchAccount\SwitchAccountCommand;
use App\Profiles\Models\Account;
use App\Profiles\Values\AccountLabel;
use Illuminate\Support\Str;
use Tests\Support\CommitsHookRows;
use Tests\Support\RunsTrustedCommands;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * A launch keeps the account it was accepted on and is never started twice (task 420): switching the active account
 * while a helper runs moves only the next launch, a repeated claim after a lost acknowledgement starts no second
 * process, a restarted host's claimed launch stays possibly running until its exit is proven, and a driver that
 * cannot start here ends its start with the refusal the agent then shows (task 1904).
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
        'start_tokens',
        'agent_stacks',
        'hook_calls',
        'hosts',
        'agent_runtimes',
        'driver_requests',
        'driver_turns',
        'accounts',
        'active_accounts',
        'process_starts',
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

    public function test_switching_the_account_moves_only_the_next_launch(): void
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
        $launch = $this->open($host);

        $claimed = $this->asSystem(new ClaimStartCommand($host->hostId, $launch->sessionId));
        $again = $this->asSystem(new ClaimStartCommand($host->hostId, $launch->sessionId));

        $this->assertNotNull($claimed);
        $this->assertNull($again);
    }

    public function test_a_restarted_hosts_claimed_launch_stays_possibly_running_until_its_exit_is_proven(): void
    {
        $host = $this->enrollHost();
        $launch = $this->open($host);
        $this->asSystem(new ClaimStartCommand($host->hostId, $launch->sessionId));
        $key = $this->startOf($launch)->start_key;

        $this->asSystem(new ReconcileStartsCommand($host->hostId, []));

        $this->assertSame([$key], ProcessStart::unresolvedKeysOf($host->hostId));

        $this->asSystem(new ReconcileStartsCommand($host->hostId, [$key]));

        $this->assertSame([], ProcessStart::unresolvedKeysOf($host->hostId));
        $this->assertFalse(AgentSession::query()->findOrFail($launch->sessionId)->isActive());
        $this->assertSame(
            RuntimeActivity::Stopped,
            AgentRuntime::query()->where('agent_session_id', $launch->sessionId)->sole()->activity,
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
        $launch = $this->open($host);

        $this->assertNull($this->asSystem(new ClaimStartCommand($host->hostId, $launch->sessionId)));

        $start = $this->startOf($launch);
        $this->assertSame(ProcessStartState::Stopped, $start->state);
        $this->assertStringContainsString(
            self::REPORT_MISSING,
            (string) $start->refusal,
        );
        $this->assertNull($this->asSystem(new ClaimStartCommand($host->hostId, $launch->sessionId)));
        $this->actAsOwner();
        $agent = $this->app->make(AgentDirectory::class)->visibleAgent($start->agent_id);
        $this->assertSame(AgentPresence::Failed, $agent->presence);
        $this->assertSame($start->refusal, $agent->startRefusal);
    }

    private function startOf(OpenedRuntime $runtime): ProcessStart
    {
        return ProcessStart::query()->withoutGlobalScopes()->where('session_id', $runtime->sessionId)->sole();
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
            DriverVariant::Headless,
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
