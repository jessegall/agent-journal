<?php

declare(strict_types=1);

namespace App\Stacks\Contracts\Work;

/**
 * Work a hook accepts before the agent's stack is restored, such as new instructions arriving. It runs again when a
 * hook is replayed, so it must change nothing the second time.
 */
interface IncomingWork
{
    /**
     * Takes the work that came in onto the agent's stack.
     */
    public function accept(): void;
}
