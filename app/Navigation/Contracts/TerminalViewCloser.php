<?php

declare(strict_types=1);

namespace App\Navigation\Contracts;

use App\Support\ActorReference;
use Carbon\CarbonImmutable;

/**
 * Ends a viewer's terminal views of an agent, as when the viewer may no longer inspect it.
 */
interface TerminalViewCloser
{
    /**
     * Closes every terminal view the viewer has open on the agent.
     */
    public function closeAllFor(string $agentId, ActorReference $viewer, CarbonImmutable $now): void;
}
