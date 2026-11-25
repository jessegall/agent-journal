<?php

declare(strict_types=1);

namespace Domain\Rules\Models;

use App\Concerns\BoundedReads;
use App\Concerns\HasNumber;
use App\Concerns\Linkable;
use App\Concerns\OrdersById;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Projects\ProjectOwned;
use App\Contracts\Records\Numbered;
use App\Contracts\Records\ReadableModel;
use App\Exceptions\CrossProjectEdge;
use App\Models\Support\BelongsToProjectOrGlobal;
use App\Support\ActorReference;
use App\Support\TextSearch;
use App\Values\ProjectOwner;
use Carbon\CarbonImmutable;
use Domain\Rules\Enums\RuleStatus;
use Domain\Rules\Events\RuleApproved;
use Domain\Rules\Events\RuleDenied;
use Domain\Rules\Events\RuleRemoved;
use Domain\Rules\Exceptions\RuleMissing;
use Domain\Rules\Exceptions\RuleNotProposed;
use Domain\Rules\Exceptions\RuleSelfApproval;
use Domain\Rules\Values\RuleDetails;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

/**
 * @property string $id
 * @property string $number_group_id
 * @property int $number
 * @property string|null $project_id
 * @property string $text
 * @property RuleStatus $status
 * @property string|null $reason
 * @property string|null $replaces_rule_id
 * @property string|null $proposer_type
 * @property string|null $proposer_id
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 *
 * @mixin \Eloquent
 */
final class Rule extends Model implements EventSource, Numbered, ProjectOwned, ReadableModel
{
    use BelongsToProjectOrGlobal;
    use BoundedReads;
    use HasNumber;
    use HasUlids;
    use Linkable;
    use OrdersById;
    use RaisesEvents;

    /**
     * The most characters a rule's text holds.
     */
    public const int TEXT_CHARACTER_LIMIT = 2000;

    /**
     * The most characters the reason given with a rule holds.
     */
    public const int REASON_CHARACTER_LIMIT = 2000;

    /**
     * @var array<string, mixed>
     */
    protected $attributes = ['status' => 'active'];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => RuleStatus::class,
        ];
    }

    // ----------[ Constructors ]----------

    /**
     * A rule proposed in the project with its reason, the rule it would replace if any, and who proposed it; it holds
     * only once the user approves it.
     */
    public static function create(
        string $text,
        string $reason,
        string|null $replacesRuleId,
        ActorReference $proposer,
        ProjectOwner $owner,
    ): self {
        $rule = new self();
        $rule->assignOwner($owner);
        $rule->text = $text;
        $rule->reason = $reason;
        $rule->replaces_rule_id = $replacesRuleId;
        $rule->proposer_type = $proposer->type;
        $rule->proposer_id = $proposer->id;

        $rule->status = RuleStatus::Proposed;
        $rule->save();

        return $rule;
    }

    // ----------[ Mutations ]----------

    public function remove(): void
    {
        $this->status = RuleStatus::Removed;
        $this->assertSaved($this->save());
        $this->raise(new RuleRemoved($this->id));
    }

    /**
     * Makes the proposal hold, approved by an actor other than the one who proposed it, for its own project or as
     * Global; the one change of a rule's project, and only from a project to Global.
     *
     * @throws RuleSelfApproval
     * @throws CrossProjectEdge when the owner is another project, or a replacement would end with another owner
     */
    public function approveBy(ActorReference $approver, ProjectOwner $owner): void
    {
        $this->assertNotProposedBy($approver);
        $this->assertOwnerFits($owner);
        $this->assignOwner($owner);
        $this->closeProposal(RuleStatus::Active);
        $this->raise(new RuleApproved($this->id));
    }

    public function deny(): void
    {
        $this->closeProposal(RuleStatus::Denied);
        $this->raise(new RuleDenied($this->id));
    }

    // ----------[ Predicates ]----------

    public function canBeReviewed(): bool
    {
        return $this->status === RuleStatus::Proposed;
    }

    // ----------[ Transformers ]----------

    /**
     * The rule as a read shows it, with the number of the rule it replaces, if any.
     */
    public function details(int|null $replacedNumber): RuleDetails
    {
        return new RuleDetails(
            $this->id,
            $this->number,
            $this->text,
            $this->status,
            $this->reason,
            $this->proposer_type,
            $this->proposer_id,
            $replacedNumber,
        );
    }

    // ----------[ Asserts ]----------

    /**
     * The owner approved must be the proposal's own project or Global, and a replacement ends with the owner of the
     * rule it replaces.
     *
     * @throws CrossProjectEdge
     */
    private function assertOwnerFits(ProjectOwner $owner): void
    {
        if (! $owner->isGlobal() && $owner->key() !== $this->projectOwner()->key()) {
            throw CrossProjectEdge::forRecord("rule {$this->number}");
        }

        if ($this->replaces_rule_id === null) {
            return;
        }

        $replaced = self::query()->findOrFail($this->replaces_rule_id)->projectOwner();

        if ($replaced->key() !== $owner->key()) {
            throw CrossProjectEdge::forRecord("rule {$this->number}");
        }
    }

    /**
     * Refuses an approval by the actor who proposed the rule.
     *
     * @throws RuleSelfApproval
     */
    private function assertNotProposedBy(ActorReference $approver): void
    {
        if ($this->proposer_type === null) {
            return;
        }

        $proposer = ActorReference::fromStored($this->proposer_type, (string) $this->proposer_id);

        if ($proposer->isSameAs($approver)) {
            throw RuleSelfApproval::forRule();
        }
    }

    /**
     * Refuses to close a rule that is not proposed.
     *
     * @throws RuleNotProposed
     */
    private function assertProposed(): void
    {
        if ($this->status !== RuleStatus::Proposed) {
            throw RuleNotProposed::inState($this->status->value);
        }
    }

    // ----------[ Internals ]----------

    private function closeProposal(RuleStatus $outcome): void
    {
        $this->assertProposed();

        $this->status = $outcome;
        $this->assertSaved($this->save());
    }

    // ----------[ Queries ]----------

    /**
     * The owner key of the rule's own project, the owner an approval names when it chooses no other.
     */
    public static function findOwnerKeyOf(string $id): string
    {
        return self::query()->findOrFail($id)->projectOwner()->key();
    }

    /**
     * The rule read under its row lock, for a change that must happen once.
     */
    public static function findLockedById(string $ruleId): self
    {
        return self::query()->whereKey($ruleId)->lockForUpdate()->firstOr(RuleMissing::throwing()->withId($ruleId));
    }

    // ----------[ Scopes ]----------

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function matching(Builder $query, string $search): void
    {
        TextSearch::narrow($query, 'text', $search);
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function active(Builder $query): void
    {
        $query->where('status', RuleStatus::Active->value);
    }
}
