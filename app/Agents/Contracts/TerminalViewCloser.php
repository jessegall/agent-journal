<?php

declare(strict_types=1);

namespace App\Agents\Contracts;

use App\Actors\Support\ActorIdentity;
use Carbon\CarbonImmutable;

/**
 * Ends a viewer's terminal views of an agent, as when the viewer may no longer inspect it.
 */
interface TerminalViewCloser
{
    public function closeAllFor(string $agentId, ActorIdentity $viewer, CarbonImmutable $now): void;
}
