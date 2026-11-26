<?php

declare(strict_types=1);

namespace App\Events\Skills;

use App\Skills\Contracts\SkillPublicationEvent;
use App\Skills\Enums\PublicationStatus;

/**
 * A session's skill publication moved to another state: delivered, failed, waiting again, superseded or retired.
 */
final readonly class SkillPublicationMoved implements SkillEvent, SkillPublicationEvent
{
    public function __construct(
        public string $publicationId,
        public string $sessionId,
        public PublicationStatus $status,
    ) {}
}
