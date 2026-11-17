<?php

declare(strict_types=1);

namespace Tests\Feature\Hooks;

use App\Domain\Hooks\Decisions\AnswerKind;
use App\Domain\Hooks\Decisions\NoSubject;
use App\Domain\Hooks\Decisions\StateReference;
use App\Domain\Hooks\HookDeadlineExpired;
use App\Domain\Hooks\HookDigestChanged;
use App\Domain\Hooks\Inputs\CompactionDetails;
use App\Domain\Hooks\Inputs\ContextCompacted;
use App\Domain\Hooks\Inputs\HookIdentity;
use App\Domain\Hooks\Models\AgentStackRow;
use App\Domain\Hooks\Models\HookCall;
use App\Domain\Hooks\OperationDeadline;
use App\Domain\Hooks\Programs\NativeToolInput;
use App\Domain\Hooks\Programs\ProgramReplies;
use App\Domain\Hooks\Programs\ProgramReply;
use App\Domain\Hooks\Programs\RewriteSupport;
use App\Domain\Hooks\Programs\UnsupportedHook;
use App\Domain\Hooks\Stack\HookAnswer;
use App\Domain\Hooks\Stack\WalkStep;
use App\Domain\Tasks\TaskWorkState;
use Closure;
use RuntimeException;
use Tests\Support\CommittedHookStack;
use Tests\TestCase;

final class AgentStateMachineTest extends TestCase
{
    use CommittedHookStack;

    protected function setUp(): void
    {
        parent::setUp();

        $this->launchCommittedStack();
    }

    protected function tearDown(): void
    {
        $this->emptyHookTables();

        parent::tearDown();
    }

    public function test_a_stop_is_answered_recorded_and_the_stack_saved_in_one_commit(): void
    {
        $this->pushState($this->task(42));

        $reply = $this->machine()->answer($this->stop(), $this->capabilities(), new OperationDeadline(3000), $this->stopReply());

        $recorded = HookCall::query()->sole();
        $this->assertSame('block', json_decode($reply->stdout, true)['decision']);
        $this->assertSame($reply->stdout, $recorded->answer->stdout);
        $this->assertSame(AnswerKind::PreventStop, $recorded->answer->kind);
        $this->assertSame(['test.tasks prevent_stop'], array_map(fn (WalkStep $step) => "{$step->stateType} {$step->answer->value}", $recorded->steps->steps));
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
        $this->assertSame(AnswerKind::Rewrite, HookCall::query()->sole()->answer->kind);
    }

    public function test_a_rewrite_the_program_cannot_take_is_refused_and_its_child_is_dropped(): void
    {
        $this->pushState(new StateReference('test.rewriting', NoSubject::None));

        $reply = $this->machine()->answer($this->shell('composer test'), $this->capabilities(RewriteSupport::NeedsApproval), new OperationDeadline(3000), $this->shellReply(RewriteSupport::NeedsApproval));

        $this->assertSame('deny', json_decode($reply->stdout, true)['hookSpecificOutput']['permissionDecision']);
        $this->assertSame(['hooks.main_ready', 'test.rewriting'], $this->storedTypeKeys());
        $this->assertSame(AnswerKind::Deny, HookCall::query()->sole()->answer->kind);
    }

    public function test_a_retry_after_a_lost_response_gets_the_same_bytes_without_changing_the_stack(): void
    {
        $this->pushState($this->task(42));
        $first = $this->machine()->answer($this->stop(), $this->capabilities(), new OperationDeadline(3000), $this->stopReply());
        $versionAfterFirst = AgentStackRow::query()->sole()->version;
        $this->tasks->tasks[42] = TaskWorkState::Finished;

        $retry = $this->machine()->answer($this->stop(), $this->capabilities(), new OperationDeadline(3000), fn () => throw new RuntimeException('A replay renders nothing.'));

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
            $this->machine()->answer($this->stop(), $this->capabilities(), new OperationDeadline(3000), fn () => throw new RuntimeException('The adapter failed.'));
            $this->fail('The adapter failure was swallowed.');
        } catch (RuntimeException) {
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
        return fn (HookAnswer $answer) => ProgramReplies::shell($answer, new NativeToolInput(['command' => 'composer test', 'description' => 'Run the tests']), $rewrites);
    }
}
