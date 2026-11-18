<?php

declare(strict_types=1);

namespace App\Skills\Events;

use App\Contracts\Event;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

/**
 * A stored skill gained a revision or was retired. Raised after the transaction committed, so a refresh reads the new
 * state; a replayed request raises none.
 */
final readonly class SkillsChanged implements Event, ShouldDispatchAfterCommit
{
    public function __construct(
        public string $skillId,
        public int $revision,
    ) {}
}
