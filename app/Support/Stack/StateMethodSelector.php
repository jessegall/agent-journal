<?php

declare(strict_types=1);

namespace App\Support\Stack;

use App\Contracts\Events\Event;
use App\Declarations\StateMethod;
use App\Declarations\StateMethods;
use App\Support\Inputs\Contracts\HookInput;
use App\Support\States\AgentState;
use Closure;
use PhpOption\Option;

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
        return $this->select($stack, fn (AgentState $state) => Option::fromArraysValue(
            $this->methods->forState($state::class),
            $input->methodName(),
        ));
    }

    /**
     * @return list<SelectedStateMethod>
     */
    public function forEvent(AgentStack $stack, Event $event): array
    {
        return $this->select(
            $stack,
            fn (AgentState $state) => $this->methods->methodFor($state::class, $event)
                ->filter(fn () => $state->hears($event)),
        );
    }

    /**
     * @param  Closure(AgentState): Option<StateMethod>  $methodOf
     * @return list<SelectedStateMethod>
     */
    private function select(AgentStack $stack, Closure $methodOf): array
    {
        $selected = [];

        foreach (array_reverse($stack->frames()) as $frame) {
            if (! $frame->isLive()) {
                continue;
            }

            foreach ($methodOf($frame->state) as $method) {
                $selected[] = new SelectedStateMethod($frame, $method);
            }
        }

        return $selected;
    }
}
