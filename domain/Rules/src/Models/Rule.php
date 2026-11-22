<?php

declare(strict_types=1);

namespace Domain\Rules\Models;

use App\Concerns\BoundedReads;
use App\Concerns\HasNumber;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\Numbered;
use App\Contracts\Records\ReadableModel;
use App\Enums\ActorType;
use App\Support\ActorContext;
use App\Support\ActorIdentity;
use App\Support\TextSearch;
use Domain\Rules\Enums\RuleState;
use Domain\Rules\Events\RuleApproved;
use Domain\Rules\Events\RuleDenied;
use Domain\Rules\Events\RuleRemoved;
use Domain\Rules\Exceptions\RuleMissing;
use Domain\Rules\Exceptions\RuleNotProposed;
use Domain\Rules\Exceptions\RuleSelfApproval;
use Domain\Rules\Values\RuleDetails;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * A standing instruction every agent gets once the owner approved it, until it is removed. Its text stays as proposed.
 * Every agent reads every rule, so it has no agent limit.
 *
 * @property string $id
 * @property string $number_group_id
 * @property int $number
 * @property string $text
 * @property RuleState $state
 * @property string|null $reason
 * @property string|null $replaces_rule_id
 * @property ActorType|null $proposer_type
 * @property string|null $proposer_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['text', 'reason', 'replaces_rule_id', 'proposer_type', 'proposer_id'])]
final class Rule extends Model implements EventSource, Numbered, ReadableModel
{
    use BoundedReads;
    use HasNumber;
    use HasUlids;
    use Linkable;
    use RaisesEvents;

    /**
     * The type a rule is linked, docked and found in search by.
     */
    public const string LINK_TYPE = 'rules.rule';

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
    protected $attributes = ['state' => 'active'];

    // ----------[ Constructors ]----------

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['state' => RuleState::class, 'proposer_type' => ActorType::class];
    }

    /**
     * A rule proposed with its reason, the rule it would replace if any, and who proposed it; it holds only once the
     * user approves it.
     */
    public static function create(
        string $text,
        string $reason,
        string|null $replacesRuleId,
        ActorContext $proposer,
    ): self {
        $rule = new self([
            'text' => $text,
            'reason' => $reason,
            'replaces_rule_id' => $replacesRuleId,
            'proposer_type' => $proposer->type,
            'proposer_id' => $proposer->id,
        ]);

        $rule->state = RuleState::Proposed;
        $rule->save();

        return $rule;
    }

    // ----------[ Queries ]----------

    /**
     * The rule read under its row lock, for a change that must happen once.
     */
    public static function lockedById(string $ruleId): self
    {
        return self::query()->whereKey($ruleId)->lockForUpdate()->firstOr(fn () => throw RuleMissing::withId($ruleId));
    }

    // ----------[ Mutations ]----------

    public function remove(): void
    {
        $this->state = RuleState::Removed;
        $this->assertSaved($this->save());
        $this->raise(new RuleRemoved($this->id));
    }

    // ----------[ Answers ]----------

    /**
     * Makes the proposal hold, approved by an actor other than the one who proposed it.
     *
     * @throws RuleSelfApproval
     */
    public function approveBy(ActorIdentity $approver): void
    {
        $proposer = $this->proposer_type === null ? null : new ActorIdentity(
            $this->proposer_type,
            (string) $this->proposer_id,
        );

        if ($proposer !== null && $proposer->isSameAs($approver)) {
            throw RuleSelfApproval::forRule();
        }

        $this->closeProposal(RuleState::Active);
        $this->raise(new RuleApproved($this->id));
    }

    public function deny(): void
    {
        $this->closeProposal(RuleState::Denied);
        $this->raise(new RuleDenied($this->id));
    }

    public function canBeReviewed(): bool
    {
        return $this->state === RuleState::Proposed;
    }

    /**
     * The rule as a read shows it, with the number of the rule it replaces, if any.
     */
    public function details(int|null $replacedNumber): RuleDetails
    {
        return new RuleDetails(
            $this->id,
            $this->number,
            $this->text,
            $this->state,
            $this->reason,
            $this->proposer_type,
            $this->proposer_id,
            $replacedNumber,
        );
    }

    // ----------[ Internals ]----------

    private function closeProposal(RuleState $outcome): void
    {
        if ($this->state !== RuleState::Proposed) {
            throw RuleNotProposed::inState($this->state->value);
        }

        $this->state = $outcome;
        $this->assertSaved($this->save());
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
        $query->where('state', RuleState::Active->value);
    }
}
