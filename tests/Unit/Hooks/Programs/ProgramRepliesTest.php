<?php

declare(strict_types=1);

namespace Tests\Unit\Hooks\Programs;

use App\Hooks\Decisions\Decision;
use App\Hooks\Enums\RewriteSupport;
use App\Hooks\Exceptions\InvalidShellAnswer;
use App\Hooks\Exceptions\InvalidStopAnswer;
use App\Hooks\Programs\ProgramReplies;
use App\Hooks\Programs\ProgramReply;
use App\Hooks\Programs\ProgramToolInput;
use App\Hooks\Stack\AgentStack;
use App\Hooks\Stack\HookAnswer;
use Tests\Fixtures\Hooks\InMemoryStateFactory;
use Tests\TestCase;

final class ProgramRepliesTest extends TestCase
{
    public function test_a_journal_allow_is_a_neutral_reply_that_names_no_permission(): void
    {
        $reply = $this->shell(Decision::allow());

        $this->assertSame('{"hookSpecificOutput":{"hookEventName":"PreToolUse"}}', $reply->stdout);
        $this->assertSame(['', 0], [$reply->stderr, $reply->exitCode]);
    }

    public function test_context_rides_along_on_a_neutral_reply(): void
    {
        $reply = $this->shell(Decision::allow(), ['Remember rule 7.', 'Task 42 is open.']);

        $this->assertSame(['hookSpecificOutput' => [
            'hookEventName' => 'PreToolUse',
            'additionalContext' => "Remember rule 7.\nTask 42 is open.",
        ]], json_decode($reply->stdout, true));
    }

    public function test_a_denial_carries_its_reason(): void
    {
        $reply = $this->shell(Decision::deny('Save this test as a named command.'));

        $this->assertSame(['hookSpecificOutput' => [
            'hookEventName' => 'PreToolUse',
            'permissionDecision' => 'deny',
            'permissionDecisionReason' => 'Save this test as a named command.',
        ]], json_decode($reply->stdout, true));
    }

    public function test_a_rewrite_keeps_every_other_tool_argument_when_the_program_takes_it(): void
    {
        $original = new ProgramToolInput(['command' => 'composer test', 'description' => 'Run the tests', 'timeout' => 120]);

        $reply = ProgramReplies::shell($this->answer(Decision::rewrite('journal run tests')), $original, RewriteSupport::WithoutApproval);

        $this->assertSame(['hookSpecificOutput' => [
            'hookEventName' => 'PreToolUse',
            'updatedInput' => ['command' => 'journal run tests', 'description' => 'Run the tests', 'timeout' => 120],
        ]], json_decode($reply->stdout, true));
    }

    public function test_a_rewrite_the_program_cannot_take_without_approval_is_refused_with_the_journal_command(): void
    {
        $reply = ProgramReplies::shell($this->answer(Decision::rewrite('journal run tests')), new ProgramToolInput(['command' => 'composer test']), RewriteSupport::NeedsApproval);

        $this->assertSame('deny', json_decode($reply->stdout, true)['hookSpecificOutput']['permissionDecision']);
        $this->assertStringContainsString('journal run', json_decode($reply->stdout, true)['hookSpecificOutput']['permissionDecisionReason']);
        $this->assertArrayNotHasKey('updatedInput', json_decode($reply->stdout, true)['hookSpecificOutput']);
    }

    public function test_a_held_stop_blocks_with_one_reason_followed_by_the_context(): void
    {
        $reply = ProgramReplies::stop($this->answer(Decision::deny('Task 42 still needs work.'), ['Run the phase tests.']));

        $this->assertSame(['decision' => 'block', 'reason' => "Task 42 still needs work.\nRun the phase tests."], json_decode($reply->stdout, true));
    }

    public function test_an_allowed_stop_is_an_empty_object(): void
    {
        $this->assertSame('{}', ProgramReplies::stop($this->answer(Decision::allow(), ['Optional context.']))->stdout);
    }

    public function test_a_rewrite_has_no_stop_reply(): void
    {
        $this->expectException(InvalidStopAnswer::class);

        ProgramReplies::stop($this->answer(Decision::rewrite('ls')));
    }

    public function test_a_delegation_has_no_shell_reply(): void
    {
        $this->expectException(InvalidShellAnswer::class);

        $this->shell(Decision::delegate());
    }

    public function test_no_reply_ever_grants_a_native_approval(): void
    {
        $replies = [
            $this->shell(Decision::allow(), ['context']),
            $this->shell(Decision::deny('No.')),
            ProgramReplies::shell($this->answer(Decision::rewrite('journal run tests')), new ProgramToolInput(['command' => 'x']), RewriteSupport::WithoutApproval),
            ProgramReplies::stop($this->answer(Decision::allow())),
            ProgramReplies::stop($this->answer(Decision::deny('Wait.'))),
        ];

        foreach ($replies as $reply) {
            $this->assertDoesNotMatchRegularExpression('/"(allow|ask)"|"continue"/', $reply->stdout);
        }
    }

    /**
     * @param  list<string>  $context
     */
    private function shell(Decision $decision, array $context = []): ProgramReply
    {
        return ProgramReplies::shell($this->answer($decision, $context), new ProgramToolInput(['command' => 'git status']), RewriteSupport::WithoutApproval);
    }

    /**
     * @param  list<string>  $context
     */
    private function answer(Decision $decision, array $context = []): HookAnswer
    {
        return new HookAnswer($decision, $context, [], new AgentStack([], new InMemoryStateFactory));
    }
}
