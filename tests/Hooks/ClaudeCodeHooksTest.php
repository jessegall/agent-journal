<?php

declare(strict_types=1);

namespace Tests\Hooks;

use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Drivers\DriverCatalogue;
use App\Contracts\Files\Files;
use App\Enums\Agents\StackStatus;
use App\Enums\Drivers\DriverFailure;
use App\Enums\Drivers\DriverType;
use App\Enums\Engine\NoSubject;
use App\Enums\Files\Place;
use App\Enums\Hooks\AnswerType;
use App\Enums\Hooks\CallFailure;
use App\Enums\Hooks\HookEvent;
use App\Enums\Sessions\SessionStatus;
use App\Events\Sessions\DriverFailed;
use App\Events\Sessions\StartSettingsRequested;
use App\Exceptions\CredentialRejected;
use App\Exceptions\RetentionTooShort;
use App\Exceptions\StoredValueInvalid;
use App\Models\Agents\AgentSession;
use App\Models\Agents\AgentStackRow;
use App\Models\Drivers\FailureReceipt;
use App\Models\Drivers\HookCall;
use App\Models\Records\Link;
use App\Models\Sessions\ReportedBypass;
use App\Support\ActorContext;
use App\Support\AgentContext;
use App\Support\CredentialLookup;
use App\Support\DefaultDrivers;
use App\Support\Drivers\Contracts\DriverAdapters;
use App\Support\Drivers\DriverReply;
use App\Support\HookRetryWindow;
use App\Support\Inputs\Values\HookIdentity;
use App\Support\IsolatedHookSettings;
use App\Support\Octane\GiveRequestItsTimeLimit;
use App\Support\OperationDeadline;
use App\Support\ProtectedAccounts;
use App\Support\PruneHookHistory;
use App\Support\References\StateReference;
use App\Support\References\SubjectReference;
use App\Support\Relay\CallbackEnvelope;
use App\Support\Relay\HookRelay;
use App\Support\Relay\PreparationState;
use App\Support\Relay\RelaySettings;
use App\Support\RetentionPeriods;
use App\Support\SignedCall;
use App\Support\StartedAgent;
use App\Support\StartHeartbeats;
use App\Support\StartSessions;
use App\Support\Storage\FrameRecord;
use App\Support\Storage\FrameRecords;
use App\Support\Storage\RecordedAnswer;
use App\Support\Storage\RecordedSteps;
use App\Support\Storage\WalkStep;
use App\Support\Ticks\TickingTypes;
use App\Values\AgentText;
use App\Values\FilePath;
use App\Values\StackTarget;
use Carbon\CarbonImmutable;
use Domain\Tasks\Commands\StartTask\StartTaskCommand;
use Domain\Tasks\Enums\TaskStatus;
use Domain\Tasks\Models\Task;
use Domain\Tasks\TasksDomain;
use GuzzleHttp\Promise\PromiseInterface;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Database\DatabaseManager;
use Illuminate\Database\QueryException;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Http;
use Laravel\Octane\Events\RequestReceived;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Fixtures\Hooks\JournalUnreachable;
use Tests\Fixtures\Hooks\TestFailure;
use Tests\Support\Agents\BackdatesSessions;
use Tests\Support\Agents\HostContract;
use Tests\Support\CommitsHookRows;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsHook;
use Tests\Support\HookDatabase;
use Tests\Support\Hooks\SendsSignedHooks;
use Tests\Support\TestActors;
use Tests\Support\TestIds;
use Tests\Support\TestStartAuthority;
use Tests\Support\TestText;
use Tests\TestCase;

/**
 * Every moment Claude Code's hooks reach the journal, sent as the program sends it to POST hooks.answer, signed as a
 * started agent whose stack holds only its ready state: each is answered with a reply Claude Code reads and recorded
 * for the session. Beside them, the endpoint's own answers: an unknown protocol, a replayed call with other input, a
 * stale process, a stack held past the deadline, an unsigned call, an unreadable payload and a native subagent.
 */
#[TestsHook(DefaultDrivers::CLAUDE_CODE, HookEvent::SessionStart)]
#[TestsHook(DefaultDrivers::CLAUDE_CODE, HookEvent::UserPromptSubmit)]
#[TestsHook(DefaultDrivers::CLAUDE_CODE, HookEvent::PreToolUse)]
#[TestsHook(DefaultDrivers::CLAUDE_CODE, HookEvent::PostToolUse)]
#[TestsHook(DefaultDrivers::CLAUDE_CODE, HookEvent::Stop)]
#[TestsHook(DefaultDrivers::CLAUDE_CODE, HookEvent::StopFailure)]
#[TestsHook(DefaultDrivers::CLAUDE_CODE, HookEvent::SessionEnd)]
final class ClaudeCodeHooksTest extends TestCase
{
    use BackdatesSessions;
    use CommitsHookRows;
    use SendsSignedHooks;

    private const string SECRET_DETAIL = 'secret detail';

    /**
     * What the lock holder prints once it saw the hook wait and committed its push.
     */
    private const string WAITING_THEN_COMMITTED = <<<'TEXT'
        saw the hook waiting
        committed

        TEXT;

    private const string OWN_SUBAGENTS_RULE = 'rule 36';

    private const string STACK_CLOSED_AT = '2026-11-17 08:00:00';

