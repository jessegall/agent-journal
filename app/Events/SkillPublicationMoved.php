<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Skills\SkillPublicationEvent;
use App\Enums\PublicationState;

/**
 * A session's skill publication moved to another state: delivered, failed, waiting again, superseded or retired.
 */
final readonly class SkillPublicationMoved extends SkillEvent implements SkillPublicationEvent
{
    public function __construct(
        public string $publicationId,
        public string $sessionId,
        public PublicationState $state,
    ) {}
}
