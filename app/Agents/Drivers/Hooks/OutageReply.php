<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Hooks;

use App\Contracts\Actors\AgentTexts;
use App\Enums\Drivers\DriverStopDecision;
use App\Enums\Hooks\CallFailure;
use App\Enums\Hooks\HookEvent;
use App\Values\AgentText;

/**
 * The reply the host gives a driver when a hook call to the journal fails. During an outage a start granted the
 * neutral
 * reply goes on and the host logs the bypass; any other start is refused. Any other failure is refused for every
 * start.
 * The host holds these replies; a journal that is down cannot send them.
 */
final readonly class OutageReply
{
    public function __construct(private AgentTexts $texts) {}

    public function for(CallFailure $failure, bool $passesOutages, string $nativeEvent): DriverReply
    {
        if ($failure->isOutage() && $passesOutages) {
            return $this->neutral($nativeEvent);
        }

        $reason = $failure->isOutage()
            ? AgentText::of('core.drivers.outage')
            : AgentText::of('core.drivers.call_refused', ['failure' => $failure->value]);

        return $this->refusal($nativeEvent, $reason);
    }

    /**
     * The refusal of a tool call while the driver's current context generation is not prepared yet: for every
     * start, also while the journal is away, so no tool runs before its context and state reached the driver.
     */
    public function preparationPending(string $nativeEvent): DriverReply
    {
        return $this->refusal($nativeEvent, AgentText::of('core.drivers.preparation_pending'));
    }

    /**
     * The refusal of a tool call that reaches a saved account while the journal is away, even for a start that
     * passes outages.
     */
    public function protectedRefusal(string $nativeEvent): DriverReply
    {
        return $this->refusal($nativeEvent, AgentText::of('core.drivers.outage_protected'));
    }

    /**
     * The answer to a native event the journal does not answer: refused by name on standard error.
     */
    public function unknownEvent(): DriverReply
    {
        $refusal = $this->texts->render(AgentText::of('core.drivers.unknown_event'));

        return DriverReply::refusedOnStandardError($refusal);
    }

    /**
     * The refusal of a tool that would start the driver's own child, which never runs here (rule 36).
     */
    public function ownChildRefusal(string $nativeEvent): DriverReply
    {
        return $this->refusal($nativeEvent, AgentText::of('core.drivers.own_subagents'));
    }

    private function neutral(string $nativeEvent): DriverReply
    {
        $hookEvent = HookEvent::tryFrom($nativeEvent);

        if ($hookEvent?->isToolCall() === true) {
            return DriverReplies::undecidedTool();
        }

        return DriverReply::emptyObject();
    }

    private function refusal(string $nativeEvent, AgentText $refusal): DriverReply
    {
        $reason = $this->texts->render($refusal);

        return match (HookEvent::tryFrom($nativeEvent)) {
            HookEvent::PreToolUse => DriverReplies::denyTool($reason, []),
            HookEvent::UserPromptSubmit => DriverReply::json(
                BlockBody::from(['decision' => DriverStopDecision::Block, 'reason' => $reason]),
            ),
            default => DriverReply::emptyObject(),
        };
    }
}
