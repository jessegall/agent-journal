<?php

declare(strict_types=1);

namespace App\Contracts\Work;

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
