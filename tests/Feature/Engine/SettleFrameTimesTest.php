<?php

declare(strict_types=1);

namespace Tests\Feature\Engine;

use App\Commands\Agents\SettleFrameTimes\SettleFrameTimesCommand;
use App\Contracts\Bus\CommandBus;
use App\Exceptions\EngineAccessRefused;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentStackRow;
use App\Models\Agents\EngineFrameTime;
use App\Support\EngineAccess;
use App\Support\PruneHookHistory;
use App\Support\StartSessions;
use App\Values\FrameSettlement;
use App\Values\StackTarget;
use Carbon\CarbonImmutable;
use Closure;
use Illuminate\Database\Events\QueryExecuted;
use Illuminate\Support\Facades\DB;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\CommitsHookRows;
use Tests\Support\Engine\RunsEnginePasses;
use Tests\TestCase;

/**
 * The engine settles the timing checkpoints of a batch of frames in one statement, moves them on the next settlement,
 * only under a grant that covers their stacks, and loses them with their pruned stack.
 */
final class SettleFrameTimesTest extends TestCase
{
    use CommitsHookRows;
    use RunsEnginePasses;

    private const array TABLES = [
        'agents',
        'agent_sessions',
        'session_tokens',
        'agent_stacks',
        'hook_calls',
        'engine_frame_times',
    ];

    private StackTarget $target;

    private AgentStackRow $stack;

    protected function setUp(): void
    {
        parent::setUp();

        $session = $this->app->make(StartSessions::class)->start(
            Agent::create('Test agent', 'main-agent'),
            TestSelections::of('claude-code'),
            TestSelections::requestId(),
        )->session;
        $this->target = new StackTarget($session->agent_id, $session->id);
        $this->stack = AgentStackRow::query()->authorizedFor($this->target)->sole();
    }

    public function test_three_frames_settle_in_one_statement_and_a_second_settlement_moves_them(): void
    {
        $writes = 0;
        DB::listen(function (QueryExecuted $query) use (&$writes): void {
            $writes += str_starts_with($query->sql, 'insert into "engine_frame_times"') ? 1 : 0;
        });

        $this->settleUnderTiming(CarbonImmutable::parse('2026-11-18 12:00:00.250000'));
        $this->assertSame(1, $writes);
        $this->settleUnderTiming(CarbonImmutable::parse('2026-11-18 12:00:01.500000'));

        $this->assertSame(2, $writes);
        $this->assertEquals(
            array_fill_keys(['frame-1', 'frame-2', 'frame-3'], CarbonImmutable::parse('2026-11-18 12:00:01.500000')),
            EngineFrameTime::settledAtFor(['frame-1', 'frame-2', 'frame-3']),
        );
    }

    public function test_a_frame_grant_settles_its_own_stack_only_and_no_grant_settles_nothing(): void
    {
        $settlements = $this->settlements(CarbonImmutable::parse('2026-11-18 12:00:00'));

        $this->pass(function () use ($settlements): void {
            $this->app->make(EngineAccess::class)->grantFrame($this->target, 'frame-1');
            $this->app->make(CommandBus::class)->run(new SettleFrameTimesCommand($settlements));
        });
        $this->assertCount(3, EngineFrameTime::settledAtFor(['frame-1', 'frame-2', 'frame-3']));

        $this->assertThrows(fn () => $this->pass(fn () => $this->app->make(
            CommandBus::class,
        )->run(new SettleFrameTimesCommand([
            FrameSettlement::at(
                new StackTarget($this->target->agentId, 'another-session'),
                $this->stack->id,
                'frame-4',
                CarbonImmutable::now(),
            ),
        ]))), EngineAccessRefused::class);
        $this->assertSame([], EngineFrameTime::settledAtFor(['frame-4']));
    }

    public function test_pruning_a_closed_stack_removes_its_checkpoints(): void
    {
        $this->settleUnderTiming(CarbonImmutable::parse('2026-11-18 12:00:00'));
        $this->stack->closeAt(CarbonImmutable::now()->subYears(5));

        $this->app->make(PruneHookHistory::class)->prune();

        $this->assertSame([], EngineFrameTime::settledAtFor(['frame-1', 'frame-2', 'frame-3']));
    }

    private function settleUnderTiming(CarbonImmutable $settledAt): void
    {
        $this->pass(function () use ($settledAt): void {
            $this->app->make(EngineAccess::class)->grantMaintenance(SettleFrameTimesCommand::MAINTENANCE_SCOPE);
            $this->app->make(CommandBus::class)->run(new SettleFrameTimesCommand($this->settlements($settledAt)));
        });
    }

    /**
     * @return list<FrameSettlement>
     */
    private function settlements(CarbonImmutable $settledAt): array
    {
        return array_map(
            fn (string $frameId) => FrameSettlement::at($this->target, $this->stack->id, $frameId, $settledAt),
            ['frame-1', 'frame-2', 'frame-3'],
        );
    }

    /**
     * @param  Closure(): void  $work
     */
}
