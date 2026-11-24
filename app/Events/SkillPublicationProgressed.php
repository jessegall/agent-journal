<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Skills\SkillPublicationEvent;

/**
 * A skill publication staged the number of files given.
 */
final readonly class SkillPublicationProgressed extends SkillEvent implements SkillPublicationEvent
{
    public function __construct(public string $publicationId, public int $filesStaged) {}
}
