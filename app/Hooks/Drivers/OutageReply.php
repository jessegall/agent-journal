<?php

declare(strict_types=1);

namespace App\Hooks\Drivers;

use App\Hooks\Enums\CallFailure;
use App\Hooks\Enums\DriverStopDecision;
use App\Hooks\Enums\HookEvent;

/**
 * The reply the host gives a program when a hook call to the journal fails. During an outage a start granted the
 * neutral
 * reply goes on and the host logs the bypass; any other start is refused. Any other failure is refused for every
 * start.
 * The host holds these replies; a journal that is down cannot send them.
 */
final class OutageReply
{
    public const string OUTAGE_REASON = 'The journal is unreachable, so this helper cannot act until it is back.';

    public const string PREPARATION_PENDING_REASON = 'preparation-pending: the journal has not prepared this '
        .'context yet, so tools wait until its context and state reach the driver.';

    public const string PROTECTED_REASON = 'The journal is unreachable, so saved program accounts and saved outputs '
        .'stay closed until it is back.';

    public static function for(CallFailure $failure, bool $passesOutages, string $nativeEvent): DriverReply
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
     * The refusal of a tool call while the program's current context generation is not prepared yet: for every
     * start, also while the journal is away, so no tool runs before its context and state reached the program.
     */
    public static function preparationPending(string $nativeEvent): DriverReply
    {
        return self::refusal($nativeEvent, self::PREPARATION_PENDING_REASON);
    }

    /**
     * The refusal of a tool call that reaches a saved account while the journal is away, even for a start that
     * passes outages.
     */
    public static function protectedRefusal(string $nativeEvent): DriverReply
    {
        return self::refusal($nativeEvent, self::PROTECTED_REASON);
    }

    private static function neutral(string $nativeEvent): DriverReply
    {
        return HookEvent::tryFrom($nativeEvent)?->isToolCall() === true
            ? DriverReplies::allowTool([])
            : DriverReply::emptyObject();
    }

    private static function refusal(string $nativeEvent, string $reason): DriverReply
    {
        return match (HookEvent::tryFrom($nativeEvent)) {
            HookEvent::PreToolUse => DriverReplies::denyTool($reason, []),
            HookEvent::UserPromptSubmit => DriverReply::json(
                BlockBody::from(['decision' => DriverStopDecision::Block, 'reason' => $reason]),
            ),
            default => DriverReply::emptyObject(),
        };
    }
}
