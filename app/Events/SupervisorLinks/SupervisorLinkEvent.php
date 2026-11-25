<?php

declare(strict_types=1);

namespace App\Events\SupervisorLinks;

use App\Contracts\Events\Event;

/**
 * A fact about a supervisor link, the route an agent's asks take: every event of that subject implements it, so a listener
 * typed on it hears them all.
 */
interface SupervisorLinkEvent extends Event
{
    public string $linkId { get; }
}
