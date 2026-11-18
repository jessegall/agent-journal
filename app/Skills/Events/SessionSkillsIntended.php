<?php

declare(strict_types=1);

namespace App\Skills\Events;

use App\Contracts\Event;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

/**
 * A session's skill set is to be published, at its launch or at a later boundary. Raised after the transaction
 * committed, so the publication is written from committed intent; at a launch, before the host takes the grant.
 */
final readonly class SessionSkillsIntended implements Event, ShouldDispatchAfterCommit
{
    public function __construct(
        public string $publicationId,
    ) {}
}
