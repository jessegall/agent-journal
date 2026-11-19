<?php

declare(strict_types=1);

namespace App\Hooks\Programs;

use App\Hooks\Enums\CallFailure;
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

    public const string PROTECTED_REASON = 'The journal is unreachable, so saved program accounts and saved outputs '
        .'stay closed until it is back.';

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

    /**
     * The refusal of a tool call that reaches a saved account while the journal is away, even for a launch that
     * passes outages.
     */
    public static function protectedRefusal(string $nativeEvent): ProgramReply
    {
        return self::refusal($nativeEvent, self::PROTECTED_REASON);
    }

    private static function neutral(string $nativeEvent): ProgramReply
    {
        return $nativeEvent === 'PreToolUse' ? ProgramReplies::allowTool([]) : ProgramReply::emptyObject();
    }

    private static function refusal(string $nativeEvent, string $reason): ProgramReply
    {
        return match ($nativeEvent) {
            'PreToolUse' => ProgramReplies::denyTool($reason, []),
            'UserPromptSubmit' => ProgramReply::json(
                BlockBody::from(['decision' => ProgramStopDecision::Block, 'reason' => $reason]),
            ),
            default => ProgramReply::emptyObject(),
        };
    }
}
