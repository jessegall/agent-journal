<?php

declare(strict_types=1);

namespace App\Stacks\Contracts\Work;

/**
 * A state that may be switched off, so a push of it is declined while it is. It answers from the views it captured
 * when it was built: no I/O, no side effects, the same answer each time for one frame, and an error stays an error
 * rather than becoming false.
 */
interface ConditionalState
{
    /**
     * Whether states of this type may go on a stack now.
     */
    public function isEnabled(): bool;
}
