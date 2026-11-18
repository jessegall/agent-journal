<?php

declare(strict_types=1);

namespace Tests\Feature\Hooks;

use App\AgentRequests\Support\SignedCall;
use App\Agents\Support\AgentContext;
use App\Agents\Support\StackTarget;
use App\Hooks\Decisions\StateReference;
use App\Hooks\Decisions\SubjectReference;
use App\Hooks\Enums\AnswerType;
use App\Hooks\Enums\NoSubject;
use App\Hooks\Enums\StackStatus;
use App\Hooks\Enums\TransitionType;
use App\Hooks\Exceptions\StoredValueInvalid;
use App\Hooks\Inputs\HookIdentity;
use App\Hooks\Models\AgentStackRow;
use App\Hooks\Models\HookCall;
use App\Hooks\Storage\FrameRecord;
use App\Hooks\Storage\FrameRecords;
use App\Hooks\Storage\RecordedAnswer;
use App\Hooks\Storage\RecordedSteps;
use App\Hooks\Storage\WalkStep;
use App\Hooks\Ticks\TickingTypes;
use Carbon\CarbonImmutable;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use Tests\Support\HookDatabase;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TestIds;
use Tests\TestCase;

final class HookStorageTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_the_tests_run_on_the_dedicated_postgres_database(): void
    {
        $this->assertSame('pgsql', DB::connection()->getDriverName());
        $this->assertSame(HookDatabase::expectedName($this->app), DB::connection()->getDatabaseName());
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
        $row = new AgentStackRow();
        $row->startFor(new StackTarget(TestIds::of(7), TestIds::of(9)), $frames, new TickingTypes([]));

        $stored = AgentStackRow::query()->forTarget(new StackTarget(TestIds::of(7), TestIds::of(9)))->sole();

        $this->assertEquals($frames, $stored->frames);
        $this->assertSame([TestIds::of(7), TestIds::of(9), 1], [$stored->agent_id, $stored->session_id, $stored->version]);
        $this->assertSame(StackStatus::Active, $stored->status);
    }

    public function test_saving_frames_raises_the_version_and_closing_records_the_time(): void
    {
        $row = new AgentStackRow();
        $row->startFor(new StackTarget(TestIds::of(7), TestIds::of(9)), $this->frames(), new TickingTypes([]));
        $bottomOnly = new FrameRecords([$this->frames()->all()[0]]);

        $row->saveFrames($bottomOnly, new TickingTypes([]));
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
        new AgentStackRow()->startFor(new StackTarget(TestIds::of(7), TestIds::of(9)), $this->frames(), new TickingTypes([]));

        $this->expectException(QueryException::class);

        new AgentStackRow()->startFor(new StackTarget(TestIds::of(7), TestIds::of(9)), $this->frames(), new TickingTypes([]));
    }

    public function test_a_hook_call_keeps_its_answer_bytes_and_steps_exactly(): void
    {
        $response = "{\"decision\":\"block\",\"reason\":\"Task 42 still needs work: finish it.\"}\n\t\u{00e9}\u{1F600}";
        $steps = RecordedSteps::of([
            new WalkStep('frame-2', 'tasks.working', 'onStop', AnswerType::Delegate, TransitionType::Keep, 2),
            new WalkStep('frame-1', 'hooks.main_ready', 'onStop', AnswerType::Deny, TransitionType::Push, 1),
        ]);
        $call = new HookCall();
        $call->recordFor($this->hook(), RecordedAnswer::of(AnswerType::Deny, $response), $steps);

        $stored = HookCall::query()->sole();

        $this->assertSame($response, $stored->answer->stdout);
        $this->assertSame(AnswerType::Deny, $stored->answer->type);
        $this->assertSame($steps->toArray(), $stored->steps->toArray());
        $this->assertSame(TransitionType::Push, $stored->steps->steps[1]->transition);
        $this->assertSame(['hook-1', str_repeat('a', 64)], [$stored->event_id, $stored->input_digest]);
    }

    public function test_one_hook_id_is_recorded_once_per_agent_and_session(): void
    {
        new HookCall()->recordFor($this->hook(), RecordedAnswer::of(AnswerType::Allow, '{}'), RecordedSteps::of([]));

        $this->expectException(QueryException::class);

        new HookCall()->recordFor($this->hook(), RecordedAnswer::of(AnswerType::Allow, '{}'), RecordedSteps::of([]));
    }

    public function test_the_agent_and_session_cannot_be_mass_assigned(): void
    {
        $this->assertFalse(new AgentStackRow()->isFillable('agent_id'));
        $this->assertFalse(new AgentStackRow()->isFillable('session_id'));
        $this->assertFalse(new HookCall()->isFillable('agent_id'));
        $this->assertFalse(new HookCall()->isFillable('session_id'));
    }

    public function test_frames_in_an_unknown_version_are_refused(): void
    {
        new AgentStackRow()->startFor(new StackTarget(TestIds::of(7), TestIds::of(9)), $this->frames(), new TickingTypes([]));
        DB::table('agent_stacks')->update(['frames' => '{"version":2,"frames":[]}']);

        $this->expectException(StoredValueInvalid::class);

        AgentStackRow::query()->sole()->frames;
    }

    public function test_steps_without_their_fields_are_refused(): void
    {
        new HookCall()->recordFor($this->hook(), RecordedAnswer::of(AnswerType::Allow, '{}'), RecordedSteps::of([]));
        DB::table('hook_calls')->update(['steps' => '{"version":1,"steps":[{"frameId":"frame-1"}]}']);

        $this->expectException(StoredValueInvalid::class);

        HookCall::query()->sole()->steps;
    }

    public function test_a_stack_and_a_hook_call_can_be_linked(): void
    {
        $stack = new AgentStackRow();
        $stack->startFor(new StackTarget(TestIds::of(7), TestIds::of(9)), $this->frames(), new TickingTypes([]));
        $call = new HookCall();
        $call->recordFor($this->hook(), RecordedAnswer::of(AnswerType::Allow, '{}'), RecordedSteps::of([]));

        $stack->linkTo($call);

        $this->assertTrue($call->isLinkedTo($stack));
    }

    protected function setUp(): void
    {
        parent::setUp();

        $this->app->instance(AgentContext::class, new AgentContext(TestIds::of(7), TestIds::of(9), 'hooks.main_ready', new SignedCall('call-1', CarbonImmutable::now(), str_repeat('a', 64)), null));
    }

    private function frames(): FrameRecords
    {
        return new FrameRecords([
            new FrameRecord('frame-1', new StateReference('hooks.main_ready', NoSubject::None), true, 1, CarbonImmutable::now()),
            new FrameRecord('frame-2', new StateReference('tasks.working', new SubjectReference('42', 3)), false, 1, CarbonImmutable::now()),
        ]);
    }

    private function hook(): HookIdentity
    {
        return new HookIdentity(TestIds::of(7), TestIds::of(9), 'hook-1', str_repeat('a', 64));
    }

    private function columnType(string $table, string $column): string
    {
        return (string) DB::table('information_schema.columns')
            ->where('table_name', $table)
            ->where('column_name', $column)
            ->value('data_type');
    }
}
