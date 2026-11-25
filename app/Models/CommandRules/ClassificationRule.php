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
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property string $id
 * @property string $project_key
 * @property string $scope_type
 * @property string $scope_owner
 * @property string $scope_version
 * @property string $rule_id
 * @property string $active_revision_id
 * @property int $active_revision
 * @property ClassificationState $state
 * @property string $state_reason
 * @property ?Carbon $created_at
 * @property ?Carbon $updated_at
 * @property RuleRevision $activeRevision
 */
#[Fillable([
    'project_key',
    'scope',
    'rule_id',
    'active_revision_id',
    'active_revision',
    'state',
    'state_reason',
])]
final class ClassificationRule extends Model implements EventSource, ReadableModel
{
    use BoundedReads;
    use HasUlids;
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
            'state' => ClassificationState::class,
        ];
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

        $this->state = ClassificationState::Retired;
        $this->state_reason = $reason;
        $this->assertSaved($this->save());
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
        if ($this->state !== ClassificationState::Active) {
            throw ClassificationRuleRefused::notActive($this->rule_id, $this->state);
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
        $this->state = ClassificationState::Active;
        $this->state_reason = $reason;
        $this->save();
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
