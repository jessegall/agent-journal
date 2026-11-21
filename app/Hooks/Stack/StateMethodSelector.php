<?php

declare(strict_types=1);

namespace App\Hooks\Stack;

use App\Contracts\Event;
use App\Hooks\Declarations\StateMethods;
use App\Hooks\Enums\SelectionReason;
use App\Hooks\Inputs\Contracts\HookInput;

/**
 * Selects the highest match and every lower StackWide match on the starting snapshot.
 */
final readonly class StateMethodSelector
{
    public function __construct(private StateMethods $methods) {}

    /**
     * @return list<SelectedStateMethod>
     */
    public function forHook(AgentStack $stack, HookInput $input): array
    {
        return $this->select($stack, $input->methodName());
    }

    /**
     * @return list<SelectedStateMethod>
     */
    public function forEvent(AgentStack $stack, Event $event): array
    {
        return $this->select($stack, $event::class);
    }

    /**
     * @return list<SelectedStateMethod>
     */
    private function select(AgentStack $stack, string $input): array
    {
        $selected = [];

        foreach (array_reverse($stack->frames()) as $frame) {
            if (! $frame->isLive()) {
                continue;
            }

            $methods = $this->methods->forState($frame->state::class);
            $method = $methods[$input] ?? null;

            if ($method === null || ($selected !== [] && ! $method->stackWide)) {
                continue;
            }

            $reason = $selected === [] ? SelectionReason::FirstMatch : SelectionReason::StackWide;
            $selected[] = new SelectedStateMethod($frame, $method, $reason);
        }

        return $selected;
    }
}
