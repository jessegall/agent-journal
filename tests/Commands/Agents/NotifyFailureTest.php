<?php

declare(strict_types=1);

namespace Tests\Commands\Agents;

use App\Commands\Agents\NotifyFailure\NotifyFailureCommand;
use App\Commands\Agents\OpenAgentRuntime\OpenAgentRuntimeCommand;
use App\Commands\Projects\EnrollHost\EnrollHostCommand;
use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Drivers\DriverCompatibilities as DriverCompatibilitiesContract;
use App\Enums\Agents\SessionProcessStatus;
use App\Enums\Drivers\DriverEvidence;
use App\Enums\Drivers\DriverFailure;
use App\Enums\Drivers\DriverType;
use App\Models\Agents\Agent;
use App\Models\Sessions\SessionProcess;
use App\Support\ActorContext;
use App\Support\Compatibility\DriverCompatibility;
use App\Support\EnrolledHost;
use App\Support\OpenedRuntime;
use App\Values\OwnerAuthority;
use Illuminate\Support\Str;
use Illuminate\Testing\TestResponse;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * A host reports that a claimed start failed: the start stops with proof, and a second report changes nothing.
 */
#[TimeLimit(seconds: 4, reason: 'It opens runtimes, enrolls hosts and sends signed calls, emptying many tables.')]
#[TestsCommand(NotifyFailureCommand::class)]
final class NotifyFailureTest extends TestCase
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

    public function test_a_failed_start_stops_with_proof_and_a_second_report_changes_nothing(): void
    {
        [$host, $opened] = $this->openRuntime();
        $key = (string) $this->signed(
            $host,
            'POST',
            '/host/starts/claim',
            ['session_id' => $opened->sessionId],
        )->json('start_key');

        $this->signed(
            $host,
            'POST',
            "/host/starts/{$key}/failure",
            ['failure' => DriverFailure::RateLimit->value],
        )->assertNoContent();
        $stopped = SessionProcess::query()->withoutGlobalScopes()->sole()->updated_at;
        $this->signed(
            $host,
            'POST',
            "/host/starts/{$key}/failure",
            ['failure' => DriverFailure::BillingError->value],
        )->assertNoContent();

        $start = SessionProcess::query()->withoutGlobalScopes()->sole();
        $this->assertSame(SessionProcessStatus::Stopped, $start->status);
        $this->assertTrue($stopped?->equalTo($start->updated_at));
    }

    // A session its restarted host no longer serves is stopped by itself, and the pages hear it.
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

    private function enrollHost(): EnrolledHost
    {
        return $this->journal->asSystem(new EnrollHostCommand('test host '.Str::random(6), [self::FOLDER]));
    }
}
