<?php

declare(strict_types=1);

namespace App\Events\Skills;

use App\Skills\Contracts\SkillPublicationEvent;

/**
 * A skill publication staged the number of files given.
 */
final readonly class SkillPublicationProgressed implements SkillEvent, SkillPublicationEvent
{
    public function __construct(public string $publicationId, public int $filesStaged) {}
}
