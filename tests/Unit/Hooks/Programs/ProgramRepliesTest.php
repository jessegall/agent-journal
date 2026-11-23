<?php

declare(strict_types=1);

namespace Tests\Unit\Hooks\Drivers;

use App\Enums\DriverPermission;
use App\Enums\HookEvent;
use App\Enums\RewriteSupport;
use App\Exceptions\InvalidStopAnswer;
use App\Support\Decisions\Decision;
use App\Support\Drivers\DriverReplies;
use App\Support\Drivers\DriverReply;
use App\Support\Inputs\Values\DriverToolInput;
use App\Support\Stack\AgentStack;
use App\Support\Stack\HookAnswer;
use App\Values\StackTarget;
use Tests\Fixtures\Hooks\InMemoryStateFactory;
use Tests\TestCase;

final class ProgramRepliesTest extends TestCase
{
    private const string RUN_ALIAS_ADVICE = 'journal run';

    public function test_a_journal_allow_answers_allow_so_the_driver_asks_no_person(): void
    {
        $reply = $this->shell(Decision::allow());

        $this->assertSame('{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"allow"}}', $reply->stdout);
        $this->assertSame(['', 0], [$reply->stderr, $reply->exitCode]);
    }

    public function test_context_rides_along_on_an_allow(): void
    {
        $reply = $this->shell(Decision::allow(), ['Remember rule 7.', 'Task 42 is open.']);

        $this->assertSame(['hookSpecificOutput' => [
            'hookEventName' => 'PreToolUse',
            'permissionDecision' => 'allow',
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
        $original = new DriverToolInput(
            ['command' => 'composer test', 'description' => 'Run the tests', 'timeout' => 120],
        );

        $reply = DriverReplies::shell(
            $this->answer(Decision::rewrite('journal run tests')),
            $original,
            RewriteSupport::WithoutApproval,
        );

        $this->assertSame(['hookSpecificOutput' => [
            'hookEventName' => 'PreToolUse',
            'permissionDecision' => 'allow',
            'updatedInput' => ['command' => 'journal run tests', 'description' => 'Run the tests', 'timeout' => 120],
        ]], json_decode($reply->stdout, true));
    }

    public function test_a_rewrite_the_program_cannot_take_without_approval_is_refused_with_the_journal_command(): void
    {
        $reply = DriverReplies::shell(
            $this->answer(Decision::rewrite('journal run tests')),
            new DriverToolInput(['command' => 'composer test']),
            RewriteSupport::NeedsApproval,
        );

        $this->assertSame('deny', json_decode($reply->stdout, true)['hookSpecificOutput']['permissionDecision']);
        $this->assertStringContainsString(
            self::RUN_ALIAS_ADVICE,
            json_decode($reply->stdout, true)['hookSpecificOutput']['permissionDecisionReason'],
        );
        $this->assertArrayNotHasKey('updatedInput', json_decode($reply->stdout, true)['hookSpecificOutput']);
    }

    public function test_a_held_stop_blocks_with_one_reason_followed_by_the_context(): void
    {
        $reply = DriverReplies::stop(
            $this->answer(Decision::deny('Task 42 still needs work.'), ['Run the phase tests.']),
        );

        $this->assertSame(
            ['decision' => 'block', 'reason' => "Task 42 still needs work.\nRun the phase tests."],
            json_decode($reply->stdout, true),
        );
    }

    public function test_an_allowed_stop_is_an_empty_object(): void
    {
        $this->assertSame('{}', DriverReplies::stop($this->answer(Decision::allow(), ['Optional context.']))->stdout);
    }

    public function test_context_goes_to_an_event_the_agent_reads_on_after_and_never_to_a_session_end(): void
    {
        $answer = $this->answer(Decision::allow(), ['Read the overview.']);

        $started = json_decode(DriverReplies::observation(HookEvent::SessionStart, $answer)->stdout, true);
        $ended = DriverReplies::observation(HookEvent::SessionEnd, $answer);

        $this->assertSame(HookEvent::SessionStart->value, $started['hookSpecificOutput']['hookEventName']);
        $this->assertSame(implode("\n", $answer->context), $started['hookSpecificOutput']['additionalContext']);
        $this->assertEquals(DriverReply::emptyObject(), $ended);
    }

    public function test_a_rewrite_has_no_stop_reply(): void
    {
        $this->expectException(InvalidStopAnswer::class);

        DriverReplies::stop($this->answer(Decision::rewrite('ls')));
    }

    /**
     * User message 19438: only a call the journal admitted is answered allow; a call nobody judged gets no decision,
     * and no reply ever asks a person or ends the driver's turn.
     */
    public function test_only_an_admitted_call_is_allowed_and_no_reply_asks_a_person_or_ends_the_turn(): void
    {
        $admitted = [
            $this->shell(Decision::allow(), ['context']),
            DriverReplies::shell(
                $this->answer(Decision::rewrite('journal run tests')),
                new DriverToolInput(['command' => 'x']),
                RewriteSupport::WithoutApproval,
            ),
        ];
        $others = [
            $this->shell(Decision::deny('No.')),
            DriverReplies::undecidedTool(),
            DriverReplies::stop($this->answer(Decision::allow())),
            DriverReplies::stop($this->answer(Decision::deny('Wait.'))),
        ];

        foreach ($admitted as $reply) {
            $this->assertSame(
                DriverPermission::Allow->value,
                json_decode($reply->stdout, true)['hookSpecificOutput']['permissionDecision'],
            );
        }

        foreach ($others as $reply) {
            $this->assertStringNotContainsString('"allow"', $reply->stdout);
        }

        foreach ([...$admitted, ...$others] as $reply) {
            $this->assertDoesNotMatchRegularExpression('/"ask"|"continue"/', $reply->stdout);
        }
    }

    /**
     * @param  list<string>  $context
     */
    private function shell(Decision $decision, array $context = []): DriverReply
    {
        return DriverReplies::shell(
            $this->answer($decision, $context),
            new DriverToolInput(['command' => 'git status']),
            RewriteSupport::WithoutApproval,
        );
    }

    /**
     * @param  list<string>  $context
     */
    private function answer(Decision $decision, array $context = []): HookAnswer
    {
        return new HookAnswer($decision, $context, [], new AgentStack([], new InMemoryStateFactory(), new StackTarget('agent-1', 'session-1')));
    }
}
