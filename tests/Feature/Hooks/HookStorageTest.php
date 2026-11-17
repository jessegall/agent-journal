<?php

declare(strict_types=1);

namespace Tests\Feature\Hooks;

use App\Core\Agents\AgentContext;
use App\Core\Agents\SignedCall;
use App\Core\Hooks\Decisions\AnswerKind;
use App\Core\Hooks\Decisions\ChangeKind;
use App\Core\Hooks\Decisions\NoSubject;
use App\Core\Hooks\Decisions\StateReference;
use App\Core\Hooks\Decisions\SubjectReference;
use App\Core\Hooks\Inputs\HookIdentity;
use App\Core\Hooks\Models\AgentStackRow;
use App\Core\Hooks\Models\HookCall;
use App\Core\Hooks\Storage\FrameRecord;
use App\Core\Hooks\Storage\FrameRecords;
use App\Core\Hooks\Storage\RecordedAnswer;
use App\Core\Hooks\Storage\RecordedSteps;
use App\Core\Hooks\Storage\StackStatus;
use App\Core\Hooks\Storage\StackTarget;
use App\Core\Hooks\Storage\StoredValueInvalid;
use App\Core\Hooks\Storage\WalkStep;
use Carbon\CarbonImmutable;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use Tests\Support\HookDatabase;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

final class HookStorageTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_the_tests_run_on_the_dedicated_postgres_database(): void
    {
        $this->assertSame('pgsql', DB::connection()->getDriverName());
        $this->assertSame(HookDatabase::NAME, DB::connection()->getDatabaseName());
    }

    public function test_both_tables_hold_their_payloads_as_jsonb_without_foreign_keys(): void
    {
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
        $frames = $this->frames();
        $row = new AgentStackRow;
        $row->startFor(new StackTarget(7, 9), $frames);

        $stored = AgentStackRow::query()->forTarget(new StackTarget(7, 9))->sole();

        $this->assertEquals($frames, $stored->frames);
        $this->assertSame([7, 9, 1], [$stored->agent_id, $stored->session_id, $stored->version]);
        $this->assertSame(StackStatus::Active, $stored->status);
    }

    public function test_saving_frames_raises_the_version_and_closing_records_the_time(): void
    {
        $row = new AgentStackRow;
        $row->startFor(new StackTarget(7, 9), $this->frames());
        $bottomOnly = new FrameRecords([$this->frames()->all()[0]]);

        $row->saveFrames($bottomOnly);
        $row->closeAt(CarbonImmutable::parse('2026-11-17 08:00:00'));
        $stored = $row->fresh();

        $this->assertNotNull($stored);
        $this->assertSame(2, $stored->version);
        $this->assertEquals($bottomOnly, $stored->frames);
        $this->assertSame(StackStatus::Closed, $stored->status);
        $this->assertSame('2026-11-17 08:00:00', $stored->closed_at?->format('Y-m-d H:i:s'));
    }

    public function test_one_agent_and_session_has_one_stack(): void
    {
        (new AgentStackRow)->startFor(new StackTarget(7, 9), $this->frames());

        $this->expectException(QueryException::class);

        (new AgentStackRow)->startFor(new StackTarget(7, 9), $this->frames());
    }

    public function test_a_hook_call_keeps_its_answer_bytes_and_steps_exactly(): void
    {
        $response = "{\"decision\":\"block\",\"reason\":\"Task 42 still needs work: finish it.\"}\n\t\u{00e9}\u{1F600}";
        $steps = RecordedSteps::of([
            new WalkStep('frame-2', 'tasks.working', 'onStop', AnswerKind::Delegate, ChangeKind::Keep),
            new WalkStep('frame-1', 'hooks.main_ready', 'onStop', AnswerKind::PreventStop, ChangeKind::Push),
        ]);
        $call = new HookCall;
        $call->recordFor($this->hook(), RecordedAnswer::of(AnswerKind::PreventStop, $response), $steps);

        $stored = HookCall::query()->sole();

        $this->assertSame($response, $stored->answer->stdout);
        $this->assertSame(AnswerKind::PreventStop, $stored->answer->kind);
        $this->assertSame($steps->toArray(), $stored->steps->toArray());
        $this->assertSame(ChangeKind::Push, $stored->steps->steps[1]->change);
        $this->assertSame(['hook-1', str_repeat('a', 64)], [$stored->event_id, $stored->input_digest]);
    }

    public function test_one_hook_id_is_recorded_once_per_agent_and_session(): void
    {
        (new HookCall)->recordFor($this->hook(), RecordedAnswer::of(AnswerKind::Allow, '{}'), RecordedSteps::of([]));

        $this->expectException(QueryException::class);

        (new HookCall)->recordFor($this->hook(), RecordedAnswer::of(AnswerKind::Allow, '{}'), RecordedSteps::of([]));
    }

    public function test_the_agent_and_session_cannot_be_mass_assigned(): void
    {
        $this->assertFalse((new AgentStackRow)->isFillable('agent_id'));
        $this->assertFalse((new AgentStackRow)->isFillable('session_id'));
        $this->assertFalse((new HookCall)->isFillable('agent_id'));
        $this->assertFalse((new HookCall)->isFillable('session_id'));
    }

    public function test_frames_in_an_unknown_version_are_refused(): void
    {
        (new AgentStackRow)->startFor(new StackTarget(7, 9), $this->frames());
        DB::table('agent_stacks')->update(['frames' => '{"version":2,"frames":[]}']);

        $this->expectException(StoredValueInvalid::class);

        AgentStackRow::query()->sole()->frames;
    }

    public function test_steps_without_their_fields_are_refused(): void
    {
        (new HookCall)->recordFor($this->hook(), RecordedAnswer::of(AnswerKind::Allow, '{}'), RecordedSteps::of([]));
        DB::table('hook_calls')->update(['steps' => '{"version":1,"steps":[{"frameId":"frame-1"}]}']);

        $this->expectException(StoredValueInvalid::class);

        HookCall::query()->sole()->steps;
    }

    public function test_a_stack_and_a_hook_call_can_be_linked(): void
    {
        $stack = new AgentStackRow;
        $stack->startFor(new StackTarget(7, 9), $this->frames());
        $call = new HookCall;
        $call->recordFor($this->hook(), RecordedAnswer::of(AnswerKind::Allow, '{}'), RecordedSteps::of([]));

        $stack->linkTo($call);

        $this->assertTrue($call->isLinkedTo($stack));
    }

    protected function setUp(): void
    {
        parent::setUp();

        $this->app->instance(AgentContext::class, new AgentContext(7, 9, 'hooks.main_ready', new SignedCall('call-1', CarbonImmutable::now(), str_repeat('a', 64))));
    }

    private function frames(): FrameRecords
    {
        return new FrameRecords([
            new FrameRecord('frame-1', new StateReference('hooks.main_ready', NoSubject::None), true, 1),
            new FrameRecord('frame-2', new StateReference('tasks.working', new SubjectReference(42, 3)), false, 1),
        ]);
    }

    private function hook(): HookIdentity
    {
        return new HookIdentity(7, 9, 'hook-1', str_repeat('a', 64));
    }

    private function columnType(string $table, string $column): string
    {
        return (string) DB::table('information_schema.columns')
            ->where('table_name', $table)
            ->where('column_name', $column)
            ->value('data_type');
    }
}
