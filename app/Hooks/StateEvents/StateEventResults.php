<?php

declare(strict_types=1);

namespace App\Hooks\StateEvents;

use App\Agents\Values\StackTarget;

/**
 * The selected results for one target, in call order.
 */
final readonly class StateEventResults
{
    /**
     * @param  list<StateEventResult>  $listenerResults
     */
    public function __construct(public StackTarget $target, public array $listenerResults) {}

}
