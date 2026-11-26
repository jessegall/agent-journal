<?php

declare(strict_types=1);

namespace App\Events\Processes;

use App\Models\CommandRules\ModuleRuleBundle;
use App\Processes\Contracts\Events\ActiveRuleChange;

/**
 * A project owner activated a module's rule bundle at one digest; raised after the change is committed.
 */
final readonly class BundleActivated implements ActiveRuleChange, ProcessEvent
{
    public function __construct(public string $projectId, public string $module, public string $digest) {}

    public static function forApproval(ModuleRuleBundle $approval): self
    {
        return new self($approval->project_id, $approval->module, $approval->digest);
    }

    public function staleReason(): string
    {
        return "rule-revision-changed: the rules of {$this->module} were activated; explain the line again.";
    }
}
