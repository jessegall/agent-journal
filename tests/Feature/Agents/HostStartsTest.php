<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Commands\Agents\OpenAgentRuntime\OpenAgentRuntimeCommand;
use App\Commands\Projects\EnrollHost\EnrollHostCommand;
use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Drivers\DriverCompatibilities;
use App\Enums\Agents\SessionProcessState;
use App\Enums\Drivers\DriverCapability;
use App\Enums\Drivers\DriverEvidence;
use App\Enums\Drivers\DriverType;
use App\Events\Sessions\SessionStateChanged;
use App\Exceptions\DriverCapabilityUnsupported;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentRuntime;
use App\Models\Agents\AgentSession;
use App\Models\Sessions\SessionPolicy;
use App\Models\Sessions\SessionProcess;
use App\Resolvers\PinnedCompatibilities;
use App\Support\ActorContext;
use App\Support\Capabilities\CodexTerminalCapabilities;
use App\Support\Compatibility\DriverCompatibility;
use App\Support\EnrolledHost;
use App\Support\OpenedRuntime;
use App\Support\Relay\OutputGrantSeal;
use App\Values\OwnerAuthority;
use App\Values\ProfileBase;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Str;
use Illuminate\Testing\TestResponse;
use Tests\Support\CommitsHookRows;
use Tests\Support\RunsTrustedCommands;
use Tests\Support\SendsHostCalls;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * A start's process start over the enrolled host's signed transport: the host claims it once, reports its execution
 * and its proven exit, and after a restart reads the starts it may still run and ends those it proved gone. Another
 * host and a call without the host's signature reach none of it.
 */
