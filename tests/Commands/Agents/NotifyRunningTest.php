<?php

declare(strict_types=1);

namespace Tests\Commands\Agents;

use App\Commands\Agents\OpenAgentRuntime\OpenAgentRuntimeCommand;
use App\Commands\Projects\EnrollHost\EnrollHostCommand;
use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Drivers\DriverCompatibilities as DriverCompatibilitiesContract;
use App\Enums\Agents\SessionProcessStatus;
use App\Enums\Drivers\DriverEvidence;
use App\Enums\Drivers\DriverType;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentSession;
use App\Models\Sessions\SessionProcess;
use App\Support\ActorContext;
use App\Support\Compatibility\DriverCompatibility;
use App\Support\EnrolledHost;
use App\Support\OpenedRuntime;
use App\Values\OwnerAuthority;
use Illuminate\Support\Str;
use Illuminate\Testing\TestResponse;
use Tests\Support\CommitsHookRows;
use Tests\Support\RunsTrustedCommands;
use Tests\Support\SendsHostCalls;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * The host claims a start once and reports its execution and exit, a start that saves its driver type keeps it for the
 * agent only once it runs, and a running report that comes after the start ended keeps no mode.
 */
#[TimeLimit(seconds: 4, reason: 'It opens runtimes, enrolls hosts and sends signed calls, emptying many tables.')]
final class NotifyRunningTest extends TestCase
{
    use CommitsHookRows;
    use RunsTrustedCommands;
    use SendsHostCalls;
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
        'session_policies',
    ];

    private const string FOLDER = '/work/project';

    protected function setUp(): void
    {
        parent::setUp();

        $this->chooseActiveAccounts();
        $this->app->instance(DriverCompatibilitiesContract::class, new class implements DriverCompatibilitiesContract
        {
            public function for(string $driver): DriverCompatibility
            {
                $pinned = DriverCompatibility::pinned($driver);

                return $pinned->withEvidence(DriverEvidence::NativeShown, 'this test');
            }
        });
    }

    public function test_the_host_claims_a_start_once_and_reports_its_execution_and_exit(): void
    {
        [$host, $opened] = $this->openRuntime();

        $claim = $this->signed($host, 'POST', '/host/starts/claim', ['session_id' => $opened->sessionId])->assertOk();
        $key = (string) $claim->json('start_key');
        $this->signed($host, 'POST', '/host/starts/claim', ['session_id' => $opened->sessionId])->assertStatus(410);

        $this->signed($host, 'POST', "/host/starts/{$key}/running", ['execution_id' => 'thread-1'])->assertNoContent();
        $this->assertSame([$key], $this->signed($host, 'GET', '/host/starts')->json('unresolved'));
        $this->signed($host, 'POST', "/host/starts/{$key}/stopped")->assertNoContent();
        $this->signed($host, 'POST', "/host/starts/{$key}/stopped")->assertNoContent();

        $start = SessionProcess::query()->withoutGlobalScopes()->sole();
        $this->assertSame([SessionProcessStatus::Stopped, 'thread-1'], [$start->status, $start->execution_id]);
        $this->assertSame([], $this->signed($host, 'GET', '/host/starts')->json('unresolved'));
    }

    public function test_a_start_that_saves_its_driver_type_keeps_it_for_the_agent_only_once_it_runs(): void
    {
        [$host, $opened] = $this->openRuntime(shouldSaveDriverType: true);
        $agent = AgentSession::query()->withoutGlobalScopes()->with('agent')->findOrFail($opened->sessionId)->agent;
        $this->assertNull($agent->driver_type_preference);

        $key = (string) $this->signed($host, 'POST', '/host/starts/claim', ['session_id' => $opened->sessionId])
            ->json('start_key');
        $this->signed($host, 'POST', "/host/starts/{$key}/running", ['execution_id' => 'thread-1'])->assertNoContent();

        $agent->refresh();
        $this->assertSame(DriverType::Headless, $agent->driver_type_preference);
        $this->assertSame(DriverType::Terminal, $agent->driverTypeFor(DriverType::Terminal, DriverType::Headless));
        $this->assertSame(DriverType::Headless, $agent->driverTypeFor(null, DriverType::Terminal));
    }

    public function test_a_running_report_that_comes_after_the_start_ended_keeps_no_mode(): void
    {
        [$host, $opened] = $this->openRuntime(shouldSaveDriverType: true);
        $key = (string) $this->signed($host, 'POST', '/host/starts/claim', ['session_id' => $opened->sessionId])
            ->json('start_key');

        $this->signed($host, 'POST', "/host/starts/{$key}/stopped")->assertNoContent();
        $this->signed($host, 'POST', "/host/starts/{$key}/running", ['execution_id' => 'thread-1']);

        $agent = AgentSession::query()->withoutGlobalScopes()->with('agent')->findOrFail($opened->sessionId)->agent;
        $this->assertNull($agent->driver_type_preference);
    }

    // A session its restarted host no longer serves is stopped by itself, and the pages hear it.
    /**
     * @param  array<string, mixed>  $body
     */
    private function signed(EnrolledHost $host, string $method, string $target, array $body = []): TestResponse
    {
        return $this->signedHostCall($host, $method, $target, $body === [] ? '' : (string) json_encode($body));
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

    private function enrollHost(): EnrolledHost
    {
        return $this->asSystem(new EnrollHostCommand('test host '.Str::random(6), [self::FOLDER]));
    }
}
