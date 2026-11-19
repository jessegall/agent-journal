<?php

declare(strict_types=1);

namespace App\Domains\Contracts;

use App\Hooks\Contracts\IncomingWork;

/**
 * A domain whose incoming work every hook accepts before the agent's stack is restored.
 */
interface ProvidesIncomingWork
{
    /**
     * @return list<class-string<IncomingWork>>
     */
    public function incomingWork(): array;
}
