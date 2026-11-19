<?php

declare(strict_types=1);

namespace App\Hooks\Contracts;

/**
 * Work a hook accepts before the agent's stack is restored, such as new instructions arriving. It runs again when a
 * hook is replayed, so it must change nothing the second time.
 */
interface IncomingWork
{
    public function accept(): void;
}
