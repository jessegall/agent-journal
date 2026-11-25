<?php

declare(strict_types=1);

namespace Tests\Feature\Hooks;

use App\Contracts\Actors\CurrentActorSetter;
use App\Enums\Drivers\DriverFailure;
use App\Events\Sessions\DriverFailed;
use App\Models\Agents\AgentSession;
use App\Models\Drivers\FailureReceipt;
use App\Models\Drivers\HookCall;
use App\Support\ActorContext;
use App\Support\AgentContext;
use App\Support\SignedCall;
use App\Support\StackTransaction;
use App\Support\StartStacks;
use App\Values\StackTarget;
use Carbon\CarbonImmutable;
use Domain\Tasks\TasksDomain;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Event;
use Illuminate\Testing\TestResponse;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\CommitsHookRows;
use Tests\Support\DomainBoot;
use Tests\Support\TestStartAuthority;
use Tests\TestCase;

final class HookEndpointTest extends TestCase
{
    use CommitsHookRows;

    private const string STILL_NEEDS_WORK = 'Task %d still needs work';

    private const string ADMISSION_PREFIX = 'journal process run --admission ';

    private const string SECRET_DETAIL = 'secret detail';

    /**
     * The domains this test uses beside core.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(TasksDomain::class);
    }

    /**
     * The tables these tests commit to, the runtime its start opens included, emptied around each test.
     */
    private const array TABLES = [
        'agents',
        'agent_sessions',
        'agent_runtimes',
        'session_tokens',
        'agent_stacks',
        'hook_calls',
        'failure_receipts',
        'tasks',
        'links',
        'driver_conversations',
        'conversation_visits',
        'process_events',
        'part_runs',
        'process_runs',
        'command_requests',
    ];

    private TestStart $start;

    protected function setUp(): void
    {
        parent::setUp();

        config(['processes.runner' => true]);
        $this->start = TestStart::start('main-agent');
        $this->start->openRuntime($this->app);
        $this->asStartedAgent(fn () => $this->app->make(StackTransaction::class)->run(
            fn () => $this->app->make(StartStacks::class)->open($this->target()),
        ));
    }

    public function test_an_allowed_stop_answers_the_host_with_an_empty_object(): void
    {
        $this->hook('claude-code', $this->stopBody())
            ->assertOk()
            ->assertExactJson(['stdout' => '{}', 'stderr' => '', 'exitCode' => 0]);
        $this->assertSame(1, HookCall::query()->authorizedFor($this->target())->count());
    }

    public function test_no_native_flag_makes_a_line_admitted(): void
    {
        $flagged = json_decode($this->bashBody('composer test'), true);
        $flagged['tool_input']['saved'] = true;

        $stdout = $this->hookOutput('claude-code', (string) json_encode($flagged));

        $this->assertSame('deny', $stdout['hookSpecificOutput']['permissionDecision']);
    }

    public function test_a_retry_with_other_input_conflicts(): void
    {
        $this->hook('claude-code', $this->bashBody('composer test'), 'call-7')->assertOk();

        $this->hook('claude-code', $this->bashBody('git status'), 'call-7')->assertStatus(409);
    }

    public function test_codex_answers_through_its_own_adapter(): void
    {
        $body = $this->bashBody('composer test');

        $stdout = json_decode((string) $this->hook('codex', $body)->assertOk()->json('stdout'), true);

        $this->assertSame('deny', $stdout['hookSpecificOutput']['permissionDecision']);
    }

    public function test_a_failure_notification_is_heard_once_and_answers_without_walking_the_stack(): void
    {
        Event::fake([DriverFailed::class]);
        $body = $this->failureBody('authentication_failed');

        $first = $this->hook('claude-code', $body, 'call-9')->assertOk()->getContent();
        $retry = $this->hook('claude-code', $body, 'call-9')->assertOk()->getContent();

        $this->assertSame($first, $retry);
        $this->assertSame(['stdout' => '{}', 'stderr' => '', 'exitCode' => 0], json_decode((string) $first, true));
        $this->assertSame(0, HookCall::query()->authorizedFor($this->target())->count());
        Event::assertDispatchedTimes(DriverFailed::class, 1);
        Event::assertDispatched(DriverFailed::class, fn (DriverFailed $failed) => $failed->driver === 'claude-code'
            && $failed->sessionId === $this->start->session->id
            && $failed->failure === DriverFailure::AuthenticationFailed);
    }

