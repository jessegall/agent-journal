<?php

declare(strict_types=1);

namespace App\Skills\Events;

use App\Contracts\Event;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

/**
 * A launch asked for its skill set to be published. Raised after the launch committed, so the publication is written
 * from committed intent before the host takes the grant.
 */
final readonly class LaunchSkillsIntended implements Event, ShouldDispatchAfterCommit
{
    public function __construct(
        public string $publicationId,
    ) {}
}
