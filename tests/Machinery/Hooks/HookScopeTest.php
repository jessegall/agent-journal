<?php

declare(strict_types=1);

namespace Tests\Machinery\Hooks;

use App\Enums\Engine\NoSubject;
use App\Enums\Hooks\AnswerType;
use App\Exceptions\AgentContextMissing;
use App\Models\Agents\AgentStackRow;
use App\Models\Drivers\HookCall;
use App\Support\ActorStore;
use App\Support\Inputs\Values\HookIdentity;
use App\Support\References\StateReference;
use App\Support\Stack\StateTypes;
use App\Support\Storage\FrameRecord;
use App\Support\Storage\FrameRecords;
use App\Support\Storage\RecordedAnswer;
use App\Support\Storage\RecordedSteps;
use App\Support\Ticks\TickingTypes;
use App\Values\StackTarget;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Model;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TestActors;
use Tests\Support\TestIds;
use Tests\TestCase;

#[TestsMachinery(FrameRecords::class)]
final class HookScopeTest extends TestCase
{
    use RefreshHookDatabase;

    private const string AGENT_FILTER = '"agent_stacks"."agent_id" = ?';

    private const string SESSION_FILTER = '"agent_stacks"."session_id" = ?';

    private const string LOCK_CLAUSE = 'for update';

    protected function setUp(): void
    {
        parent::setUp();

        $this->storeFor(TestActors::stack(1, 10));
        $this->storeFor(TestActors::stack(1, 11));
        $this->storeFor(TestActors::stack(2, 20));
    }

    public function test_each_request_sees_only_the_rows_of_its_own_agent_and_session(): void
    {
        $stateTypes = $this->app->make(StateTypes::class);

        $this->journal->actAsAgentIds(TestIds::of(1), TestIds::of(10));
        $this->assertSame([[TestIds::of(1), TestIds::of(10)]], $this->visibleStacks());
        $this->assertSame([[TestIds::of(1), TestIds::of(10)]], $this->visibleCalls());

        $this->app->forgetScopedInstances();
        $this->journal->actAsAgentIds(TestIds::of(2), TestIds::of(20));

        $this->assertSame([[TestIds::of(2), TestIds::of(20)]], $this->visibleStacks());
        $this->assertSame([[TestIds::of(2), TestIds::of(20)]], $this->visibleCalls());
        $this->assertSame($stateTypes, $this->app->make(StateTypes::class));
    }

    public function test_two_sessions_of_one_agent_do_not_see_each_other(): void
    {
        $this->journal->actAsAgentIds(TestIds::of(1), TestIds::of(11));

        $this->assertSame([[TestIds::of(1), TestIds::of(11)]], $this->visibleStacks());
    }

    public function test_a_query_after_the_request_ended_fails_instead_of_reading_everything(): void
    {
        $this->journal->actAsAgentIds(TestIds::of(1), TestIds::of(10));
        $this->visibleStacks();
        $this->app->forgetScopedInstances();

        $this->expectException(AgentContextMissing::class);

        AgentStackRow::query()->get();
    }

    public function test_the_limit_comes_back_after_the_models_boot_again(): void
    {
        $this->journal->actAsAgentIds(TestIds::of(1), TestIds::of(10));
        $this->visibleStacks();

        Model::clearBootedModels();

        $this->assertSame([[TestIds::of(1), TestIds::of(10)]], $this->visibleStacks());
        $this->assertSame([[TestIds::of(1), TestIds::of(10)]], $this->visibleCalls());
    }

    public function test_the_system_acting_sees_no_agent_rows_and_the_agent_still_sees_its_own(): void
    {
        $this->journal->actAsAgentIds(TestIds::of(1), TestIds::of(10));
        $store = $this->app->make(ActorStore::class);

        $this->assertSame(
            [[], []],
            $store->actAsSystem('test', fn () => [$this->visibleStacks(), $this->visibleCalls()]),
        );
        $this->assertSame([[TestIds::of(1), TestIds::of(10)]], $this->visibleStacks());
    }

    public function test_the_locking_query_is_limited_and_names_its_table(): void
    {
        $this->journal->actAsAgentIds(TestIds::of(2), TestIds::of(20));

        $sql = AgentStackRow::query()->lockForUpdate()->toSql();

        $this->assertStringContainsString(self::AGENT_FILTER, $sql);
        $this->assertStringContainsString(self::SESSION_FILTER, $sql);
        $this->assertStringContainsString(self::LOCK_CLAUSE, $sql);
    }

    public function test_reading_another_session_is_an_explicit_named_query(): void
    {
        $this->journal->actAsAgentIds(TestIds::of(1), TestIds::of(10));
        $other = TestActors::stack(2, 20);

        $stack = AgentStackRow::query()->authorizedFor($other)->sole();
        $call = HookCall::query()->authorizedFor($other)->sole();

        $this->assertSame([TestIds::of(2), TestIds::of(20)], [$stack->agent_id, $stack->session_id]);
        $this->assertSame([TestIds::of(2), TestIds::of(20)], [$call->agent_id, $call->session_id]);
        $this->assertSame(0, AgentStackRow::query()->forTarget($other)->count());
    }

    private function storeFor(StackTarget $target): void
    {
        new AgentStackRow()->startFor($target, new FrameRecords([
            new FrameRecord(
                'ready',
                new StateReference('core.ready', NoSubject::None),
                true,
                1,
                CarbonImmutable::now(),
            ),
        ]), new TickingTypes([]));
        new HookCall()->recordFor(
            new HookIdentity($target->agentId, $target->sessionId, 'hook-1', str_repeat('a', 64)),
            RecordedAnswer::of(AnswerType::Allow, '{}'),
            RecordedSteps::of([]),
        );
    }

    /**
     * @return list<array{string, string}>
     */
    private function visibleStacks(): array
    {
        return AgentStackRow::query()->get()->map(
            fn (AgentStackRow $row) => [$row->agent_id, $row->session_id],
        )->values()->all();
    }

    /**
     * @return list<array{string, string}>
     */
    private function visibleCalls(): array
    {
        return HookCall::query()->get()->map(
            fn (HookCall $call) => [$call->agent_id, $call->session_id],
        )->values()->all();
    }
}
