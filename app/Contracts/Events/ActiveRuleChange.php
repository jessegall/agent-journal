<?php

declare(strict_types=1);

namespace App\Contracts\Events;

/**
 * An event after which the rules a project classifies with are not what its unfinished runs were admitted under.
 */
interface ActiveRuleChange extends Event
{
    /**
     * The id of the project whose active rules changed.
     */
    public string $projectId { get; }

    /**
     * The stable reason an unfinished run of the project is refused with, and how to go on.
     */
    public function staleReason(): string;
}
