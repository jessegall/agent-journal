<?php

declare(strict_types=1);

namespace Tests\Machinery\Hooks;

use App\Agents\Drivers\Hooks\DriverReplies;
use App\Agents\Drivers\Hooks\DriverReply;
use App\Api\Hooks\AgentStateMachine;
use App\Contracts\Actors\AgentTexts;
use App\Enums\Hooks\AnswerType;
use App\Exceptions\HookDeadlineExpired;
use App\Models\Agents\AgentStackRow;
use App\Models\Drivers\HookCall;
use App\Support\OperationDeadline;
use App\Support\Stack\HookAnswer;
use App\Support\Storage\WalkStep;
use Closure;
use Domain\Tasks\TasksDomain;
use Tests\Fixtures\Hooks\TestFailure;
use Tests\Support\CommittedHookStack;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\TestCase;

#[TestsMachinery(AgentStateMachine::class)]
final class AgentStateMachineTest extends TestCase
{
    use CommittedHookStack;

    /**
     * The domains this test uses beside core.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(TasksDomain::class);
    }

    public function test_a_stop_is_answered_recorded_and_the_stack_saved_in_one_commit(): void
    {
        $this->journal->pushState($this->target, $this->task(42));

        $reply = $this->machine()->answer(
            $this->stop(),
            $this->capabilities(),
            new OperationDeadline(3000),
            $this->stopReply(),
        );

        $recorded = HookCall::query()->sole();
        $this->assertSame('block', json_decode($reply->stdout, true)['decision']);
        $this->assertSame($reply->stdout, $recorded->answer->stdout);
        $this->assertSame(AnswerType::Deny, $recorded->answer->type);
        $this->assertSame(
            ['test.tasks deny'],
            array_map(fn (WalkStep $step) => "{$step->stateType} {$step->answer->value}", $recorded->steps->steps),
        );
        $this->assertSame(3, AgentStackRow::query()->sole()->version);
    }

    public function test_a_retry_after_a_lost_response_gets_the_same_bytes_without_changing_the_stack(): void
    {
        $this->journal->pushState($this->target, $this->task(42));
        $first = $this->machine()->answer(
            $this->stop(),
            $this->capabilities(),
            new OperationDeadline(3000),
            $this->stopReply(),
        );
        $versionAfterFirst = AgentStackRow::query()->sole()->version;
        $this->tasks->finish(42);

        $retry = $this->machine()->answer(
            $this->stop(),
            $this->capabilities(),
            new OperationDeadline(3000),
            fn () => throw TestFailure::renderedOnReplay(),
        );

        $this->assertEquals($first, $retry);
        $this->assertSame(1, HookCall::query()->count());
        $this->assertSame($versionAfterFirst, AgentStackRow::query()->sole()->version);
    }

    public function test_a_failure_before_the_commit_keeps_nothing(): void
    {
        $this->journal->pushState($this->target, $this->task(42));
        $this->tasks->finish(42);

        try {
            $this->machine()->answer(
                $this->stop(),
                $this->capabilities(),
                new OperationDeadline(3000),
                fn () => throw TestFailure::adapterFailed(),
            );
            $this->fail('The adapter failure was swallowed.');
        } catch (TestFailure) {
            $this->assertSame(0, HookCall::query()->count());
            $this->assertSame(['core.ready', 'test.tasks'], $this->storedTypeKeys());
        }
    }

    public function test_a_call_with_no_time_left_is_refused(): void
    {
        $this->expectException(HookDeadlineExpired::class);

        $this->machine()->answer($this->stop(), $this->capabilities(), new OperationDeadline(0), $this->stopReply());
    }

    /**
     * @return Closure(HookAnswer, AgentTexts): DriverReply
     */
    private function stopReply(): Closure
    {
        return fn (HookAnswer $answer, AgentTexts $texts) => DriverReplies::stop($answer, $texts);
    }
}
