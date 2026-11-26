<?php

declare(strict_types=1);

namespace App\Contracts\Work;

use App\Stacks\Contracts\Work\IncomingWork;

/**
 * A domain whose incoming work every hook accepts before the agent's stack is restored.
 */
interface IncomingWorkProvider
{
    /**
     * @return list<class-string<IncomingWork>>
     */
    public function incomingWork(): array;
}
