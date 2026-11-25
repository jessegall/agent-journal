<?php

declare(strict_types=1);

namespace Tests\Commands\Agents;

use App\Commands\Agents\HoldAgentStack\HoldAgentStackCommand;
use App\Enums\Engine\NoSubject;
use App\Enums\Hooks\AnswerType;
use App\Models\Agents\AgentStackRow;
use App\Models\Drivers\HookCall;
use App\Support\Inputs\Values\HookIdentity;
use App\Support\PruneHookHistory;
use App\Support\References\StateReference;
use App\Support\Storage\FrameRecord;
use App\Support\Storage\FrameRecords;
use App\Support\Storage\RecordedAnswer;
use App\Support\Storage\RecordedSteps;
use App\Support\Ticks\TickingTypes;
use App\Values\StackTarget;
use Carbon\CarbonImmutable;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TestActors;
use Tests\TestCase;

#[TestsCommand(HoldAgentStackCommand::class)]
final class HoldAgentStackTest extends TestCase
{
    use RefreshHookDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        CarbonImmutable::setTestNow('2026-11-01 08:00:00');
    }

    public function test_a_stack_the_owner_holds_and_its_calls_outlive_their_retention(): void
    {
        $held = $this->stack(1);
        $this->recordCall(1, 'held call');
        $held->closeAt(CarbonImmutable::now());
        $this->journal->owner();
        $this->artisan(
            'agents:stack-hold',
            ['agent' => self::target(1)->agentId, 'session' => self::target(1)->sessionId],
        )
            ->assertSuccessful();
        $this->moveDays(40);

        $pruned = $this->app->make(PruneHookHistory::class)->prune();

        $this->assertSame([0, 0], [$pruned->hookCalls, $pruned->closedStacks]);
        $this->assertTrue(AgentStackRow::query()->authorizedFor(self::target(1))->exists());
        $this->assertSame(1, HookCall::query()->authorizedFor(self::target(1))->count());
    }

    /**
     * The stack of test agent $agent, whose session is ten times its number.
     */
    private static function target(int $agent): StackTarget
    {
        return TestActors::stack($agent, $agent * 10);
    }

    private function stack(int $agent): AgentStackRow
    {
        $row = new AgentStackRow();
        $row->startFor(
            self::target($agent),
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
        $target = self::target($agent);
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
