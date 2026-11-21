<?php

declare(strict_types=1);

namespace App\Contracts;

/**
 * A model that records the facts of its own writes, for the command bus to collect after each save.
 */
interface EventSource
{
    /**
     * Empties the facts recorded so far and answers them, oldest first.
     *
     * @return list<Event>
     */
    public function takeRaisedEvents(): array;
}
