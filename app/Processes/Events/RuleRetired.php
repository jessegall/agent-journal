<?php

declare(strict_types=1);

namespace App\Processes\Events;

use App\Contracts\Event;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

/**
 * A project owner retired a command rule: new admissions stop relying on it, processes already started run on.
 */
final readonly class RuleRetired implements Event, ShouldDispatchAfterCommit
{
    public function __construct(
        public string $projectKey,
        public string $ruleId,
        public int $revision,
        public string $reason,
    ) {}
}
