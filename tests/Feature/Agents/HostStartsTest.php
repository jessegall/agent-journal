<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\Actors\Values\OwnerAuthority;
use App\AgentRequests\Support\SignedCall;
use App\Agents\Commands\EnrollHost;
use App\Agents\Commands\OpenAgentRuntime;
use App\Agents\Enums\DriverType;
use App\Agents\Enums\ProcessStartState;
use App\Agents\Models\Agent;
use App\Agents\Models\ProcessStart;
use App\Agents\Support\EnrolledHost;
use App\Agents\Support\OpenedRuntime;
use App\Bus\Contracts\CommandBus;
use Carbon\CarbonImmutable;
use Illuminate\Support\Str;
use Illuminate\Testing\TestResponse;
use Tests\Support\CommitsHookRows;
use Tests\Support\RunsTrustedCommands;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * A launch's process start over the enrolled host's signed transport: the host claims it once, reports its execution
 * and its proven exit, and after a restart reads the starts it may still run and ends those it proved gone. Another
 * host and a call without the host's signature reach none of it.
 */
#[TimeLimit(seconds: 4, reason: 'It opens runtimes, enrolls hosts and sends signed calls, emptying many tables.')]
final class HostStartsTest extends TestCase
{
    use CommitsHookRows;
    use RunsTrustedCommands;
    use WithActiveAccount;

    private const array TABLES = [
        'agents',
        'agent_sessions',
        'launch_credentials',
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
    ];

    private const string FOLDER = '/work/project';

    protected function setUp(): void
    {
        parent::setUp();

        $this->chooseActiveAccounts();
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

        $start = ProcessStart::query()->withoutGlobalScopes()->sole();
        $this->assertSame([ProcessStartState::Stopped, 'thread-1'], [$start->state, $start->execution_id]);
        $this->assertSame([], $this->signed($host, 'GET', '/host/starts')->json('unresolved'));
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
        $this->assertSame(ProcessStartState::Stopped, ProcessStart::query()->withoutGlobalScopes()->sole()->state);
    }

    public function test_a_call_without_the_host_signature_is_refused(): void
    {
        [$host, $opened] = $this->openRuntime();
        $body = (string) json_encode(['session_id' => $opened->sessionId]);

        $this->call('POST', '/host/starts/claim', content: $body)->assertUnauthorized();
        $bearerOnly = ['HTTP_AUTHORIZATION' => "Bearer {$host->secret}"];
        $this->call('POST', '/host/starts/claim', server: $bearerOnly, content: $body)->assertUnauthorized();
        $this->assertSame(ProcessStartState::Pending, ProcessStart::query()->withoutGlobalScopes()->sole()->state);
    }

    /**
     * @param  array<string, mixed>  $body
     */
    private function signed(EnrolledHost $host, string $method, string $target, array $body = []): TestResponse
    {
        $content = $body === [] ? '' : (string) json_encode($body);
        $callId = (string) Str::uuid();
        $issuedAt = CarbonImmutable::now()->getTimestamp();
        $this->app->forgetScopedInstances();

        return $this->call($method, $target, server: [
            'CONTENT_TYPE' => 'application/json',
            'HTTP_ACCEPT' => 'application/json',
            'HTTP_AUTHORIZATION' => "Bearer {$host->secret}",
            'HTTP_'.strtoupper(str_replace('-', '_', SignedCall::ID_HEADER)) => $callId,
            'HTTP_'.strtoupper(str_replace('-', '_', SignedCall::ISSUED_AT_HEADER)) => (string) $issuedAt,
            'HTTP_'.strtoupper(str_replace('-', '_', SignedCall::SIGNATURE_HEADER)) => SignedCall::signatureFor(
                $host->secret,
                $method,
                $target,
                $callId,
                $issuedAt,
                $content,
            ),
        ], content: $content);
    }

    /**
     * @return array{EnrolledHost, OpenedRuntime}
     */
    private function openRuntime(): array
    {
        $host = $this->enrollHost();
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser('owner'), new OwnerAuthority('test'));
        $agent = Agent::named('Started agent '.Str::random(6), 'main-agent');
        $command = new OpenAgentRuntime(
            $agent->id,
            $host->hostId,
            self::FOLDER,
            'claude-code',
            '2.1.323',
            'claude',
            DriverType::Process,
            'claude-opus-5-5',
        );

        return [$host, $this->app->make(CommandBus::class)->run($command)];
    }

    private function enrollHost(): EnrolledHost
    {
        return $this->asSystem(new EnrollHost('test host '.Str::random(6), [self::FOLDER]));
    }
}
