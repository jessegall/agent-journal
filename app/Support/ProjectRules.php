<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Actors\AgentTexts;
use App\Exceptions\ClassificationUnavailable;
use App\Models\CommandRules\ClassificationRule;
use App\Models\CommandRules\ModuleRuleBundle;
use App\Models\CommandRules\RuleRevision;
use Illuminate\Database\QueryException;

/**
 * The current project's active rule revisions, with the reader and proof each check was approved with, and its
 * approved module bundles, read through named scopes; a store that cannot be read refuses classification.
 */
final readonly class ProjectRules
{
    public function __construct(private ProjectKey $projects, private AgentTexts $texts) {}

    /**
     * @return list<RuleRevision>
     *
     * @throws ClassificationUnavailable
     */
    public function activeRevisions(): array
    {
        try {
            return array_values(ClassificationRule::query()
                ->ofProject($this->projects->current())
                ->active()
                ->with('activeRevision')
                ->readLimit(1_000)
                ->get()
                ->map(fn (ClassificationRule $rule): RuleRevision => $rule->activeRevision)
                ->all());
        } catch (QueryException $failure) {
            throw ClassificationUnavailable::storeFailed($failure, $this->texts);
        }
    }

    /**
     * @return list<ModuleRuleBundle>
     *
     * @throws ClassificationUnavailable
     */
    public function approvedBundles(): array
    {
        try {
            return array_values(
                ModuleRuleBundle::query()->ofProject($this->projects->current())->readLimit(500)->get()->all(),
            );
        } catch (QueryException $failure) {
            throw ClassificationUnavailable::storeFailed($failure, $this->texts);
        }
    }
}
