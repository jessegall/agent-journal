<?php

declare(strict_types=1);

namespace App\Models\CommandRules;

use App\Casts\RuleScopeCast;
use App\CommandRules\Enums\ClassificationStatus;
use App\CommandRules\Exceptions\ClassificationRuleRefused;
use App\CommandRules\Values\RuleScope;
use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Events\Processes\ClassificationRuleActivated;
use App\Events\Processes\ClassificationRuleRestored;
use App\Events\Processes\ClassificationRuleRetired;
use App\Models\Projects\Project;
use App\Models\Support\BelongsToProject;
use App\Models\Support\JournalModel;
use App\Models\Support\NamedByRuleScope;
use App\Projects\Contracts\ProjectOwned;
use App\Records\Contracts\ReadableModel;
use App\Values\CommandRule;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property string $id
 * @property string $project_id
 * @property string $scope_type
 * @property string $scope_owner
 * @property string $scope_version
 * @property string $rule_id
 * @property string $active_revision_id
 * @property int $active_revision
 * @property ClassificationStatus $status
 * @property string $state_reason
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property RuleScope $scope
 * @property-read RuleRevision $activeRevision
 *
 * @mixin \Eloquent
 */
final class ClassificationRule extends JournalModel implements EventSource, ProjectOwned, ReadableModel
{
    use BelongsToProject;
    use BoundedReads;
    use Linkable;
    use NamedByRuleScope;
    use RaisesEvents;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'scope' => RuleScopeCast::class,
            'active_revision' => 'integer',
            'status' => ClassificationStatus::class,
        ];
    }

    // ----------[ Constructors ]----------

    /**
     * The project's classification rule of a declaration, or a new one not yet active when it has none.
     */
    public static function create(Project $project, CommandRule $rule): self
    {
        $existing = self::findForRule($project, $rule);

        if ($existing !== null) {
            return $existing;
        }

        $classification = new self();
        $classification->project_id = $project->id;
        $classification->scope = $rule->scope;
        $classification->rule_id = $rule->id;
        $classification->active_revision = 0;

        return $classification;
    }

    // ----------[ Mutations ]----------

    /**
     * Stops the rule from classifying; its revisions stay recorded and one may be restored.
     *
     * @throws ClassificationRuleRefused
     */
    public function retire(int $expectedRevision, string $reason): void
    {
        $this->assertExpectedRevision($expectedRevision);
        $this->assertActive();

        $this->status = ClassificationStatus::Retired;
        $this->state_reason = $reason;
        $this->saveAndAssert();
        $this->raise(new ClassificationRuleRetired($this->id, $reason));
    }

    /**
     * Makes a newer approved revision the active one.
     *
     * @throws ClassificationRuleRefused
     */
    public function activate(RuleRevision $revision, int $expectedRevision): void
    {
        $this->assertExpectedRevision($expectedRevision);
        $this->assertOwnRevision($revision);
        $this->assertNewer($revision);

        $this->point($revision, "Revision {$revision->revision} approved.");
        $this->raise(new ClassificationRuleActivated($this->id));
    }

    /**
     * Makes an earlier approved revision of this rule the active one again.
     *
     * @throws ClassificationRuleRefused
     */
    public function restoreFrom(RuleRevision $earlier, int $expectedRevision): void
    {
        $this->assertExpectedRevision($expectedRevision);
        $this->assertOwnRevision($earlier);
        $this->point($earlier, "Revision {$earlier->revision} restored.");
        $this->raise(new ClassificationRuleRestored($this->id));
    }

    // ----------[ Relations ]----------

    /**
     * @return BelongsTo<RuleRevision, $this>
     */
    public function activeRevision(): BelongsTo
    {
        return $this->belongsTo(RuleRevision::class, 'active_revision_id');
    }

    // ----------[ Asserts ]----------

    /**
     * @throws ClassificationRuleRefused
     */
    public function assertExpectedRevision(int $revision): void
    {
        if ($revision !== $this->active_revision) {
            throw ClassificationRuleRefused::stale($this->rule_id, $revision, $this->active_revision);
        }
    }

    /**
     * Refuses a rule that is not active.
     *
     * @throws ClassificationRuleRefused
     */
    private function assertActive(): void
    {
        if ($this->status !== ClassificationStatus::Active) {
            throw ClassificationRuleRefused::notActive($this->rule_id, $this->status);
        }
    }

    /**
     * Refuses a revision that is not newer than the active one.
     *
     * @throws ClassificationRuleRefused
     */
    private function assertNewer(RuleRevision $revision): void
    {
        if ($revision->revision <= $this->active_revision) {
            throw ClassificationRuleRefused::notNewer($this->rule_id, $revision->revision, $this->active_revision);
        }
    }

    /**
     * @throws ClassificationRuleRefused
     */
    private function assertOwnRevision(RuleRevision $revision): void
    {
        if (! $revision->belongsToRule($this)) {
            throw ClassificationRuleRefused::otherRule($this->rule_id, $revision->rule_id);
        }
    }

    // ----------[ Internals ]----------

    private function point(RuleRevision $revision, string $reason): void
    {
        $this->active_revision_id = $revision->id;
        $this->active_revision = $revision->revision;
        $this->status = ClassificationStatus::Active;
        $this->state_reason = $reason;
        $this->save();
    }

    // ----------[ Queries ]----------

    /**
     * The rule's classification in the project; none before its first.
     */
    public static function findForRule(Project $project, CommandRule $rule): self|null
    {
        return self::query()->inProject($project->id)->ofRule($rule->scope, $rule->id)->first();
    }

    // ----------[ Scopes ]----------

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function active(Builder $query): void
    {
        $query->where('status', ClassificationStatus::Active->value);
    }

    /**
     * The rows with their activeRevision loaded.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withActiveRevision(Builder $query): void
    {
        $query->with('activeRevision');
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withProject(Builder $query): void
    {
        $query->with('project');
    }
}
