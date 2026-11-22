<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Events\ActiveRuleChange;
use App\Contracts\Events\Event;
use App\Models\ClassificationRule;

/**
 * A project owner retired a command rule: new admissions stop relying on it, processes already started run on.
 */
final readonly class RuleRetired implements ActiveRuleChange, Event
{
    public function __construct(
        public string $projectKey,
        public string $ruleId,
        public int $revision,
        public string $reason,
    ) {}

    public static function forRule(ClassificationRule $rule, string $reason): self
    {
        return new self($rule->project_key, $rule->rule_id, $rule->active_revision, $reason);
    }

    public function project(): string
    {
        return $this->projectKey;
    }

    public function staleReason(): string
    {
        return "rule-revision-changed: {$this->ruleId} was retired; explain the line again for a fresh admission.";
    }
}
