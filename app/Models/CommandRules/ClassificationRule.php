<?php

declare(strict_types=1);

namespace App\Models\CommandRules;

use App\Casts\RuleScopeCast;
use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Enums\ClassificationState;
use App\Events\Processes\ClassificationRuleRetired;
use App\Exceptions\ClassificationRuleRefused;
use App\Models\Support\NamedByRuleScope;
use App\Values\CommandRule;
use App\Values\RuleScope;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * One command rule of an owner in a project and the pointer to its active approved revision. Activating, retiring and restoring each name the revision the caller
 * expects to be active, so a change made in between is refused rather than overwritten.
 *
 * @property string $id
 * @property string $project_key
 * @property RuleScope $scope
 * @property string $rule_id
 * @property string $active_revision_id
 * @property int $active_revision
 * @property ClassificationState $state
 * @property string $state_reason
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['project_key', 'scope', 'rule_id', 'active_revision_id', 'active_revision', 'state', 'state_reason'])]
final class ClassificationRule extends Model implements EventSource, ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;
    use NamedByRuleScope;
    use RaisesEvents;

    // ----------[ Constructors ]----------

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'scope' => RuleScopeCast::class,
            'active_revision' => 'integer',
            'state' => ClassificationState::class,
        ];
    }

    // ----------[ Queries ]----------

    /**
     * The project's classification rule of a declaration, or a new one not yet active when it has none.
     */
    public static function forRule(string $projectKey, CommandRule $rule): self
    {
        return self::query()
            ->ofProject($projectKey)
            ->ofRule($rule->scope, $rule->id)
            ->firstOrNew([], [
                'project_key' => $projectKey,
                'scope' => $rule->scope,
                'rule_id' => $rule->id,
                'active_revision' => 0,
            ]);
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

        if ($this->state !== ClassificationState::Active) {
            throw ClassificationRuleRefused::notActive($this->rule_id, $this->state);
        }

        $this->state = ClassificationState::Retired;
        $this->state_reason = $reason;
        $this->assertSaved($this->save());
        $this->raise(new ClassificationRuleRetired($this->id, $reason));
    }

    // ----------[ Answers ]----------

    /**
     * Makes a newer approved revision the active one.
     *
     * @throws ClassificationRuleRefused
     */
    public function activate(RuleRevision $revision, int $expectedRevision): void
    {
        $this->assertExpectedRevision($expectedRevision);
        $this->assertOwnRevision($revision);

        if ($revision->revision <= $this->active_revision) {
            throw ClassificationRuleRefused::notNewer($this->rule_id, $revision->revision, $this->active_revision);
        }

        $this->point($revision, "Revision {$revision->revision} approved.");
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
    }

    /**
     * @throws ClassificationRuleRefused
     */
    public function assertExpectedRevision(int $revision): void
    {
        if ($revision !== $this->active_revision) {
            throw ClassificationRuleRefused::stale($this->rule_id, $revision, $this->active_revision);
        }
    }

    // ----------[ Relations ]----------

    /**
     * @return BelongsTo<RuleRevision, $this>
     */
    public function activeRevision(): BelongsTo
    {
        return $this->belongsTo(RuleRevision::class, 'active_revision_id');
    }

    // ----------[ Internals ]----------

    private function point(RuleRevision $revision, string $reason): void
    {
        $this->active_revision_id = $revision->id;
        $this->active_revision = $revision->revision;
        $this->state = ClassificationState::Active;
        $this->state_reason = $reason;
        $this->save();
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

    // ----------[ Scopes ]----------

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofProject(Builder $query, string $projectKey): void
    {
        $query->where('project_key', $projectKey);
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function active(Builder $query): void
    {
        $query->where('state', ClassificationState::Active->value);
    }
}
