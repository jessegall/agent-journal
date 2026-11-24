<?php

declare(strict_types=1);

namespace Tests\Unit\Hooks\Drivers;

use App\Enums\CallFailure;
use App\Support\Drivers\OutageReply;
use App\Values\AgentText;
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
        $reply = OutageReply::for(CallFailure::Unreachable, true, 'PreToolUse');

        $this->assertSame('{"hookSpecificOutput":{"hookEventName":"PreToolUse"}}', $reply->stdout);
        $this->assertSame('{}', OutageReply::for(CallFailure::Unreachable, true, 'Stop')->stdout);
    }

    public function test_during_an_outage_a_helper_is_refused(): void
    {
        $tool = json_decode(OutageReply::for(CallFailure::Unreachable, false, 'PreToolUse')->stdout, true);
        $prompt = json_decode(OutageReply::for(CallFailure::Unreachable, false, 'UserPromptSubmit')->stdout, true);

        $this->assertSame('deny', $tool['hookSpecificOutput']['permissionDecision']);
        $this->assertSame(AgentText::of('core.drivers.outage')->text, $tool['hookSpecificOutput']['permissionDecisionReason']);
        $this->assertSame('block', $prompt['decision']);
    }

    #[DataProvider('answersThatAreNotOutages')]
    public function test_a_failure_that_is_not_an_outage_never_falls_back_to_neutral(CallFailure $failure): void
    {
        $reply = json_decode(OutageReply::for($failure, true, 'PreToolUse')->stdout, true);

        $this->assertFalse($failure->isOutage());
        $this->assertSame('deny', $reply['hookSpecificOutput']['permissionDecision']);
        $this->assertStringContainsString($failure->value, $reply['hookSpecificOutput']['permissionDecisionReason']);
    }

    public function test_endpoint_statuses_name_their_failure(): void
    {
        $this->assertSame(CallFailure::Unauthorized, CallFailure::fromStatus(401));
        $this->assertSame(CallFailure::Conflict, CallFailure::fromStatus(409));
        $this->assertSame(CallFailure::Unreadable, CallFailure::fromStatus(422));
        $this->assertSame(CallFailure::Unauthorized, CallFailure::fromStatus(403));
        $this->assertSame(CallFailure::Refused, CallFailure::fromStatus(404));
        $this->assertSame(CallFailure::Refused, CallFailure::fromStatus(503));
        $this->assertSame(CallFailure::Refused, CallFailure::fromStatus(500));
        $this->assertSame(CallFailure::Unreachable, CallFailure::fromStatus(502));
        $this->assertSame(CallFailure::Unreachable, CallFailure::fromStatus(504));
        $this->assertSame(CallFailure::Unreachable, CallFailure::fromStatus(null));
    }

    public function test_a_server_answer_is_refused_even_for_a_start_that_passes_outages(): void
    {
        foreach ([403, 404, 503] as $status) {
            $reply = json_decode(OutageReply::for(CallFailure::fromStatus($status), true, 'PreToolUse')->stdout, true);

            $this->assertSame('deny', $reply['hookSpecificOutput']['permissionDecision']);
        }
    }

    public function test_no_fallback_reply_grants_a_native_approval(): void
    {
        foreach (CallFailure::cases() as $failure) {
            foreach ([true, false] as $role) {
                foreach (['PreToolUse', 'UserPromptSubmit', 'Stop'] as $event) {
                    $reply = OutageReply::for($failure, $role, $event);

                    $this->assertDoesNotMatchRegularExpression('/"(allow|ask)"/', $reply->stdout);
                }
            }
        }
    }
}
