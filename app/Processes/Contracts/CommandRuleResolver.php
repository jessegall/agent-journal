<?php

declare(strict_types=1);

namespace App\Processes\Contracts;

use App\Processes\Exceptions\ClassificationUnavailable;
use App\Processes\Models\ModuleRuleBundle;
use App\Processes\Models\RuleRevision;

/**
 * Reads what the current project approved: its active rule revisions and the module rule bundles its owner activated.
 */
interface CommandRuleResolver
{
    /**
     * @return list<RuleRevision>
     *
     * @throws ClassificationUnavailable
     */
    public function activeRevisions(): array;

    /**
     * @return list<ModuleRuleBundle>
     *
     * @throws ClassificationUnavailable
     */
    public function approvedBundles(): array;
}
