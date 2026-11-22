<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\ActiveRuleChange;
use App\Contracts\Event;
use App\Models\ModuleRuleBundle;

/**
 * A project owner activated a module's rule bundle at one digest; raised after the change is committed.
 */
final readonly class BundleActivated implements ActiveRuleChange, Event
{
    public function __construct(public string $projectKey, public string $module, public string $digest) {}

    public static function forApproval(ModuleRuleBundle $approval): self
    {
        return new self($approval->project_key, $approval->module, $approval->digest);
    }

    public function project(): string
    {
        return $this->projectKey;
    }

    public function staleReason(): string
    {
        return "rule-revision-changed: the rules of {$this->module} were activated; explain the line again.";
    }
}