    /**
     * The day the retention cases start on, so each counts its days from a fixed clock.
     */
    private const string RETENTION_START = '2026-11-01 08:00:00';

    private const string HOST_EXIT_CODE = 'exit code 137';

    private const string HOST_EXIT_EVIDENCE = 'host reported exit: %s';

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
        'reported_bypasses',
    ];

    private const string RELAY_STOP = '{"session_id":"session-1","hook_event_name":"Stop","stop_hook_active":false}';

    private const string RELAY_SHELL = '{"session_id":"session-1","hook_event_name":"PreToolUse","tool_name":"Bash",'
        .'"tool_input":{"command":"git status"}}';

    private const string RELAY_ACCOUNT_READ = '{"session_id":"session-1","hook_event_name":"PreToolUse",'
        .'"tool_name":"Read",'
        .'"cwd":"/work","tool_input":{"file_path":"../journal/accounts/a/projects/-work/other.jsonl"}}';

    private const array COMPARED_HEADERS = ['authorization', 'content-type', 'x-journal-'];

    private const array VARYING_HEADERS = [
        'authorization',
        'x-journal-call-id',
        'x-journal-call-issued-at',
        'x-journal-call-signature',
    ];

    private string $bypassLog;

    private bool $isJournalDown = false;

    protected function setUp(): void
    {
        parent::setUp();

        $this->signReadyAgent();
    }

    /**
     * @return iterable<string, array{string}>
     */
    public static function moments(): iterable
    {
        yield 'session start' => [
            '{"session_id":"driver-session-1","hook_event_name":"SessionStart","source":"startup"}',
        ];

        yield 'prompt' => ['{"session_id":"driver-session-1","hook_event_name":"UserPromptSubmit","prompt":"Go on."}'];

        yield 'tool call' => [
            '{"session_id":"driver-session-1","hook_event_name":"PreToolUse","tool_name":"Bash",'
                .'"tool_input":{"command":"git status"}}',
        ];

        yield 'finished tool' => [
            '{"session_id":"driver-session-1","hook_event_name":"PostToolUse","tool_name":"Bash",'
                .'"tool_input":{"command":"git status"},"tool_response":{"stdout":"clean","stderr":""}}',
        ];

        yield 'stop' => ['{"session_id":"driver-session-1","hook_event_name":"Stop","stop_hook_active":false}'];

        yield 'session end' => ['{"session_id":"driver-session-1","hook_event_name":"SessionEnd","reason":"other"}'];
    }

    #[DataProvider('moments')]
    public function test_each_moment_is_answered_with_a_reply_claude_code_reads_and_recorded(string $body): void
    {
        $reply = $this->hook('claude-code', $body)->assertOk();

        $this->assertSame(0, $reply->json('exitCode'));
        $this->assertIsArray(json_decode((string) $reply->json('stdout'), true));
        $this->assertSame(1, HookCall::query()->authorizedFor($this->target())->count());
    }

    public function test_a_call_from_a_process_the_host_has_since_replaced_conflicts(): void
    {
        $this->hook('claude-code', $this->stopBody(), generation: 0)->assertStatus(409);
    }

    public function test_a_stack_another_connection_holds_past_the_deadline_is_unavailable(): void
    {
        config(['hooks.operation_deadline_milliseconds' => 300]);
        $this->app->forgetInstance(OperationDeadline::class);
        config(['database.connections.lock_holder' => config('database.connections.'.config('database.default'))]);
        $holder = $this->app->make(DatabaseManager::class)->connection('lock_holder');
        $holder->beginTransaction();
        $holder->select(
            'select id from agent_stacks where agent_id = ? and session_id = ? for update',
            [$this->target()->agentId, $this->target()->sessionId],
        );

        try {
            $this->hook('claude-code', $this->stopBody())->assertStatus(503);
        } finally {
            $holder->rollBack();
        }
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
        $noCommand = '{"session_id":"session-redacted","hook_event_name":"PreToolUse","tool_name":"Bash",'
            .'"tool_input":{}}';
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

    public function test_a_call_from_inside_a_native_subagent_is_refused_before_the_stack(): void
    {
        $body = (string) json_encode([
            'session_id' => 'session-redacted',
            'hook_event_name' => 'PreToolUse',
            'tool_name' => 'Bash',
            'tool_input' => ['command' => 'ls'],
            'agent_id' => 'child-1',
            'agent_type' => 'general-purpose',
        ]);

        $reply = $this->hook('claude-code', $body)->assertOk();

        $this->assertStringContainsString(self::OWN_SUBAGENTS_RULE, $reply->json('stdout'));
        $this->assertSame(0, HookCall::query()->authorizedFor($this->target())->count());
    }

    public function test_both_drivers_of_a_family_answer_hooks_through_one_adapter(): void
    {
        $drivers = $this->app->make(DriverCatalogue::class);
        $adapters = $this->app->make(DriverAdapters::class);

        foreach (DefaultDrivers::familyKeys() as $family) {
            $terminal = $drivers->forKey($drivers->keyFor($family, DriverType::Terminal))->descriptor();
            $headless = $drivers->forKey($drivers->keyFor($family, DriverType::Headless))->descriptor();

            $this->assertSame(
                $adapters->for($terminal->hookProtocol),
                $adapters->for($headless->hookProtocol),
                $family,
            );
        }
    }

    public function test_every_program_start_denies_each_native_child_tool(): void
    {
        foreach (DefaultDrivers::familyKeys() as $driver) {
            $settings = new IsolatedHookSettings();
            $this->app->make(Dispatcher::class)->dispatch(new StartSettingsRequested($driver, $settings));
            $denied = json_decode($settings->content(), true, flags: JSON_THROW_ON_ERROR)['permissions']['deny'];

            $childTools = $this->app->make(DriverAdapters::class)->for($driver)->nativeChildTools();
            $this->assertNotSame([], $childTools, $driver);

            foreach ($childTools as $toolName) {
                $this->assertContains($toolName, $denied, "{$driver}/{$toolName}");
            }
        }
    }

    public function test_a_received_request_starts_with_the_configured_time_limit(): void
    {
        config(['octane.max_execution_time' => 45]);
        $limitBefore = (int) ini_get('max_execution_time');
        set_time_limit(7);

        $this->app->make(GiveRequestItsTimeLimit::class)
            ->handle(new RequestReceived($this->app, $this->app, $this->app->make('request')));

        $limit = (int) ini_get('max_execution_time');
        set_time_limit($limitBefore);
        $this->assertSame(45, $limit);
    }

    public function test_a_long_silence_never_ends_the_session_and_keeps_the_credential_and_the_stack(): void
    {
        $started = $this->startIdleAgent();
        $task = $this->startTask($started);

        $this->startedSecondsAgo($started, 17 * 60);
        $this->heartbeats()->markSilentStarts();
        $this->heartbeats()->markSilentStarts();

        $this->assertSame(SessionStatus::Silent, $started->session->refresh()->status);
        $this->assertNull($started->session->refresh()->end_evidence);
        $this->assertSame(
            $started->session->id,
            $this->app->make(CredentialLookup::class)->sessionFor($started->token)->id,
        );
        $this->assertSame(StackStatus::Active, $this->stackOf($started)->status);
        $this->assertSame(
            ['core.ready', 'tasks.work'],
            array_map(fn (FrameRecord $frame) => $frame->reference->typeKey, $this->stackOf($started)->frames->all()),
        );
        $this->assertSame(TaskStatus::Started, $task->fresh()?->status);
        $this->assertSame(0, HookCall::query()->acrossEveryAgent()->count());
    }

    public function test_a_session_keeps_an_end_reason_longer_than_a_short_text_column(): void
    {
        $started = $this->startIdleAgent();
        $reason = str_repeat('the agent image leaves an item unenforced; ', 12);

        $started->session->endWithEvidenceAt(CarbonImmutable::now(), $reason);

        $this->assertSame($reason, $started->session->refresh()->end_evidence);
    }

    public function test_the_host_reporting_an_exit_ends_the_session_at_once(): void
    {
        $started = $this->startIdleAgent();

        $this->heartbeats()->markExited($started->session, self::HOST_EXIT_CODE);

        $this->assertSame(SessionStatus::Ended, $started->session->refresh()->status);
        $this->assertSame(
            sprintf(self::HOST_EXIT_EVIDENCE, self::HOST_EXIT_CODE),
            $started->session->refresh()->end_evidence,
        );
        $this->assertSame(StackStatus::Closed, $this->stackOf($started)->status);
        $this->expectException(CredentialRejected::class);
        $this->app->make(CredentialLookup::class)->sessionFor($started->token);
    }

    public function test_a_replacement_start_starts_from_its_own_bottom_and_copies_nothing(): void
    {
        $exited = $this->startIdleAgent();
        $this->startTask($exited);
        $this->heartbeats()->markExited($exited->session, 'killed');

        $replacement = $this->app->make(StartSessions::class)->start(
            $exited->session->loadMissing('agent')->agent,
            TestSelections::of('claude-code'),
            TestSelections::requestId(),
        );

        $this->assertNotSame($exited->session->id, $replacement->session->id);
        $this->assertSame(
            ['core.ready'],
            array_map(
                fn (FrameRecord $frame) => $frame->reference->typeKey,
                $this->stackOf($replacement)->frames->all(),
            ),
        );
    }

    private function startIdleAgent(): StartedAgent
    {
        return $this->app->make(StartSessions::class)->start(
            $this->journal->idleAgent('Test agent', 'main-agent')->agentCalled('Test agent'),
            TestSelections::of('claude-code'),
            TestSelections::requestId(),
        );
    }

    private function startTask(StartedAgent $started): Task
    {
        $task = Task::factory()->create(['title' => 'Write the walk']);
        $this->app->instance(
            AgentContext::class,
            new AgentContext(
                $started->session->agent_id,
                $started->session->id,
                new SignedCall('setup', CarbonImmutable::now(), hash('sha256', 'setup')),
                null,
            ),
        );
        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forAgent($started->session->agent_id),
            TestStartAuthority::forAgent($started->session->agent_id),
        );
        $this->app->make(CommandBus::class)->run(new StartTaskCommand($task->id));
        $this->app->forgetScopedInstances();

        return $task;
    }

    private function stackOf(StartedAgent $started): AgentStackRow
    {
        return AgentStackRow::query()->authorizedFor(
            new StackTarget($started->session->agent_id, $started->session->id),
        )->sole();
    }

    private function heartbeats(): StartHeartbeats
    {
        return $this->app->make(StartHeartbeats::class);
    }

    public function test_the_tests_run_on_the_dedicated_postgres_database(): void
    {
        $this->asStoredAgent();
        $this->assertSame('pgsql', DB::connection()->getDriverName());
        $this->assertSame(HookDatabase::expectedName($this->app), DB::connection()->getDatabaseName());
    }

    public function test_both_tables_hold_their_payloads_as_jsonb_without_foreign_keys(): void
    {
        $this->asStoredAgent();
        $this->assertSame('jsonb', $this->columnType('agent_stacks', 'frames'));
        $this->assertSame('jsonb', $this->columnType('hook_calls', 'answer'));
        $this->assertSame('jsonb', $this->columnType('hook_calls', 'steps'));
        $this->assertSame(0, DB::table('information_schema.table_constraints')
            ->whereIn('table_name', ['agent_stacks', 'hook_calls'])
            ->where('constraint_type', 'FOREIGN KEY')
            ->count());
    }

    public function test_a_stack_keeps_its_frames_exactly(): void
    {
        $this->asStoredAgent();
        $frames = $this->storedFrames();
        $row = new AgentStackRow();
        $row->startFor(TestActors::stack(7, 9), $frames, new TickingTypes([]));

        $stored = AgentStackRow::query()->forTarget(TestActors::stack(7, 9))->sole();

        $this->assertEquals($frames, $stored->frames);
        $this->assertSame(
            [TestIds::of(7), TestIds::of(9), 1],
            [$stored->agent_id, $stored->session_id, $stored->version],
        );
        $this->assertSame(StackStatus::Active, $stored->status);
    }

    public function test_saving_frames_raises_the_version_and_closing_records_the_time(): void
    {
        $this->asStoredAgent();
        $row = new AgentStackRow();
        $row->startFor(TestActors::stack(7, 9), $this->storedFrames(), new TickingTypes([]));
        $bottomOnly = new FrameRecords([$this->storedFrames()->all()[0]]);

        $row->saveFrames($bottomOnly, new TickingTypes([]));
        $row->closeAt(CarbonImmutable::parse('2026-11-17 08:00:00'));
        $stored = $row->fresh();

        $this->assertNotNull($stored);
        $this->assertSame(2, $stored->version);
        $this->assertEquals($bottomOnly, $stored->frames);
        $this->assertSame(StackStatus::Closed, $stored->status);
        $this->assertSame(self::STACK_CLOSED_AT, $stored->closed_at?->format('Y-m-d H:i:s'));
    }

    public function test_one_agent_and_session_has_one_stack(): void
    {
        $this->asStoredAgent();
        new AgentStackRow()->startFor(TestActors::stack(7, 9), $this->storedFrames(), new TickingTypes([]));

        $this->expectException(QueryException::class);

        new AgentStackRow()->startFor(TestActors::stack(7, 9), $this->storedFrames(), new TickingTypes([]));
    }

    public function test_a_hook_call_keeps_its_answer_bytes_and_steps_exactly(): void
    {
        $this->asStoredAgent();
        $response = "{\"decision\":\"block\",\"reason\":\"Task 42 still needs work: finish it.\"}\n\t\u{00e9}\u{1F600}";
        $steps = RecordedSteps::of([
            WalkStep::from(
                [
                    'frameId' => 'frame-2',
                    'stateType' => 'tasks.work',
                    'hookMethod' => 'onStop',
                    'answer' => AnswerType::Delegate,
                    'contextCount' => 2,
                ],
            ),
            WalkStep::from(
                [
                    'frameId' => 'frame-1',
                    'stateType' => 'hooks.main_ready',
                    'hookMethod' => 'onStop',
                    'answer' => AnswerType::Deny,
                    'contextCount' => 1,
                ],
            ),
        ]);
        $call = new HookCall();
        $call->recordFor($this->storedHook(), RecordedAnswer::of(AnswerType::Deny, $response), $steps);

        $stored = HookCall::query()->sole();

        $this->assertSame($response, $stored->answer->stdout);
        $this->assertSame(AnswerType::Deny, $stored->answer->type);
        $this->assertSame($steps->toArray(), $stored->steps->toArray());
        $this->assertSame(['hook-1', str_repeat('a', 64)], [$stored->event_id, $stored->input_digest]);
    }

    public function test_one_hook_id_is_recorded_once_per_agent_and_session(): void
    {
        $this->asStoredAgent();
        new HookCall()->recordFor(
            $this->storedHook(),
            RecordedAnswer::of(AnswerType::Allow, '{}'),
            RecordedSteps::of([]),
        );

        $this->expectException(QueryException::class);

        new HookCall()->recordFor(
            $this->storedHook(),
            RecordedAnswer::of(AnswerType::Allow, '{}'),
            RecordedSteps::of([]),
        );
    }

    public function test_the_agent_and_session_cannot_be_mass_assigned(): void
    {
        $this->asStoredAgent();
        $this->assertFalse(new AgentStackRow()->isFillable('agent_id'));
        $this->assertFalse(new AgentStackRow()->isFillable('session_id'));
        $this->assertFalse(new HookCall()->isFillable('agent_id'));
        $this->assertFalse(new HookCall()->isFillable('session_id'));
    }

    public function test_frames_in_an_unknown_version_are_refused(): void
    {
        $this->asStoredAgent();
        new AgentStackRow()->startFor(TestActors::stack(7, 9), $this->storedFrames(), new TickingTypes([]));
        DB::table('agent_stacks')->update(['frames' => '{"version":2,"frames":[]}']);

        $this->expectException(StoredValueInvalid::class);

        AgentStackRow::query()->sole()->frames;
    }

    public function test_steps_without_their_fields_are_refused(): void
    {
        $this->asStoredAgent();
        new HookCall()->recordFor(
            $this->storedHook(),
            RecordedAnswer::of(AnswerType::Allow, '{}'),
            RecordedSteps::of([]),
        );
        DB::table('hook_calls')->update(['steps' => '{"version":1,"steps":[{"frameId":"frame-1"}]}']);

        $this->expectException(StoredValueInvalid::class);

        HookCall::query()->sole()->steps;
    }

    public function test_a_stack_and_a_hook_call_can_be_linked(): void
    {
        $this->asStoredAgent();
        $stack = new AgentStackRow();
        $stack->startFor(TestActors::stack(7, 9), $this->storedFrames(), new TickingTypes([]));
        $call = new HookCall();
        $call->recordFor($this->storedHook(), RecordedAnswer::of(AnswerType::Allow, '{}'), RecordedSteps::of([]));

        Link::createForModels($stack, $call);

        $this->assertTrue($call->isLinkedTo($stack));
    }

    public function test_calls_past_seven_days_go_and_newer_calls_stay(): void
    {
        CarbonImmutable::setTestNow(self::RETENTION_START);
        $this->retainedStack(1);
        $this->recordCall(1, 'old');
        $this->moveDays(5);
        $this->recordCall(1, 'recent');
        $this->moveDays(3);

        $pruned = $this->app->make(PruneHookHistory::class)->prune();

        $this->assertSame(1, $pruned->hookCalls);
        $this->assertSame(
            ['recent'],
            HookCall::query()->authorizedFor(self::retainedTarget(1))->pluck('event_id')->all(),
        );
    }

    public function test_closed_stacks_past_thirty_days_go_and_active_or_recently_closed_stacks_stay(): void
    {
        CarbonImmutable::setTestNow(self::RETENTION_START);
        $this->retainedStack(1)->closeAt(CarbonImmutable::now());
        $this->retainedStack(2);
        $this->moveDays(25);
        $this->retainedStack(3)->closeAt(CarbonImmutable::now());
        $this->moveDays(6);

        $pruned = $this->app->make(PruneHookHistory::class)->prune();

        $this->assertSame(1, $pruned->closedStacks);
        $this->assertFalse(AgentStackRow::query()->authorizedFor(self::retainedTarget(1))->exists());
        $this->assertTrue(AgentStackRow::query()->authorizedFor(self::retainedTarget(2))->exists());
        $this->assertTrue(AgentStackRow::query()->authorizedFor(self::retainedTarget(3))->exists());
    }

    public function test_pruning_removes_the_links_of_what_it_removes(): void
    {
        CarbonImmutable::setTestNow(self::RETENTION_START);
        $stack = $this->retainedStack(1);
        Link::createForModels($stack, $this->recordCall(1, 'old'));
        $this->moveDays(8);

        $this->app->make(PruneHookHistory::class)->prune();

        $this->assertSame(0, Link::query()->count());
    }

    public function test_a_call_retention_a_retry_could_outlive_is_refused(): void
    {
        $this->expectException(RetentionTooShort::class);

        new RetentionPeriods(hookCallDays: 0)->assertLongerThan(new HookRetryWindow(300));
    }

    public function test_the_command_prunes_in_batches_and_says_how_much(): void
    {
        CarbonImmutable::setTestNow(self::RETENTION_START);
        $this->app->instance(RetentionPeriods::class, new RetentionPeriods(batchSize: 2));
        $this->retainedStack(1);

        foreach (['a', 'b', 'c', 'd', 'e'] as $hookId) {
            $this->recordCall(1, $hookId);
        }

        $this->moveDays(8);

        $this->artisan('hooks:prune')
            ->expectsOutput('Removed 5 hook calls and 0 closed stacks, and the raw output of 0 stop results.')
            ->assertSuccessful();
    }

    public function test_the_relay_carries_a_signed_call_to_the_endpoint_and_prints_its_reply(): void
    {
        $this->prepareRelay();
        $this->forwardToTheEndpoint();

        $reply = $this->relay(self::RELAY_STOP);

        $this->assertSame(['{}', '', 0], [$reply->stdout, $reply->stderr, $reply->exitCode]);
        $this->assertSame(1, HookCall::query()->authorizedFor($this->target())->count());
    }

    /**
     * The exchange the Go hook relay (tools/journal-agent/cmd/journal-hook) must hold to: the payload, the start it
     * runs for, each call as it went to the real endpoint with its answer, and the reply printed.
     */
    public function test_the_calls_it_sends_and_the_reply_it_prints_hold_to_the_contract_the_go_relay_shares(): void
    {
        $this->prepareRelay();
        $exchange = ['calls' => [], 'answers' => []];
        Http::fake(function (Request $request) use (&$exchange) {
            $answer = $this->forward($request);
            $response = $answer->wait();
            $exchange['calls'][] = [
                'path' => (string) parse_url($request->url(), PHP_URL_PATH),
                'body' => json_decode($request->body(), true, flags: JSON_THROW_ON_ERROR),
                'headers' => $this->comparedHeaders($request->headers()),
            ];
            $exchange['answers'][] = ['status' => $response->getStatusCode(), 'body' => (string) $response->getBody()];

            return $answer;
        });

        $reply = $this->relay(self::RELAY_STOP);

        HostContract::of('relays/hook-exchange.json')->assertHolds([
            'payload' => self::RELAY_STOP,
            'profile' => $this->start->pin()->key,
            'profileRevision' => $this->start->pin()->revision,
            ...$exchange,
            'printed' => ['stdout' => $reply->stdout, 'stderr' => $reply->stderr, 'exitCode' => $reply->exitCode],
        ], []);
    }

    public function test_during_an_outage_the_main_agent_goes_on_and_the_bypass_is_logged(): void
    {
        $this->prepareRelay();
        Http::fake(fn () => throw JournalUnreachable::now());

        $reply = $this->relay(self::RELAY_SHELL);

        $this->assertSame('{"hookSpecificOutput":{"hookEventName":"PreToolUse"}}', $reply->stdout);
        $this->assertStringContainsString(
            '"nativeEvent":"PreToolUse","failure":"unreachable"',
            (string) file_get_contents($this->bypassLog),
        );
    }

    public function test_during_an_outage_a_main_agent_is_still_refused_saved_accounts_and_logs_no_bypass(): void
    {
        $this->prepareRelay();
        Http::fake(fn () => throw JournalUnreachable::now());

        $reply = $this->relay(self::RELAY_ACCOUNT_READ);

        $this->assertEquals(TestText::outages()->protectedRefusal('PreToolUse'), $reply);
        $this->assertFileDoesNotExist($this->bypassLog);
    }

    public function test_during_an_outage_a_tool_call_the_relay_cannot_read_is_refused(): void
    {
        $this->prepareRelay();
        Http::fake(fn () => throw JournalUnreachable::now());

        $reply = $this->relay(
            '{"session_id":"session-1","hook_event_name":"PreToolUse","tool_name":"Read","tool_input":"unreadable"}',
        );

        $this->assertEquals(TestText::outages()->protectedRefusal('PreToolUse'), $reply);
        $this->assertFileDoesNotExist($this->bypassLog);
    }

    public function test_a_gateway_failure_counts_as_an_outage(): void
    {
        $this->prepareRelay();
        Http::fake(['*' => Http::response('', 502)]);

        $this->assertSame('{}', $this->relay(self::RELAY_STOP)->stdout);
        $this->assertFileExists($this->bypassLog);
    }

    /**
     * @return iterable<string, array{int, string}>
     */
    public static function serverAnswers(): iterable
    {
        yield 'forbidden' => [403, ''];

        yield 'not found' => [404, ''];

        yield 'unavailable' => [503, ''];

        yield 'a malformed success' => [200, '{"stdout":'];
    }

    #[DataProvider('serverAnswers')]
    public function test_a_server_answer_is_passed_on_as_a_refusal_and_never_bypassed(int $status, string $body): void
    {
        $this->prepareRelay();
        Http::fake(['*' => Http::response($body, $status)]);

        $reply = $this->relay(self::RELAY_SHELL);

        $this->assertStringContainsString('"permissionDecision":"deny"', $reply->stdout);
        $this->assertFileDoesNotExist($this->bypassLog);
    }

    public function test_a_helper_is_refused_during_an_outage_and_logs_nothing(): void
    {
        $this->prepareRelay();
        Http::fake(fn () => throw JournalUnreachable::now());

        $reply = $this->relay(self::RELAY_SHELL, passesOutages: false);

        $this->assertStringContainsString(TestText::words(AgentText::of('core.drivers.outage')), $reply->stdout);
        $this->assertFileDoesNotExist($this->bypassLog);
    }

    public function test_a_refused_credential_is_not_an_outage(): void
    {
        $this->prepareRelay();
        $this->forwardToTheEndpoint();

        $reply = $this->relay(self::RELAY_SHELL, token: 'not-the-start-token');

        $this->assertSame('deny', json_decode($reply->stdout, true)['hookSpecificOutput']['permissionDecision']);
        $this->assertFileDoesNotExist($this->bypassLog);
    }

    public function test_the_bypasses_are_uploaded_once_the_journal_answers_again(): void
    {
        $this->prepareRelay();
        $this->isJournalDown = true;
        $this->forwardToTheEndpoint();
        $this->relay(self::RELAY_SHELL);
        $this->isJournalDown = false;

        $this->relay(self::RELAY_STOP);

        $this->assertSame(['PreToolUse'], ReportedBypass::query()->pluck('native_event')->all());
        $this->assertSame($this->start->session->id, ReportedBypass::query()->value('agent_session_id'));
        $this->assertFileDoesNotExist($this->bypassLog);
        $this->assertSame(1, HookCall::query()->authorizedFor($this->target())->count());
    }

    public function test_a_lost_reply_is_sent_again_as_the_same_call_and_gets_the_recorded_answer(): void
    {
        $this->prepareRelay();
        $sent = [];
        Http::fake(function (Request $request) use (&$sent) {
            $sent[] = [
                $request->header(SignedCall::ID_HEADER)[0],
                $request->header(SignedCall::ISSUED_AT_HEADER)[0],
                hash('sha256', $request->body()),
            ];
            $response = $this->forward($request);

            if (count($sent) === 1) {
                throw new ConnectionException('The reply was lost.');
            }

            return $response;
        });

        $reply = $this->relay(self::RELAY_STOP);

        $this->assertCount(2, $sent);
        $this->assertSame($sent[0], $sent[1]);
        $this->assertSame(['{}', 0], [$reply->stdout, $reply->exitCode]);
        $this->assertSame(1, HookCall::query()->authorizedFor($this->target())->count());
        $this->assertSame([], glob($this->bypassLog.'.pending/*.json') ?: []);
    }

    public function test_a_retry_past_the_deadline_is_not_sent_and_the_deadline_is_never_extended(): void
    {
        $this->prepareRelay();
        $sent = 0;
        Http::fake(function () use (&$sent) {
            $sent++;
            CarbonImmutable::setTestNow(CarbonImmutable::now()->addSeconds(CallbackEnvelope::DEADLINE_SECONDS + 1));

            throw new ConnectionException('The journal did not answer.');
        });

        $reply = $this->relay(self::RELAY_STOP);

        $this->assertSame(1, $sent);
        $this->assertEquals(TestText::outages()->for(CallFailure::Unreachable, true, 'Stop'), $reply);
        $this->assertCount(1, glob($this->bypassLog.'.pending/*.json') ?: []);
    }

    public function test_two_callbacks_with_the_same_text_get_two_envelopes(): void
    {
        $this->prepareRelay();
        $ids = [];
        Http::fake(function (Request $request) use (&$ids) {
            $ids[] = $request->header(SignedCall::ID_HEADER)[0];

            return $this->forward($request);
        });

        $this->relay(self::RELAY_STOP);
        $this->relay(self::RELAY_STOP);

        $this->assertCount(2, array_unique($ids));
        $this->assertSame(2, HookCall::query()->authorizedFor($this->target())->count());
        $this->assertSame([], glob($this->bypassLog.'.pending/*.json') ?: []);
    }

    private function relay(string $payload, bool $passesOutages = true, string|null $token = null): DriverReply
    {
        $settings = new RelaySettings(
            'http://journal.test',
            $token ?? $this->start->token,
            $this->start->pin(),
            $passesOutages,
            $this->bypassLog,
            accounts: new ProtectedAccounts(['/journal/accounts']),
        );

        return $this->app->make(HookRelay::class)->relay(DefaultDrivers::CLAUDE_CODE, $payload, $settings);
    }

    /**
     * Sends each of the relay's requests through the application's own HTTP kernel, so the relay talks to the real
     * endpoint.
     */
    private function forwardToTheEndpoint(): void
    {
        Http::fake(function (Request $request) {
            if ($this->isJournalDown) {
                throw JournalUnreachable::now();
            }

            return $this->forward($request);
        });
    }

    private function forward(Request $request): PromiseInterface
    {
        $server = [];

        foreach ($request->headers() as $name => $values) {
            $server['HTTP_'.strtoupper(str_replace('-', '_', $name))] = $values[0];
        }

        $server['CONTENT_TYPE'] = 'application/json';
        $this->app->forgetScopedInstances();

        $response = $this->call(
            'POST',
            (string) parse_url($request->url(), PHP_URL_PATH),
            server: $server,
            content: $request->body(),
        );

        return Http::response((string) $response->getContent(), $response->getStatusCode());
    }

    /**
     * The headers both relays must send alike, by lowercase name; the token, signature, time and call id differ on
     * every call and are written as varies.
     *
     * @param  array<string, list<string>>  $headers
     * @return array<string, string>
     */
    private function comparedHeaders(array $headers): array
    {
        $compared = [];

        foreach ($headers as $name => $values) {
            $name = strtolower($name);

            $isCompared = array_any(self::COMPARED_HEADERS, fn (string $start) => str_starts_with($name, $start));

            if ($isCompared) {
                $compared[$name] = in_array($name, self::VARYING_HEADERS, true) ? 'varies' : $values[0];
            }
        }

        ksort($compared);

        return $compared;
    }

    private function preparationState(): PreparationState
    {
        config([Place::HookRuntime->rootSetting() => dirname($this->bypassLog)]);

        return new PreparationState(
            $this->app->make(Files::class),
            FilePath::in(Place::HookRuntime, basename($this->bypassLog).'.preparation.json'),
        );
    }

    /**
     * The relay's bypass log in the temporary folder and its first generation prepared; the log and its pending
     * uploads are removed with the application.
     */
    private function prepareRelay(): void
    {
        $this->bypassLog = sys_get_temp_dir().'/hook-relay-bypasses-'.getmypid().'.jsonl';
        $preparation = $this->preparationState();
        $preparation->openGeneration('generation-1');
        $preparation->prepare('generation-1');
        $this->beforeApplicationDestroyed(function (): void {
            foreach ([$this->bypassLog, $this->bypassLog.'.preparation.json'] as $file) {
                if (is_file($file)) {
                    unlink($file);
                }
            }

            array_map(unlink(...), glob($this->bypassLog.'.pending/*.json') ?: []);
        });
    }

    public function test_a_stop_waits_for_a_push_another_process_holds_and_then_answers_with_it(): void
    {
        $holder = $this->startLockHolder(taskNumber: 43);

        try {
            $this->waitForLine($holder['stdout'], 'locked');
            $reply = $this->hook('claude-code', $this->stopBody())->assertOk();
        } finally {
            $this->assertSame(self::WAITING_THEN_COMMITTED, stream_get_contents($holder['stdout']));
            proc_close($holder['handle']);
        }

        $this->assertStringContainsString(
            TestText::words(AgentText::of('tasks.unfinished', ['task' => 43])),
            (string) $reply->json('stdout'),
        );
        $this->assertSame(['pushed-by-other-process deny'], array_map(
            fn (WalkStep $step) => "{$step->frameId} {$step->answer->value}",
            HookCall::query()->authorizedFor($this->target())->sole()->steps->steps,
        ));
    }

    public function test_a_replayed_session_start_with_another_program_session_keeps_the_first(): void
    {
        $first = '{"session_id":"driver-session-1","hook_event_name":"SessionStart","source":"startup"}';
        $replayed = '{"session_id":"driver-session-2","hook_event_name":"SessionStart","source":"startup"}';

        $this->hook('claude-code', $first, 'call-start')->assertOk();
        $this->hook('claude-code', $replayed, 'call-start')->assertStatus(409);

        $conversation = $this->start->session->fresh(['currentConversation'])?->currentConversation;
        $this->assertSame('driver-session-1', $conversation?->native_id);
        $this->assertSame(1, HookCall::query()->authorizedFor($this->target())->count());
    }

    /**
     * A separate process that locks the agent's stack row, waits until it sees a hook waiting for it, pushes a frame
     * of the task of this number and commits.
     *
     * @return array{handle: resource, stdout: resource}
     */
    private function startLockHolder(int $taskNumber): array
    {
        $connection = config('database.connections.'.config('database.default'));
        $environment = [
            ...getenv(),
            'LOCK_DB_HOST' => (string) $connection['host'],
            'LOCK_DB_PORT' => (string) $connection['port'],
            'LOCK_DB_DATABASE' => (string) $connection['database'],
            'LOCK_DB_USERNAME' => (string) $connection['username'],
            'LOCK_DB_PASSWORD' => (string) $connection['password'],
            'LOCK_AGENT_ID' => $this->target()->agentId,
            'LOCK_SESSION_ID' => $this->target()->sessionId,
            'LOCK_TASK_ID' => "task-{$taskNumber}",
            'LOCK_TASK_NUMBER' => (string) $taskNumber,
        ];

        $handle = proc_open(
            [PHP_BINARY, base_path('tests/bin/hold-stack-lock.php')],
            [1 => ['pipe', 'w'], 2 => ['pipe', 'w']],
            $pipes,
            base_path(),
            $environment,
        );

        if ($handle === false) {
            throw TestFailure::lockHolderDidNotStart();
        }

        return ['handle' => $handle, 'stdout' => $pipes[1]];
    }

    /**
     * @param  resource  $stream
     */
    private function waitForLine($stream, string $expected): void
    {
        $line = fgets($stream);

        if ($line !== "{$expected}\n") {
            throw TestFailure::lockHolderMessage(var_export($line, true));
        }
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

    /**
     * Agent 7 with session 9, which hold no rows: the storage cases write their own stack and calls for it.
     */
    private function asStoredAgent(): void
    {
        $this->app->instance(
            AgentContext::class,
            new AgentContext(
                TestIds::of(7),
                TestIds::of(9),
                new SignedCall('call-1', CarbonImmutable::now(), str_repeat('a', 64)),
                null,
            ),
        );
    }

    private function storedFrames(): FrameRecords
    {
        return new FrameRecords([
            new FrameRecord(
                'frame-1',
                new StateReference('core.ready', NoSubject::None),
                true,
                1,
                CarbonImmutable::now(),
            ),
            new FrameRecord(
                'frame-2',
                new StateReference('tasks.work', new SubjectReference('42', 3)),
                false,
                1,
                CarbonImmutable::now(),
            ),
        ]);
    }

    private function storedHook(): HookIdentity
    {
        return TestActors::hookIdentity(7, 9, 'hook-1', str_repeat('a', 64));
    }

    private function columnType(string $table, string $column): string
    {
        return (string) DB::table('information_schema.columns')
            ->where('table_name', $table)
            ->where('column_name', $column)
            ->value('data_type');
    }

    /**
     * The stack of test agent $agent, whose session is ten times its number.
     */
    private static function retainedTarget(int $agent): StackTarget
    {
        return TestActors::stack($agent, $agent * 10);
    }

    private function retainedStack(int $agent): AgentStackRow
    {
        $row = new AgentStackRow();
        $row->startFor(
            self::retainedTarget($agent),
            new FrameRecords(
                [
                    new FrameRecord(
                        'ready',
                        new StateReference('core.ready', NoSubject::None),
                        true,
                        1,
                        CarbonImmutable::now(),
                    ),
                ],
            ),
            new TickingTypes([]),
        );

        return $row;
    }

    private function recordCall(int $agent, string $hookId): HookCall
    {
        $target = self::retainedTarget($agent);
        $call = new HookCall();
        $call->recordFor(
            new HookIdentity($target->agentId, $target->sessionId, $hookId, str_repeat('a', 64)),
            RecordedAnswer::of(AnswerType::Allow, '{}'),
            RecordedSteps::of([]),
        );

        return $call;
    }

    private function moveDays(int $days): void
    {
        CarbonImmutable::setTestNow(CarbonImmutable::now()->addDays($days));
        $this->travelTo(CarbonImmutable::now());
    }
}
