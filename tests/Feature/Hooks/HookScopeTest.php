<?php

declare(strict_types=1);

namespace Tests\Feature\Hooks;

use App\Core\Agents\AgentContextMissing;
use App\Core\Hooks\Decisions\AnswerKind;
use App\Core\Hooks\Decisions\NoSubject;
use App\Core\Hooks\Decisions\StateReference;
use App\Core\Hooks\Inputs\HookIdentity;
use App\Core\Hooks\Models\AgentStackRow;
use App\Core\Hooks\Models\HookCall;
use App\Core\Hooks\Stack\StateTypes;
use App\Core\Hooks\Storage\FrameRecord;
use App\Core\Hooks\Storage\FrameRecords;
use App\Core\Hooks\Storage\RecordedAnswer;
use App\Core\Hooks\Storage\RecordedSteps;
use App\Core\Hooks\Storage\StackTarget;
use Illuminate\Database\Eloquent\Model;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\StartsAgentRequests;
use Tests\TestCase;

final class HookScopeTest extends TestCase
{
    use RefreshHookDatabase;
    use StartsAgentRequests;

    protected function setUp(): void
    {
        parent::setUp();

        $this->storeFor(new StackTarget(1, 10));
        $this->storeFor(new StackTarget(1, 11));
        $this->storeFor(new StackTarget(2, 20));
    }

    public function test_each_request_sees_only_the_rows_of_its_own_agent_and_session(): void
    {
        $stateTypes = $this->app->make(StateTypes::class);

        $this->startRequestAs(1, 10);
        $this->assertSame([[1, 10]], $this->visibleStacks());
        $this->assertSame([[1, 10]], $this->visibleCalls());

        $this->app->forgetScopedInstances();
        $this->startRequestAs(2, 20);

        $this->assertSame([[2, 20]], $this->visibleStacks());
        $this->assertSame([[2, 20]], $this->visibleCalls());
        $this->assertSame($stateTypes, $this->app->make(StateTypes::class));
    }

    public function test_two_sessions_of_one_agent_do_not_see_each_other(): void
    {
        $this->startRequestAs(1, 11);

        $this->assertSame([[1, 11]], $this->visibleStacks());
    }

    public function test_a_query_after_the_request_ended_fails_instead_of_reading_everything(): void
    {
        $this->startRequestAs(1, 10);
        $this->visibleStacks();
        $this->app->forgetScopedInstances();

        $this->expectException(AgentContextMissing::class);

        AgentStackRow::query()->get();
    }

    public function test_the_limit_comes_back_after_the_models_boot_again(): void
    {
        $this->startRequestAs(1, 10);
        $this->visibleStacks();

        Model::clearBootedModels();

        $this->assertSame([[1, 10]], $this->visibleStacks());
        $this->assertSame([[1, 10]], $this->visibleCalls());
    }

    public function test_the_locking_query_is_limited_and_names_its_table(): void
    {
        $this->startRequestAs(2, 20);

        $sql = AgentStackRow::query()->lockForUpdate()->toSql();

        $this->assertStringContainsString('"agent_stacks"."agent_id" = ?', $sql);
        $this->assertStringContainsString('"agent_stacks"."session_id" = ?', $sql);
        $this->assertStringContainsString('for update', $sql);
    }

    public function test_reading_another_session_is_an_explicit_named_query(): void
    {
        $this->startRequestAs(1, 10);
        $other = new StackTarget(2, 20);

        $stack = AgentStackRow::query()->authorizedFor($other)->sole();
        $call = HookCall::query()->authorizedFor($other)->sole();

        $this->assertSame([2, 20], [$stack->agent_id, $stack->session_id]);
        $this->assertSame([2, 20], [$call->agent_id, $call->session_id]);
        $this->assertSame(0, AgentStackRow::query()->forTarget($other)->count());
    }

    private function storeFor(StackTarget $target): void
    {
        (new AgentStackRow)->startFor($target, new FrameRecords([
            new FrameRecord('ready', new StateReference('hooks.main_ready', NoSubject::None), true, 1),
        ]));
        (new HookCall)->recordFor(
            new HookIdentity($target->agentId, $target->sessionId, 'hook-1', str_repeat('a', 64)),
            RecordedAnswer::of(AnswerKind::Allow, '{}'),
            RecordedSteps::of([]),
        );
    }

    /**
     * @return list<array{int, int}>
     */
    private function visibleStacks(): array
    {
        return AgentStackRow::query()->get()->map(fn (AgentStackRow $row) => [$row->agent_id, $row->session_id])->values()->all();
    }

    /**
     * @return list<array{int, int}>
     */
    private function visibleCalls(): array
    {
        return HookCall::query()->get()->map(fn (HookCall $call) => [$call->agent_id, $call->session_id])->values()->all();
    }
}
