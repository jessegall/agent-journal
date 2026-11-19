<?php

declare(strict_types=1);

namespace App\Hooks\Programs;

use App\Hooks\Enums\CallFailure;
use App\Hooks\Enums\HookEvent;
use App\Hooks\Enums\ProgramStopDecision;

/**
 * The reply the host gives a program when a hook call to the journal fails. During an outage a launch granted the
 * neutral
 * reply goes on and the host logs the bypass; any other launch is refused. Any other failure is refused for every
 * launch.
 * The host holds these replies; a journal that is down cannot send them.
 */
final class OutageReply
{
    public const string OUTAGE_REASON = 'The journal is unreachable, so this helper cannot act until it is back.';

    public static function for(CallFailure $failure, bool $passesOutages, string $nativeEvent): ProgramReply
    {
        if ($failure->isOutage() && $passesOutages) {
            return self::neutral($nativeEvent);
        }

        return self::refusal(
            $nativeEvent,
            $failure->isOutage() ? self::OUTAGE_REASON : "The journal refused this call ({$failure->value}).",
        );
    }

    private static function neutral(string $nativeEvent): ProgramReply
    {
        return HookEvent::tryFrom($nativeEvent)?->isToolCall() === true
            ? ProgramReplies::allowTool([])
            : ProgramReply::emptyObject();
    }

    private static function refusal(string $nativeEvent, string $reason): ProgramReply
    {
        return match (HookEvent::tryFrom($nativeEvent)) {
            HookEvent::PreToolUse => ProgramReplies::denyTool($reason, []),
            HookEvent::UserPromptSubmit => ProgramReply::json(
                BlockBody::from(['decision' => ProgramStopDecision::Block, 'reason' => $reason]),
            ),
            default => ProgramReply::emptyObject(),
        };
    }
}
