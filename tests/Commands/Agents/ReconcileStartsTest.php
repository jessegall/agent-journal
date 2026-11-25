<?php

declare(strict_types=1);

namespace Tests\Commands\Agents;

use App\Commands\Agents\ClaimStart\ClaimStartCommand;
use App\Commands\Agents\OpenAgentRuntime\OpenAgentRuntimeCommand;
use App\Commands\Agents\ReconcileStarts\ReconcileStartsCommand;
use App\Commands\Projects\EnrollHost\EnrollHostCommand;
use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Drivers\DriverCompatibilities;
use App\Enums\Agents\SessionProcessStatus;
use App\Enums\Drivers\DriverEvidence;
use App\Enums\Drivers\DriverType;
use App\Enums\Runs\RuntimeActivity;
use App\Events\Sessions\SessionStateChanged;
use App\Models\Accounts\Account;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentRuntime;
use App\Models\Agents\AgentSession;
use App\Models\Sessions\SessionProcess;
use App\Support\ActorContext;
use App\Support\Compatibility\DriverCompatibility;
use App\Support\EnrolledHost;
use App\Support\OpenedRuntime;
use App\Values\OwnerAuthority;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Str;
use Illuminate\Testing\TestResponse;
use Tests\Support\CommitsHookRows;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * A restarted host's claimed start stays possibly running until its exit is proven.
 */
#[TimeLimit(seconds: 5, reason: 'It enrolls a host, opens runtimes and commits each start step, emptying many tables.')]
final class ReconcileStartsTest extends TestCase
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
        'session_processes',
        'links',
        'command_receipts',
        'assignments',
        'session_policies',
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

    public function test_a_restarted_hosts_claimed_start_stays_possibly_running_until_its_exit_is_proven(): void
    {
        $host = $this->enrollHost();
        $start = $this->open($host);
        $this->journal->asSystem(new ClaimStartCommand($host->hostId, $start->sessionId));
        $key = $this->startOf($start)->start_key;

        $this->journal->asSystem(new ReconcileStartsCommand($host->hostId, []));

        $this->assertSame([$key], SessionProcess::resolveUnresolvedKeysOf($host->hostId));

        $this->journal->asSystem(new ReconcileStartsCommand($host->hostId, [$key]));

        $this->assertSame([], SessionProcess::resolveUnresolvedKeysOf($host->hostId));
        $this->assertFalse(AgentSession::query()->findOrFail($start->sessionId)->isActive());
        $this->assertSame(
            RuntimeActivity::Stopped,
            AgentRuntime::query()->where('agent_session_id', $start->sessionId)->sole()->activity,
        );
    }

    public function test_after_a_restart_only_proven_exits_end_and_another_host_reaches_nothing(): void
    {
        [$host, $opened] = $this->openRuntime();
        $other = $this->enrollHost();
        $key = (string) $this->signed($host, 'POST', '/host/starts/claim', ['session_id' => $opened->sessionId])
            ->json('start_key');

        $this->signed($other, 'POST', "/host/starts/{$key}/stopped")->assertNotFound();
        $this->signed($other, 'POST', '/host/starts/reconcile', ['stopped' => [$key]])
            ->assertJson(['accounts_changed' => 0]);
        $this->assertSame([$key], $this->signed($host, 'GET', '/host/starts')->json('unresolved'));

        $this->signed($host, 'POST', '/host/starts/reconcile', ['stopped' => [$key]])
            ->assertJson(['accounts_changed' => 1]);
        $this->assertSame(
            SessionProcessStatus::Stopped,
            SessionProcess::query()->withoutGlobalScopes()->sole()->status,
        );
    }

    // A session its restarted host no longer serves is stopped by itself, and the pages hear it.
    public function test_a_start_the_restarted_host_ended_ends_its_session_and_tells_the_open_pages(): void
    {
        [$host, $opened] = $this->openRuntime();
        $key = (string) $this->signed($host, 'POST', '/host/starts/claim', ['session_id' => $opened->sessionId])
            ->json('start_key');
        Event::fake([SessionStateChanged::class]);

        $this->signed($host, 'POST', '/host/starts/reconcile', ['stopped' => [$key]])->assertOk();

        $session = AgentSession::query()->withoutGlobalScopes()->findOrFail($opened->sessionId);
        $this->assertFalse($session->isActive());
        Event::assertDispatched(
            SessionStateChanged::class,
            fn (SessionStateChanged $change) => $change->sessionId === $opened->sessionId,
        );
    }

    private function startOf(OpenedRuntime $runtime): SessionProcess
    {
        return SessionProcess::query()->withoutGlobalScopes()->where('session_id', $runtime->sessionId)->sole();
    }

    private function open(EnrolledHost $host): OpenedRuntime
    {
        $this->actAsOwner();
        $agent = Agent::create('Helper '.Str::random(6), 'main-agent', $this->localProject());
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
        $host = $this->journal->asSystem(new EnrollHostCommand('test host '.Str::random(6), [self::FOLDER]));
        $this->actAsOwner();

        return $host;
    }

    private function actAsOwner(): void
    {
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser('owner'), new OwnerAuthority('test'));
    }

    /**
     * @param  array<string, mixed>  $body
     */
    private function signed(EnrolledHost $host, string $method, string $target, array $body = []): TestResponse
    {
        return $this->journal->hostCall($host, $method, $target, $body === [] ? '' : (string) json_encode($body));
    }

    /**
     * @return array{EnrolledHost, OpenedRuntime}
     */
    private function openRuntime(
        bool $shouldSaveDriverType = false,
        string $driver = 'claude-code',
        DriverType $driverType = DriverType::Headless,
    ): array {
        $host = $this->enrollHost();
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser('owner'), new OwnerAuthority('test'));
        $agent = Agent::create('Started agent '.Str::random(6), 'main-agent', $this->localProject());
        $command = new OpenAgentRuntimeCommand(
            $agent->id,
            $host->hostId,
            self::FOLDER,
            $driver,
            '2.1.323',
            'claude',
            $driverType,
            'claude-opus-5-5',
            shouldSaveDriverType: $shouldSaveDriverType,
        );

        return [$host, $this->app->make(CommandBus::class)->run($command)];
    }
}
