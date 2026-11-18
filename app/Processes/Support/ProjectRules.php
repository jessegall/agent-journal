<?php

declare(strict_types=1);

namespace App\Processes\Support;

use App\Processes\Contracts\CommandRuleReader;
use App\Processes\Exceptions\ClassificationUnavailable;
use App\Processes\Models\ClassificationRule;
use App\Processes\Models\ModuleRuleBundle;
use App\Processes\Models\RuleRevision;
use Illuminate\Database\QueryException;

/**
 * The current project's active rule revisions, with the reader and proof each check was approved with, and its
 * approved module bundles, read through named scopes; a store that cannot be read refuses classification.
 */
final readonly class ProjectRules implements CommandRuleReader
{
    public function __construct(private ProjectKey $projects) {}

    public function activeRevisions(): array
    {
        try {
            return ClassificationRule::query()
                ->ofProject($this->projects->current())
                ->active()
                ->with('activeRevision')
                ->readLimit(1_000)
                ->get()
                ->map(fn (ClassificationRule $rule): RuleRevision => $rule->activeRevision)
                ->values()
                ->all();
        } catch (QueryException $failure) {
            throw ClassificationUnavailable::storeFailed($failure);
        }
    }

    public function approvedBundles(): array
    {
        try {
            return ModuleRuleBundle::query()->ofProject($this->projects->current())->readLimit(500)->get()->all();
        } catch (QueryException $failure) {
            throw ClassificationUnavailable::storeFailed($failure);
        }
    }
}