#[TimeLimit(seconds: 4, reason: 'It opens runtimes, enrolls hosts and sends signed calls, emptying many tables.')]
final class HostStartsTest extends TestCase
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
        $this->app->instance(DriverCompatibilities::class, new class implements DriverCompatibilities
        {
            public function for(string $driver): DriverCompatibility
            {
                $pinned = DriverCompatibility::pinned($driver);

                return $pinned->withEvidence(DriverEvidence::NativeShown, 'this test');
            }
        });
    }

    public function test_until_the_real_program_shows_its_arrangement_no_start_is_claimed(): void
    {
        $this->app->forgetInstance(DriverCompatibilities::class);
        $this->app->bind(DriverCompatibilities::class, PinnedCompatibilities::class);
        [$host, $opened] = $this->openRuntime();

        $this->signed($host, 'POST', '/host/starts/claim', ['session_id' => $opened->sessionId])->assertStatus(409);

        $this->assertSame(SessionProcessState::Pending, SessionProcess::query()->withoutGlobalScopes()->sole()->state);
    }

    public function test_the_claim_carries_the_checked_recipe_for_the_account_folder(): void
    {
        [$host, $opened] = $this->openRuntime();

        $recipe = $this->signed($host, 'POST', '/host/starts/claim', ['session_id' => $opened->sessionId])
            ->assertOk()
            ->json('recipe');

        $this->assertSame('CLAUDE_CONFIG_DIR', $recipe['environment'][0]['name']);
        $this->assertSame('/journal/accounts/claude-code', $recipe['environment'][0]['value']);
        $this->assertSame(['ANTHROPIC_CONFIG_DIR'], $recipe['emptyFolderVariables']);
        $this->assertContains('ANTHROPIC_API_KEY', $recipe['removedVariables']);
        // Restricted mode refuses the never-ask mode every session runs in.
        $this->assertNotContains('--restricted', $recipe['startFlags']);
        $this->assertSame(['2.1.323', 'direct-processes'], [$recipe['driverVersion'], $recipe['arrangement']]);
        $this->assertStringContainsString(
            'Read(//journal/accounts/claude-code/.credentials.json)',
            $recipe['protectionSettings'],
        );
    }

    public function test_another_host_cannot_claim_the_start_of_a_runtime_assigned_elsewhere(): void
    {
        [, $opened] = $this->openRuntime();
        $other = $this->enrollHost();

        $this->signed($other, 'POST', '/host/starts/claim', ['session_id' => $opened->sessionId])->assertForbidden();

        $start = SessionProcess::query()->withoutGlobalScopes()->sole();
        $this->assertSame([SessionProcessState::Pending, null], [$start->state, $start->host_id]);
    }

    public function test_only_the_claiming_host_reads_the_sealed_output_grants_of_its_start(): void
    {
        [$host, $opened] = $this->openRuntime();
        $other = $this->enrollHost();
        $key = (string) $this->signed($host, 'POST', '/host/starts/claim', ['session_id' => $opened->sessionId])
            ->json('start_key');

        $snapshot = $this->signed($host, 'GET', "/host/starts/{$key}/outputs")->assertOk()->json();

        $this->assertSame([$key, [], 0], [$snapshot['start_key'], $snapshot['paths'], $snapshot['generation']]);
        $this->assertSame(
            $this->app->make(OutputGrantSeal::class)->seal($key, 0, []),
            $snapshot['seal'],
        );
        $this->signed($other, 'GET', "/host/starts/{$key}/outputs")->assertNotFound();
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
        $this->assertSame([SessionProcessState::Stopped, 'thread-1'], [$start->state, $start->execution_id]);
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

    public function test_an_opened_runtime_keeps_the_driver_it_was_pinned_to(): void
    {
        [, $opened] = $this->openRuntime();

        $runtime = AgentRuntime::query()->findOrFail($opened->runtimeId);

        $this->assertSame(
            ['claude-code-headless', 'claude-code', 'Claude Code headless', '2.1.323'],
            [$runtime->driver_key, $runtime->family, $runtime->driver_label, $runtime->driver_build],
        );
        $this->assertSame($runtime->driver_label, AgentSession::query()->findOrFail($opened->sessionId)->driver_label);
    }

    public function test_only_a_runtime_whose_driver_can_be_watched_has_a_screen(): void
    {
        [, $headless] = $this->openRuntime();
        [, $terminal] = $this->openRuntime(driverType: DriverType::Terminal);

        $this->assertSame(
            [false, true],
            [
                AgentRuntime::query()->findOrFail($headless->runtimeId)->hasScreen(),
                AgentRuntime::query()->findOrFail($terminal->runtimeId)->hasScreen(),
            ],
        );
    }

    public function test_a_codex_terminal_start_is_refused_before_anything_is_accepted(): void
    {
        $runtimes = AgentRuntime::query()->count();

        $this->assertThrows(
            fn () => $this->openRuntime(driver: 'codex', driverType: DriverType::Terminal),
            DriverCapabilityUnsupported::class,
            DriverCapabilityUnsupported::for(DriverCapability::Run, CodexTerminalCapabilities::NOT_PROVEN)->getMessage(),
        );
        $this->assertSame($runtimes, AgentRuntime::query()->count());
    }

    public function test_an_opened_runtime_freezes_its_agents_profile_policy(): void
    {
        [, $opened] = $this->openRuntime();

        $policy = SessionPolicy::query()->where('session_id', $opened->sessionId)->sole();

        $this->assertSame(ProfileBase::mainAgent()->key, $policy->profile_key);
        $this->assertNotNull($policy->profile_revision);
    }

    public function test_a_one_start_driver_type_leaves_the_agent_on_its_profile_default(): void
    {
        [$host, $opened] = $this->openRuntime();
        $key = (string) $this->signed($host, 'POST', '/host/starts/claim', ['session_id' => $opened->sessionId])
            ->json('start_key');
        $this->signed($host, 'POST', "/host/starts/{$key}/running", ['execution_id' => 'thread-1'])->assertNoContent();

        $agent = AgentSession::query()->withoutGlobalScopes()->with('agent')->findOrFail($opened->sessionId)->agent;
        $this->assertNull($agent->driver_type_preference);
        $this->assertSame(DriverType::Terminal, $agent->driverTypeFor(null, DriverType::Terminal));
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
        $this->assertSame(SessionProcessState::Stopped, SessionProcess::query()->withoutGlobalScopes()->sole()->state);
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

    public function test_a_call_without_the_host_signature_is_refused(): void
    {
        [$host, $opened] = $this->openRuntime();
        $body = (string) json_encode(['session_id' => $opened->sessionId]);

        $this->call('POST', '/host/starts/claim', content: $body)->assertUnauthorized();
        $bearerOnly = ['HTTP_AUTHORIZATION' => "Bearer {$host->secret}"];
        $this->call('POST', '/host/starts/claim', server: $bearerOnly, content: $body)->assertUnauthorized();
        $this->assertSame(SessionProcessState::Pending, SessionProcess::query()->withoutGlobalScopes()->sole()->state);
    }

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
