<?php

declare(strict_types=1);

namespace App\Core\Hooks\Programs;

use App\Core\Hooks\States\ReadyStateType;

/**
 * The reply the host gives a program when a hook call to the journal fails. During an outage the main agent goes on
 * with a neutral reply and the host logs the bypass; a helper is refused. Any other failure is refused for every role.
 * The host holds these replies; a journal that is down cannot send them.
 */
final class OutageReply
{
    public const string OUTAGE_REASON = 'The journal is unreachable, so this helper cannot act until it is back.';

    public static function for(CallFailure $failure, ReadyStateType $role, string $nativeEvent): ProgramReply
    {
        if ($failure->isOutage() && $role === ReadyStateType::MainAgent) {
            return self::neutral($nativeEvent);
        }

        return self::refusal($nativeEvent, $failure->isOutage() ? self::OUTAGE_REASON : "The journal refused this call ({$failure->value}).");
    }

    private static function neutral(string $nativeEvent): ProgramReply
    {
        return $nativeEvent === 'PreToolUse' ? ProgramReplies::allowTool([]) : ProgramReply::emptyObject();
    }

    private static function refusal(string $nativeEvent, string $reason): ProgramReply
    {
        return match ($nativeEvent) {
            'PreToolUse' => ProgramReplies::denyTool($reason, []),
            'UserPromptSubmit' => ProgramReply::json(BlockBody::from(['decision' => ProgramStopDecision::Block, 'reason' => $reason])),
            default => ProgramReply::emptyObject(),
        };
    }
}
