<?php

declare(strict_types=1);

namespace App\Skills\Contracts;

use App\Contracts\Events\Event;

/**
 * A step of a skill publication: claimed, progressed or moved to another state.
 */
interface SkillPublicationEvent extends Event
{
    public string $publicationId { get; }
}
