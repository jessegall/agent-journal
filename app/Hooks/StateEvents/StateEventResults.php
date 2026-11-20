<?php

declare(strict_types=1);

namespace App\Hooks\StateEvents;

use App\Agents\Support\StackTarget;

/**
 * The selected results for one target, in call order.
 */
final readonly class StateEventResults
{
    /**
     * @param  list<StateEventResult>  $all
     */
    public function __construct(public StackTarget $target, public array $all) {}

    public function context(): StateEventContext
    {
        $lines = [];
        $messages = [];

        foreach ($this->all as $result) {
            array_push($lines, ...$result->commands->context);
            array_push($messages, ...$result->commands->messages);
        }

        return new StateEventContext($lines, $messages);
    }
}
