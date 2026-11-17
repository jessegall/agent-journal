<?php

declare(strict_types=1);

namespace Tests\Unit\Hooks\Programs;

use App\Core\Hooks\Programs\CallFailure;
use App\Core\Hooks\Programs\OutageReply;
use App\Core\Hooks\States\Support\ReadyStateType;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

final class HookOutageTest extends TestCase
{
    /**
     * @return iterable<string, array{CallFailure}>
     */
    public static function answersThatAreNotOutages(): iterable
    {
        yield 'a refused credential' => [CallFailure::Unauthorized];
        yield 'a changed retry' => [CallFailure::Conflict];
        yield 'an unreadable payload' => [CallFailure::Unreadable];
    }

    public function test_during_an_outage_the_main_agent_gets_the_neutral_reply(): void
    {
        $this->assertSame('{"hookSpecificOutput":{"hookEventName":"PreToolUse"}}', OutageReply::for(CallFailure::Unreachable, ReadyStateType::MainAgent, 'PreToolUse')->stdout);
        $this->assertSame('{}', OutageReply::for(CallFailure::Unreachable, ReadyStateType::MainAgent, 'Stop')->stdout);
    }

    public function test_during_an_outage_a_helper_is_refused(): void
    {
        $tool = json_decode(OutageReply::for(CallFailure::Unreachable, ReadyStateType::ReadOnlyHelper, 'PreToolUse')->stdout, true);
        $prompt = json_decode(OutageReply::for(CallFailure::Unreachable, ReadyStateType::ReadOnlyHelper, 'UserPromptSubmit')->stdout, true);

        $this->assertSame('deny', $tool['hookSpecificOutput']['permissionDecision']);
        $this->assertSame(OutageReply::OUTAGE_REASON, $tool['hookSpecificOutput']['permissionDecisionReason']);
        $this->assertSame('block', $prompt['decision']);
    }

    #[DataProvider('answersThatAreNotOutages')]
    public function test_a_failure_that_is_not_an_outage_never_falls_back_to_neutral_even_for_the_main_agent(CallFailure $failure): void
    {
        $reply = json_decode(OutageReply::for($failure, ReadyStateType::MainAgent, 'PreToolUse')->stdout, true);

        $this->assertFalse($failure->isOutage());
        $this->assertSame('deny', $reply['hookSpecificOutput']['permissionDecision']);
        $this->assertStringContainsString($failure->value, $reply['hookSpecificOutput']['permissionDecisionReason']);
    }

    public function test_endpoint_statuses_name_their_failure(): void
    {
        $this->assertSame(CallFailure::Unauthorized, CallFailure::fromStatus(401));
        $this->assertSame(CallFailure::Conflict, CallFailure::fromStatus(409));
        $this->assertSame(CallFailure::Unreadable, CallFailure::fromStatus(422));
        $this->assertSame(CallFailure::Unreachable, CallFailure::fromStatus(503));
        $this->assertSame(CallFailure::Unreachable, CallFailure::fromStatus(500));
        $this->assertSame(CallFailure::Unreachable, CallFailure::fromStatus(null));
    }

    public function test_no_fallback_reply_grants_a_native_approval(): void
    {
        foreach (CallFailure::cases() as $failure) {
            foreach (ReadyStateType::cases() as $role) {
                foreach (['PreToolUse', 'UserPromptSubmit', 'Stop'] as $event) {
                    $this->assertDoesNotMatchRegularExpression('/"(allow|ask)"/', OutageReply::for($failure, $role, $event)->stdout);
                }
            }
        }
    }
}
