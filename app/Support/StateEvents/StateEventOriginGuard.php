<?php

declare(strict_types=1);

namespace App\Support\StateEvents;

use App\Declarations\StateMethod;
use App\Declarations\StateMethods;
use App\Enums\CommandOriginStatus;
use App\Support\Stack\AgentStack;
use App\Support\Stack\Frames\Frame;
use App\Support\Stack\SelectedStateMethod;
use App\Support\Stack\StateMethodSelector;

/**
 * Checks the same originating frame against the current authorized snapshot in the command transaction.
 */
final readonly class StateEventOriginGuard
{
    public function __construct(
        private StateEventStacks $stacks,
        private StateMethodSelector $selector,
        private StateEventActivity $activity,
        private StateMethods $methods,
    ) {}

    public function check(StateEventOrigin $origin): CommandOriginStatus
    {
        return $this->activity->evaluate($origin->target, fn () => $this->checkFromSnapshot($origin));
    }

    private function checkFromSnapshot(StateEventOrigin $origin): CommandOriginStatus
    {
        $stack = $this->stacks->restoreActive($origin->dispatch, $origin->target);

        if ($stack->isEmpty()) {
            return CommandOriginStatus::TargetUnavailable;
        }

        if ($origin->listenerResult->answersAMoment()) {
            return in_array($origin->frameId(), $stack->get()->frameIds(), true)
                ? CommandOriginStatus::Eligible
                : CommandOriginStatus::Stale;
        }

        foreach ($this->selector->forEvent($stack->get(), $origin->dispatch->event) as $selection) {
            if ($origin->listenerResult->matches($selection)) {
                return CommandOriginStatus::Eligible;
            }
        }

        return $this->settledByItsAnswer($stack->get(), $origin)
            ? CommandOriginStatus::Eligible
            : CommandOriginStatus::Stale;
    }

    /**
     * Whether the frame that answered settled through that very answer, so it no longer hears facts but still issues
     * the commands it answered with, such as an ask's frame asking for the next ask as its ask closes.
     */
    private function settledByItsAnswer(AgentStack $stack, StateEventOrigin $origin): bool
    {
        $settled = array_find(
            $stack->frames(),
            fn (Frame $frame) => $frame->id === $origin->frameId() && $frame->isEnabled() && $frame->isFinished(),
        );

        if ($settled === null) {
            return false;
        }

        $answered = fn (StateMethod $method) => $origin->listenerResult->matches(
            new SelectedStateMethod($settled, $method),
        );

        return $this->methods->methodFor($settled->state::class, $origin->dispatch->event)
            ->map($answered)
            ->getOrElse(false);
    }
}
