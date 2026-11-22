<?php

declare(strict_types=1);

namespace Tests\Feature\Hooks;

use App\Actors\Contracts\ActorVisibility;
use App\Actors\Support\ActorStore;
use App\Agents\Exceptions\AgentContextMissing;
use App\Agents\Support\AgentContext;
use App\Agents\Values\StackTarget;
use App\Hooks\Enums\AnswerType;
use App\Hooks\Enums\NoSubject;
use App\Hooks\Inputs\Values\HookIdentity;
use App\Hooks\Models\AgentStackRow;
use App\Hooks\Models\HookCall;
use App\Hooks\Models\Support\AgentScope;
use App\Hooks\References\StateReference;
use App\Hooks\Stack\StateTypes;
use App\Hooks\Storage\FrameRecord;
use App\Hooks\Storage\FrameRecords;
use App\Hooks\Storage\RecordedAnswer;
use App\Hooks\Storage\RecordedSteps;
use App\Hooks\Ticks\TickingTypes;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Model;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\StartsAgentRequests;
use Tests\Support\TestActors;
use Tests\Support\TestIds;
use Tests\TestCase;

final class HookScopeTest extends TestCase
{
    use RefreshHookDatabase;
    use StartsAgentRequests;

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

        $this->startTestAgentRequest(1, 10);
        $this->assertSame([[TestIds::of(1), TestIds::of(10)]], $this->visibleStacks());
        $this->assertSame([[TestIds::of(1), TestIds::of(10)]], $this->visibleCalls());

        $this->app->forgetScopedInstances();
        $this->startTestAgentRequest(2, 20);

        $this->assertSame([[TestIds::of(2), TestIds::of(20)]], $this->visibleStacks());
        $this->assertSame([[TestIds::of(2), TestIds::of(20)]], $this->visibleCalls());
        $this->assertSame($stateTypes, $this->app->make(StateTypes::class));
    }

    public function test_two_sessions_of_one_agent_do_not_see_each_other(): void
    {
        $this->startTestAgentRequest(1, 11);

        $this->assertSame([[TestIds::of(1), TestIds::of(11)]], $this->visibleStacks());
    }

    public function test_a_query_after_the_request_ended_fails_instead_of_reading_everything(): void
    {
        $this->startTestAgentRequest(1, 10);
        $this->visibleStacks();
        $this->app->forgetScopedInstances();

        $this->expectException(AgentContextMissing::class);

        AgentStackRow::query()->get();
    }

    public function test_the_limit_comes_back_after_the_models_boot_again(): void
    {
        $this->startTestAgentRequest(1, 10);
        $this->visibleStacks();

        Model::clearBootedModels();

        $this->assertSame([[TestIds::of(1), TestIds::of(10)]], $this->visibleStacks());
        $this->assertSame([[TestIds::of(1), TestIds::of(10)]], $this->visibleCalls());
    }

    public function test_the_system_acting_sees_no_agent_rows_and_the_agent_still_sees_its_own(): void
    {
        $this->startTestAgentRequest(1, 10);
        $store = $this->app->make(ActorStore::class);

        $this->assertSame(
            [[], []],
            $store->actAsSystem('test', fn () => [$this->visibleStacks(), $this->visibleCalls()]),
        );
        $this->assertSame([[TestIds::of(1), TestIds::of(10)]], $this->visibleStacks());
    }

    public function test_the_agent_scope_matches_nothing_while_the_system_acts(): void
    {
        $this->startTestAgentRequest(1, 10);
        $store = $this->app->make(ActorStore::class);
        $scope = new AgentScope(
            fn (): ActorVisibility => $this->app->make(ActorVisibility::class),
            fn (): AgentContext => $this->app->make(AgentContext::class),
        );

        $query = AgentStackRow::query()->withoutGlobalScopes();
        $store->actAsSystem('test', fn () => $scope->apply($query, new AgentStackRow()));

        $this->assertSame(0, $query->count());
        $this->assertStringNotContainsString('agent_id', $query->toSql());
    }

    public function test_the_locking_query_is_limited_and_names_its_table(): void
    {
        $this->startTestAgentRequest(2, 20);

        $sql = AgentStackRow::query()->lockForUpdate()->toSql();

        $this->assertStringContainsString(self::AGENT_FILTER, $sql);
        $this->assertStringContainsString(self::SESSION_FILTER, $sql);
        $this->assertStringContainsString(self::LOCK_CLAUSE, $sql);
    }

    public function test_reading_another_session_is_an_explicit_named_query(): void
    {
        $this->startTestAgentRequest(1, 10);
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
                new StateReference('hooks.ready', NoSubject::None),
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
