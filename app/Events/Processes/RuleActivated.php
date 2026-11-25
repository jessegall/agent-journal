<?php

declare(strict_types=1);

namespace App\Events\Processes;

use App\Contracts\Events\ActiveRuleChange;
use App\Models\CommandRules\RuleRevision;

/**
 * A project owner made an approved revision of a command rule the active one; raised after the change is committed.
 */
final readonly class RuleActivated implements ActiveRuleChange, ProcessEvent
{
    public function __construct(
        public string $projectId,
        public string $ruleId,
        public int $revision,
        public string $digest,
        public string $reason,
    ) {}

    public static function forRevision(RuleRevision $approved, string $reason): self
    {
        return new self($approved->project_id, $approved->rule_id, $approved->revision, $approved->digest, $reason);
    }

    public function staleReason(): string
    {
        return sprintf(
            'rule-revision-changed: %s is at revision %s; explain the line again for a fresh admission.',
            $this->ruleId,
            $this->revision,
        );
    }
}
