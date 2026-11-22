<?php

declare(strict_types=1);

namespace App\Skills\Events;

use App\Contracts\Event;

/**
 * A session's skill set is to be published, at its start or at a later boundary. Raised after the transaction
 * committed, so the publication is written from committed intent; at a start, before the host takes the grant.
 */
final readonly class SessionSkillsIntended implements Event
{
    public function __construct(
        public string $publicationId,
    ) {}
}
