<?php

declare(strict_types=1);

namespace App\Support\StateEvents;

use App\Enums\CommandOriginStatus;
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

        foreach ($this->selector->forEvent($stack->get(), $origin->dispatch->event) as $selection) {
            if ($origin->listenerResult->matches($selection)) {
                return CommandOriginStatus::Eligible;
            }
        }

        return CommandOriginStatus::Stale;
    }
}
