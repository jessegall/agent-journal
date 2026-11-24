<?php

declare(strict_types=1);

namespace App\Events\Skills;

/**
 * A session's skill set is to be published, at its start or at a later boundary. Raised after the transaction
 * committed, so the publication is written from committed intent; at a start, before the host takes the grant.
 */
final readonly class SessionSkillsIntended extends SkillEvent
{
    public function __construct(
        public string $publicationId,
    ) {}
}
