<?php

declare(strict_types=1);

namespace App\Events\Skills;

use App\Contracts\Skills\SkillPublicationEvent;

/**
 * A host claimed a skill publication to prepare it, under the fence given.
 */
final readonly class SkillPublicationClaimed extends SkillEvent implements SkillPublicationEvent
{
    public function __construct(public string $publicationId, public int $fence) {}
}
