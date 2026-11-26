<?php

declare(strict_types=1);

namespace Tests\Commands\Agents;

use App\Commands\Agents\NotifyRunning\NotifyRunningCommand;
use App\Commands\Agents\OpenAgentRuntime\OpenAgentRuntimeCommand;
use App\Commands\Drivers\NotifyStopped\NotifyStoppedCommand;
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
use App\Support\ActorReference;
use App\Support\Compatibility\DriverCompatibility;
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
 * The host claims a start once and reports its execution and exit, a start that saves its driver type keeps it for the
 * agent only once it runs, and a running report that comes after the start ended keeps no mode.
 */
#[TimeLimit(seconds: 4, reason: 'It opens runtimes, enrolls hosts and sends signed calls, emptying many tables.')]
#[TestsCommand(NotifyRunningCommand::class)]
final class NotifyRunningTest extends TestCase
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

    public function test_a_claimed_start_reports_its_execution_and_its_exit_once(): void
    {
        [$host, $opened] = $this->openRuntime();

        $key = $this->journal->claimStartOf($host->hostId, $opened->sessionId)->start_key;

        $this->journal->asSystem(new NotifyRunningCommand($host->hostId, $key, 'thread-1'));
        $this->journal->asSystem(new NotifyStoppedCommand($host->hostId, $key));
        $this->journal->asSystem(new NotifyStoppedCommand($host->hostId, $key));

        $start = SessionProcess::query()->withoutGlobalScopes()->sole();
        $this->assertSame([SessionProcessStatus::Stopped, 'thread-1'], [$start->status, $start->execution_id]);
    }

    public function test_a_start_that_saves_its_driver_type_keeps_it_for_the_agent_only_once_it_runs(): void
    {
        [$host, $opened] = $this->openRuntime(shouldSaveDriverType: true);
        $agent = AgentSession::query()->withoutGlobalScopes()->with('agent')->findOrFail($opened->sessionId)->agent;
        $this->assertNull($agent->driver_type_preference);

        $key = $this->journal->claimStartOf($host->hostId, $opened->sessionId)->start_key;
        $this->journal->asSystem(new NotifyRunningCommand($host->hostId, $key, 'thread-1'));

        $agent->refresh();
        $this->assertSame(DriverType::Terminal, $agent->driver_type_preference);
        $this->assertSame(DriverType::Headless, $agent->driverTypeFor(DriverType::Headless, DriverType::Terminal));
        $this->assertSame(DriverType::Terminal, $agent->driverTypeFor(null, DriverType::Headless));
    }

    public function test_a_running_report_that_comes_after_the_start_ended_keeps_no_mode(): void
    {
        [$host, $opened] = $this->openRuntime(shouldSaveDriverType: true);
        $key = $this->journal->claimStartOf($host->hostId, $opened->sessionId)->start_key;

        $this->journal->asSystem(new NotifyStoppedCommand($host->hostId, $key));
        $this->journal->asSystem(new NotifyRunningCommand($host->hostId, $key, 'thread-1'));

        $agent = AgentSession::query()->withoutGlobalScopes()->with('agent')->findOrFail($opened->sessionId)->agent;
        $this->assertNull($agent->driver_type_preference);
    }

    public function test_a_one_start_driver_type_leaves_the_agent_on_its_profile_default(): void
    {
        [$host, $opened] = $this->openRuntime();
        $key = $this->journal->claimStartOf($host->hostId, $opened->sessionId)->start_key;
        $this->journal->asSystem(new NotifyRunningCommand($host->hostId, $key, 'thread-1'));

        $agent = AgentSession::query()->withoutGlobalScopes()->with('agent')->findOrFail($opened->sessionId)->agent;
        $this->assertNull($agent->driver_type_preference);
        $this->assertSame(DriverType::Terminal, $agent->driverTypeFor(null, DriverType::Terminal));
    }

    // A session its restarted host no longer serves is stopped by itself, and the pages hear it.
    /**
     * @return array{EnrolledHost, OpenedRuntime}
     */
    private function openRuntime(
        bool $shouldSaveDriverType = false,
        string $driver = 'claude-code',
        DriverType $driverType = DriverType::Terminal,
    ): array {
        $host = $this->enrollHost();
        $this->app->make(CurrentActorSetter::class)->set(ActorReference::forUser('owner'), new OwnerAuthority('test'));
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
        return $this->journal->asSystem(new EnrollHostCommand('test host '.Str::random(6), [self::FOLDER]));
    }
}
