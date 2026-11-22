<?php

declare(strict_types=1);

namespace App\Support\Stack;

use App\Contracts\Event;
use App\Declarations\StateMethods;
use App\Support\Inputs\Contracts\HookInput;

/**
 * Selects every live frame of the starting snapshot whose state declares the method, top first.
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

            if ($method === null) {
                continue;
            }

            $selected[] = new SelectedStateMethod($frame, $method);
        }

        return $selected;
    }
}
