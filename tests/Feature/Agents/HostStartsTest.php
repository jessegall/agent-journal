<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Commands\EnrollHost\EnrollHostCommand;
use App\Commands\OpenAgentRuntime\OpenAgentRuntimeCommand;
use App\Contracts\CommandBus;
use App\Contracts\CurrentActorSetter;
use App\Contracts\DriverCompatibilities;
use App\Enums\DriverCapability;
use App\Enums\DriverEvidence;
use App\Enums\DriverVariant;
use App\Enums\ProcessStartState;
use App\Exceptions\DriverCapabilityUnsupported;
use App\Models\Agent;
use App\Models\AgentRuntime;
use App\Models\AgentSession;
use App\Models\ProcessStart;
use App\Models\SessionPolicy;
use App\Resolvers\PinnedCompatibilities;
use App\Support\ActorContext;
use App\Support\Capabilities\CodexTerminalCapabilities;
use App\Support\Compatibility\DriverCompatibility;
use App\Support\EnrolledHost;
use App\Support\OpenedRuntime;
use App\Support\Relay\OutputGrantSeal;
use App\Values\OwnerAuthority;
use App\Values\ProfileBase;
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

        $this->assertSame(ProcessStartState::Pending, ProcessStart::query()->withoutGlobalScopes()->sole()->state);
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
        $this->assertContains('--restricted', $recipe['startFlags']);
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

        $start = ProcessStart::query()->withoutGlobalScopes()->sole();
        $this->assertSame([ProcessStartState::Pending, null], [$start->state, $start->host_id]);
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

        $start = ProcessStart::query()->withoutGlobalScopes()->sole();
        $this->assertSame([ProcessStartState::Stopped, 'thread-1'], [$start->state, $start->execution_id]);
        $this->assertSame([], $this->signed($host, 'GET', '/host/starts')->json('unresolved'));
    }

    public function test_a_launch_that_saves_its_variant_keeps_it_for_the_agent_only_once_it_runs(): void
    {
        [$host, $opened] = $this->openRuntime(saveVariant: true);
        $agent = AgentSession::query()->withoutGlobalScopes()->with('agent')->findOrFail($opened->sessionId)->agent;
        $this->assertNull($agent->mode_preference);

        $key = (string) $this->signed($host, 'POST', '/host/starts/claim', ['session_id' => $opened->sessionId])
            ->json('start_key');
        $this->signed($host, 'POST', "/host/starts/{$key}/running", ['execution_id' => 'thread-1'])->assertNoContent();

        $agent->refresh();
        $this->assertSame(DriverVariant::Headless, $agent->mode_preference);
        $this->assertSame(DriverVariant::Terminal, $agent->variantFor(DriverVariant::Terminal, DriverVariant::Headless));
        $this->assertSame(DriverVariant::Headless, $agent->variantFor(null, DriverVariant::Terminal));
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
        [, $terminal] = $this->openRuntime(variant: DriverVariant::Terminal);

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
            fn () => $this->openRuntime(driver: 'codex', variant: DriverVariant::Terminal),
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

    public function test_a_one_launch_variant_leaves_the_agent_on_its_profile_default(): void
    {
        [$host, $opened] = $this->openRuntime();
        $key = (string) $this->signed($host, 'POST', '/host/starts/claim', ['session_id' => $opened->sessionId])
            ->json('start_key');
        $this->signed($host, 'POST', "/host/starts/{$key}/running", ['execution_id' => 'thread-1'])->assertNoContent();

        $agent = AgentSession::query()->withoutGlobalScopes()->with('agent')->findOrFail($opened->sessionId)->agent;
        $this->assertNull($agent->mode_preference);
        $this->assertSame(DriverVariant::Terminal, $agent->variantFor(null, DriverVariant::Terminal));
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
        return $this->signedHostCall($host, $method, $target, $body === [] ? '' : (string) json_encode($body));
    }

    /**
     * @return array{EnrolledHost, OpenedRuntime}
     */
    private function openRuntime(
        bool $saveVariant = false,
        string $driver = 'claude-code',
        DriverVariant $variant = DriverVariant::Headless,
    ): array {
        $host = $this->enrollHost();
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser('owner'), new OwnerAuthority('test'));
        $agent = Agent::create('Started agent '.Str::random(6), 'main-agent');
        $command = new OpenAgentRuntimeCommand(
            $agent->id,
            $host->hostId,
            self::FOLDER,
            $driver,
            '2.1.323',
            'claude',
            $variant,
            'claude-opus-5-5',
            saveVariant: $saveVariant,
        );

        return [$host, $this->app->make(CommandBus::class)->run($command)];
    }

    private function enrollHost(): EnrolledHost
    {
        return $this->asSystem(new EnrollHostCommand('test host '.Str::random(6), [self::FOLDER]));
    }
}
