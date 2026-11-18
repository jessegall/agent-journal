<?php

declare(strict_types=1);

namespace App\Processes\Events;

use App\Contracts\Event;
use App\Processes\Contracts\ChangesActiveRules;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

/**
 * A project owner made an approved revision of a command rule the active one; heard after the change is committed.
 */
final readonly class RuleActivated implements ChangesActiveRules, Event, ShouldDispatchAfterCommit
{
    public function __construct(
        public string $projectKey,
        public string $ruleId,
        public int $revision,
        public string $digest,
        public string $reason,
    ) {}

    public function project(): string
    {
        return $this->projectKey;
    }

    public function staleReason(): string
    {
        return "rule-revision-changed: {$this->ruleId} is at revision {$this->revision}; explain the line again for a fresh admission.";
    }
}
