<?php

declare(strict_types=1);

namespace App\Processes\Events;

use App\Contracts\Event;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

/**
 * A project owner made an approved revision of a command rule the active one; heard after the change is committed.
 */
final readonly class RuleActivated implements Event, ShouldDispatchAfterCommit
{
    public function __construct(
        public string $projectKey,
        public string $ruleId,
        public int $revision,
        public string $digest,
        public string $reason,
    ) {}
}
