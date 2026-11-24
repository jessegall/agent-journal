<?php

declare(strict_types=1);

namespace Tests\Feature\Hooks;

use App\Contracts\Actors\AgentTexts;
use App\Enums\AnswerType;
use App\Enums\RewriteSupport;
use App\Exceptions\HookDeadlineExpired;
use App\Exceptions\HookDigestChanged;
use App\Exceptions\UnsupportedHook;
use App\Models\Agents\AgentStackRow;
use App\Models\Drivers\HookCall;
use App\Support\Drivers\DriverReplies;
use App\Support\Drivers\DriverReply;
use App\Support\Inputs\ContextCompacted;
use App\Support\Inputs\Values\CompactionDetails;
use App\Support\Inputs\Values\DriverToolInput;
use App\Support\OperationDeadline;
use App\Support\Stack\HookAnswer;
use App\Support\Storage\WalkStep;
use Closure;
use Domain\Tasks\Enums\TaskState;
use Tests\Fixtures\Hooks\TestFailure;
use Tests\Support\CommittedHookStack;
use Tests\Support\TestActors;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

final class AgentStateMachineTest extends TestCase
{
    use CommittedHookStack;

    private const string ADMISSION_PREFIX = 'journal process run --admission ';

    public function test_a_stop_is_answered_recorded_and_the_stack_saved_in_one_commit(): void
    {
        $this->pushState($this->task(42));

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

    public function test_a_finished_task_is_passed_over_and_stays_stored_when_the_stop_is_allowed(): void
    {
        $this->pushState($this->task(42));
        $this->tasks->tasks[42] = TaskState::Finished;

        $reply = $this->machine()->answer(
            $this->stop(),
            $this->capabilities(),
            new OperationDeadline(3000),
            $this->stopReply(),
        );

        $this->assertSame('{}', $reply->stdout);
        $this->assertSame(['core.ready', 'test.tasks'], $this->storedTypeKeys());
    }

    #[TimeLimit(
        seconds: 5,
        reason: 'It runs Core\'s real admission, which classifies the line against the stored rules.',
    )]
    public function test_a_supported_rewrite_answers_the_admitted_command_and_leaves_the_stack(): void
    {
        $this->pushState($this->rewriting());

        $reply = $this->machine()->answer(
            $this->shell('composer test'),
            $this->capabilities(),
            new OperationDeadline(3000),
            $this->shellReply(RewriteSupport::WithoutApproval),
        );

        $command = json_decode($reply->stdout, true)['hookSpecificOutput']['updatedInput']['command'];
        $this->assertStringStartsWith(self::ADMISSION_PREFIX, $command);
        $this->assertSame(['core.ready', 'test.rewriting'], $this->storedTypeKeys());
        $this->assertSame(AnswerType::Rewrite, HookCall::query()->sole()->answer->type);
    }

    #[TimeLimit(
        seconds: 5,
        reason: 'It runs Core\'s real admission, which classifies the line against the stored rules.',
    )]
    public function test_a_rewrite_the_program_cannot_take_is_refused_and_its_child_is_dropped(): void
    {
        $this->pushState($this->rewriting());

        $reply = $this->machine()->answer(
            $this->shell('composer test'),
            $this->capabilities(RewriteSupport::NeedsApproval),
            new OperationDeadline(3000),
            $this->shellReply(RewriteSupport::NeedsApproval),
        );

        $this->assertSame('deny', json_decode($reply->stdout, true)['hookSpecificOutput']['permissionDecision']);
        $this->assertSame(['core.ready', 'test.rewriting'], $this->storedTypeKeys());
        $this->assertSame(AnswerType::Deny, HookCall::query()->sole()->answer->type);
    }

    public function test_a_retry_after_a_lost_response_gets_the_same_bytes_without_changing_the_stack(): void
    {
        $this->pushState($this->task(42));
        $first = $this->machine()->answer(
            $this->stop(),
            $this->capabilities(),
            new OperationDeadline(3000),
            $this->stopReply(),
        );
        $versionAfterFirst = AgentStackRow::query()->sole()->version;
        $this->tasks->tasks[42] = TaskState::Finished;

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

    public function test_a_retry_with_other_input_is_refused(): void
    {
        $this->machine()->answer($this->stop(), $this->capabilities(), new OperationDeadline(3000), $this->stopReply());
        $this->callAs('call-1', self::inputDigest('other input'));

        $this->expectException(HookDigestChanged::class);

        $this->machine()->answer($this->stop(), $this->capabilities(), new OperationDeadline(3000), $this->stopReply());
    }

    public function test_a_failure_before_the_commit_keeps_nothing(): void
    {
        $this->pushState($this->task(42));
        $this->tasks->tasks[42] = TaskState::Finished;

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

    public function test_a_hook_the_program_does_not_map_is_refused_before_any_write(): void
    {
        $compaction = new ContextCompacted(
            TestActors::hookIdentity(1, 10, 'call-1', self::inputDigest()),
            new CompactionDetails('compaction-1'),
        );

        try {
            $this->machine()->answer(
                $compaction,
                $this->capabilities(),
                new OperationDeadline(3000),
                $this->stopReply(),
            );
            $this->fail('An unmapped hook was answered.');
        } catch (UnsupportedHook) {
            $this->assertSame(0, HookCall::query()->count());
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

    /**
     * @return Closure(HookAnswer, AgentTexts): DriverReply
     */
    private function shellReply(RewriteSupport $rewrites): Closure
    {
        return fn (HookAnswer $answer, AgentTexts $texts) => DriverReplies::shell(
            $answer,
            new DriverToolInput(['command' => 'composer test', 'description' => 'Run the tests']),
            $rewrites,
            $texts,
        );
    }
}
