<?php

declare(strict_types=1);

namespace Tests\Feature\Hooks;

use App\Hooks\Decisions\StateReference;
use App\Hooks\Enums\AnswerType;
use App\Hooks\Enums\NoSubject;
use App\Hooks\Enums\RewriteSupport;
use App\Hooks\Exceptions\HookDeadlineExpired;
use App\Hooks\Exceptions\HookDigestChanged;
use App\Hooks\Exceptions\UnsupportedHook;
use App\Hooks\Inputs\CompactionDetails;
use App\Hooks\Inputs\ContextCompacted;
use App\Hooks\Inputs\HookIdentity;
use App\Hooks\Models\AgentStackRow;
use App\Hooks\Models\HookCall;
use App\Hooks\Programs\ProgramReplies;
use App\Hooks\Programs\ProgramReply;
use App\Hooks\Programs\ProgramToolInput;
use App\Hooks\Stack\HookAnswer;
use App\Hooks\Storage\WalkStep;
use App\Hooks\Support\OperationDeadline;
use Closure;
use Domain\Tasks\Enums\TaskWorkState;
use Tests\Fixtures\Hooks\TestFailure;
use Tests\Support\CommittedHookStack;
use Tests\TestCase;

final class AgentStateMachineTest extends TestCase
{
    use CommittedHookStack;

    public function test_a_stop_is_answered_recorded_and_the_stack_saved_in_one_commit(): void
    {
        $this->pushState($this->task(42));

        $reply = $this->machine()->answer($this->stop(), $this->capabilities(), new OperationDeadline(3000), $this->stopReply());

        $recorded = HookCall::query()->sole();
        $this->assertSame('block', json_decode($reply->stdout, true)['decision']);
        $this->assertSame($reply->stdout, $recorded->answer->stdout);
        $this->assertSame(AnswerType::Deny, $recorded->answer->type);
        $this->assertSame(['test.tasks deny'], array_map(fn (WalkStep $step) => "{$step->stateType} {$step->answer->value}", $recorded->steps->steps));
        $this->assertSame(3, AgentStackRow::query()->sole()->version);
    }

    public function test_a_finished_task_is_removed_and_saved_before_the_stop_is_allowed(): void
    {
        $this->pushState($this->task(42));
        $this->tasks->tasks[42] = TaskWorkState::Finished;

        $reply = $this->machine()->answer($this->stop(), $this->capabilities(), new OperationDeadline(3000), $this->stopReply());

        $this->assertSame('{}', $reply->stdout);
        $this->assertSame(['hooks.main_ready'], $this->storedTypeKeys());
    }

    public function test_a_supported_rewrite_keeps_the_child_it_pushed(): void
    {
        $this->pushState(new StateReference('test.rewriting', NoSubject::None));

        $reply = $this->machine()->answer($this->shell('composer test'), $this->capabilities(), new OperationDeadline(3000), $this->shellReply(RewriteSupport::WithoutApproval));

        $this->assertSame('journal run tests', json_decode($reply->stdout, true)['hookSpecificOutput']['updatedInput']['command']);
        $this->assertSame(['hooks.main_ready', 'test.rewriting', 'guide'], $this->storedTypeKeys());
        $this->assertSame(AnswerType::Rewrite, HookCall::query()->sole()->answer->type);
    }

    public function test_a_rewrite_the_program_cannot_take_is_refused_and_its_child_is_dropped(): void
    {
        $this->pushState(new StateReference('test.rewriting', NoSubject::None));

        $reply = $this->machine()->answer($this->shell('composer test'), $this->capabilities(RewriteSupport::NeedsApproval), new OperationDeadline(3000), $this->shellReply(RewriteSupport::NeedsApproval));

        $this->assertSame('deny', json_decode($reply->stdout, true)['hookSpecificOutput']['permissionDecision']);
        $this->assertSame(['hooks.main_ready', 'test.rewriting'], $this->storedTypeKeys());
        $this->assertSame(AnswerType::Deny, HookCall::query()->sole()->answer->type);
    }

    public function test_a_retry_after_a_lost_response_gets_the_same_bytes_without_changing_the_stack(): void
    {
        $this->pushState($this->task(42));
        $first = $this->machine()->answer($this->stop(), $this->capabilities(), new OperationDeadline(3000), $this->stopReply());
        $versionAfterFirst = AgentStackRow::query()->sole()->version;
        $this->tasks->tasks[42] = TaskWorkState::Finished;

        $retry = $this->machine()->answer($this->stop(), $this->capabilities(), new OperationDeadline(3000), fn () => throw TestFailure::renderedOnReplay());

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
        $this->tasks->tasks[42] = TaskWorkState::Finished;

        try {
            $this->machine()->answer($this->stop(), $this->capabilities(), new OperationDeadline(3000), fn () => throw TestFailure::adapterFailed());
            $this->fail('The adapter failure was swallowed.');
        } catch (TestFailure) {
            $this->assertSame(0, HookCall::query()->count());
            $this->assertSame(['hooks.main_ready', 'test.tasks'], $this->storedTypeKeys());
        }
    }

    public function test_a_hook_the_program_does_not_map_is_refused_before_any_write(): void
    {
        $compaction = new ContextCompacted(new HookIdentity(1, 10, 'call-1', self::inputDigest()), new CompactionDetails('compaction-1'));

        try {
            $this->machine()->answer($compaction, $this->capabilities(), new OperationDeadline(3000), $this->stopReply());
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
     * @return Closure(HookAnswer): ProgramReply
     */
    private function stopReply(): Closure
    {
        return fn (HookAnswer $answer) => ProgramReplies::stop($answer);
    }

    /**
     * @return Closure(HookAnswer): ProgramReply
     */
    private function shellReply(RewriteSupport $rewrites): Closure
    {
        return fn (HookAnswer $answer) => ProgramReplies::shell($answer, new ProgramToolInput(['command' => 'composer test', 'description' => 'Run the tests']), $rewrites);
    }
}