    public function test_an_unchecked_failure_code_is_unknown_and_its_details_are_never_kept(): void
    {
        Event::fake([DriverFailed::class]);

        $this->hook('claude-code', $this->failureBody('token_revoked_maybe'), 'call-10')->assertOk();

        Event::assertDispatched(
            DriverFailed::class,
            fn (DriverFailed $failed) => $failed->failure === DriverFailure::Unknown,
        );
        $kept = FailureReceipt::query()->withoutGlobalScopes()->sole();
        $this->assertSame(DriverFailure::Unknown, $kept->failure);
        $this->assertStringNotContainsString(self::SECRET_DETAIL, (string) json_encode($kept->getAttributes()));
    }

    public function test_an_unauthenticated_call_is_refused(): void
    {
        $headers = $this->start->serverHeaders($this->stopBody(), target: '/hooks/claude-code');
        unset($headers['HTTP_AUTHORIZATION']);

        $this->call('POST', '/hooks/claude-code', server: $headers, content: $this->stopBody())->assertUnauthorized();
        $headers = $this->start->serverHeaders('{"other":"body"}', target: '/hooks/claude-code');
        $this->call('POST', '/hooks/claude-code', server: $headers, content: $this->stopBody())->assertUnauthorized();
    }

    public function test_a_malformed_or_unmapped_payload_is_refused(): void
    {
        $this->hook('claude-code', '{"session_id":"session-redacted"}', 'call-1')->assertUnprocessable();
        $notification = '{"session_id":"session-redacted","hook_event_name":"Notification"}';
        $noCommand = '{"session_id":"session-redacted","hook_event_name":"PreToolUse","tool_name":"Bash","tool_input":{}}';
        $this->hook('claude-code', $notification, 'call-2')->assertUnprocessable();
        $this->hook('claude-code', $noCommand, 'call-3')->assertUnprocessable();
    }

    public function test_a_clear_keeps_the_journal_session_and_records_the_new_program_session(): void
    {
        $startup = '{"session_id":"driver-session-1","hook_event_name":"SessionStart","source":"startup"}';
        $clear = '{"session_id":"driver-session-2","hook_event_name":"SessionStart","source":"clear"}';
        $this->hook('claude-code', $startup, 'call-1')->assertOk();
        $this->hook('claude-code', $clear, 'call-2')->assertOk();

        $this->assertSame(1, AgentSession::query()->count());
        $conversation = $this->start->session->fresh(['currentConversation'])?->currentConversation;
        $this->assertSame('driver-session-2', $conversation?->native_id);
        $this->assertSame(2, HookCall::query()->authorizedFor($this->target())->count());
    }

    public function test_an_unknown_program_has_no_endpoint(): void
    {
        $this->hook('another-driver', $this->stopBody())->assertNotFound();
    }

    /**
     * @return TestResponse<Response>
     */
    private function hook(string $driver, string $body, string $callId = 'call-1'): TestResponse
    {
        $this->app->forgetScopedInstances();

        $headers = $this->start->serverHeaders($body, $callId, target: "/hooks/{$driver}");

        return $this->call('POST', "/hooks/{$driver}", server: $headers, content: $body);
    }

    /**
     * The hook's answer to the driver, decoded from the stdout it returned.
     *
     * @return array<string, mixed>
     */
    private function hookOutput(string $driver, string $body, string $callId = 'call-1'): array
    {
        return (array) json_decode((string) $this->hook($driver, $body, $callId)->assertOk()->json('stdout'), true);
    }

    private function asStartedAgent(\Closure $work): void
    {
        $this->app->instance(AgentContext::class, new AgentContext(
            $this->start->agent->id,
            $this->start->session->id,
            new SignedCall('setup', CarbonImmutable::now(), hash('sha256', 'setup')),
            null,
        ));
        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forAgent($this->start->agent->id),
            TestStartAuthority::forAgent($this->start->agent->id),
        );
        $work();
        $this->app->forgetScopedInstances();
    }

    private function target(): StackTarget
    {
        return new StackTarget($this->start->agent->id, $this->start->session->id);
    }

    private function stopBody(): string
    {
        return '{"session_id":"session-redacted","hook_event_name":"Stop","stop_hook_active":false}';
    }

    private function failureBody(string $error): string
    {
        return (string) json_encode([
            'session_id' => 'session-redacted',
            'hook_event_name' => 'StopFailure',
            'error' => $error,
            'error_details' => 'secret detail',
        ]);
    }

    private function bashBody(string $command): string
    {
        return (string) json_encode([
            'session_id' => 'session-redacted',
            'hook_event_name' => 'PreToolUse',
            'tool_name' => 'Bash',
            'tool_input' => ['command' => $command],
        ]);
    }
}
