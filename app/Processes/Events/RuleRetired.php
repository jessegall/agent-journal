<?php

declare(strict_types=1);

namespace App\Processes\Events;

use App\Contracts\Event;
use App\Processes\Contracts\ChangesActiveRules;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

/**
 * A project owner retired a command rule: new admissions stop relying on it, processes already started run on.
 */
final readonly class RuleRetired implements ChangesActiveRules, Event, ShouldDispatchAfterCommit
{
    public function __construct(
        public string $projectKey,
        public string $ruleId,
        public int $revision,
        public string $reason,
    ) {}

    public function project(): string
    {
        return $this->projectKey;
    }

    public function staleReason(): string
    {
        return "rule-revision-changed: {$this->ruleId} was retired; explain the line again for a fresh admission.";
    }
}
