<?php

declare(strict_types=1);

namespace App\Events\Processes;

use App\Models\CommandRules\ClassificationRule;
use App\Processes\Contracts\Events\ActiveRuleChange;

/**
 * A project owner retired a command rule: new admissions stop relying on it, processes already started run on.
 */
final readonly class RuleRetired implements ActiveRuleChange, ProcessEvent
{
    public function __construct(
        public string $projectId,
        public string $ruleId,
        public int $revision,
        public string $reason,
    ) {}

    public static function forRule(ClassificationRule $rule, string $reason): self
    {
        return new self($rule->project_id, $rule->rule_id, $rule->active_revision, $reason);
    }

    public function staleReason(): string
    {
        return "rule-revision-changed: {$this->ruleId} was retired; explain the line again for a fresh admission.";
    }
}
