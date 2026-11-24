<?php

declare(strict_types=1);

namespace App\Support\Drivers;

use App\Enums\CallFailure;
use App\Enums\DriverStopDecision;
use App\Enums\HookEvent;
use App\Values\AgentText;

/**
 * The reply the host gives a driver when a hook call to the journal fails. During an outage a start granted the
 * neutral
 * reply goes on and the host logs the bypass; any other start is refused. Any other failure is refused for every
 * start.
 * The host holds these replies; a journal that is down cannot send them.
 */
final class OutageReply
{
    public static function for(CallFailure $failure, bool $passesOutages, string $nativeEvent): DriverReply
    {
        if ($failure->isOutage() && $passesOutages) {
            return self::neutral($nativeEvent);
        }

        $reason = $failure->isOutage()
            ? AgentText::of('core.drivers.outage')
            : AgentText::of('core.drivers.call_refused', ['failure' => $failure->value]);

        return self::refusal($nativeEvent, $reason->text);
    }

    /**
     * The refusal of a tool call while the driver's current context generation is not prepared yet: for every
     * start, also while the journal is away, so no tool runs before its context and state reached the driver.
     */
    public static function preparationPending(string $nativeEvent): DriverReply
    {
        return self::refusal($nativeEvent, AgentText::of('core.drivers.preparation_pending')->text);
    }

    /**
     * The refusal of a tool call that reaches a saved account while the journal is away, even for a start that
     * passes outages.
     */
    public static function protectedRefusal(string $nativeEvent): DriverReply
    {
        return self::refusal($nativeEvent, AgentText::of('core.drivers.outage_protected')->text);
    }

    private static function neutral(string $nativeEvent): DriverReply
    {
        return HookEvent::tryFrom($nativeEvent)?->isToolCall() === true
            ? DriverReplies::undecidedTool()
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
