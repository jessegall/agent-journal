<?php

declare(strict_types=1);

namespace Domain\Rules\Models;

use App\Concerns\BoundedReads;
use App\Concerns\HasNumber;
use App\Concerns\Linkable;
use App\Concerns\OrdersById;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\Numbered;
use App\Contracts\Records\ReadableModel;
use App\Support\ActorContext;
use App\Support\ActorIdentity;
use App\Support\TextSearch;
use Carbon\CarbonImmutable;
use Domain\Rules\Enums\RuleState;
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
 * @property string $text
 * @property RuleState $state
 * @property string|null $reason
 * @property string|null $replaces_rule_id
 * @property string|null $proposer_type
 * @property string|null $proposer_id
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 *
 * @mixin \Eloquent
 */
final class Rule extends Model implements EventSource, Numbered, ReadableModel
{
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
    protected $attributes = ['state' => 'active'];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'state' => RuleState::class,
        ];
    }

    // ----------[ Constructors ]----------

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
        $rule = new self();
        $rule->text = $text;
        $rule->reason = $reason;
        $rule->replaces_rule_id = $replacesRuleId;
        $rule->proposer_type = $proposer->type;
        $rule->proposer_id = $proposer->id;

        $rule->state = RuleState::Proposed;
        $rule->save();

        return $rule;
    }

    // ----------[ Mutations ]----------

    public function remove(): void
    {
        $this->state = RuleState::Removed;
        $this->assertSaved($this->save());
        $this->raise(new RuleRemoved($this->id));
    }

    /**
     * Makes the proposal hold, approved by an actor other than the one who proposed it.
     *
     * @throws RuleSelfApproval
     */
    public function approveBy(ActorIdentity $approver): void
    {
        $this->assertNotProposedBy($approver);
        $this->closeProposal(RuleState::Active);
        $this->raise(new RuleApproved($this->id));
    }

    public function deny(): void
    {
        $this->closeProposal(RuleState::Denied);
        $this->raise(new RuleDenied($this->id));
    }

    // ----------[ Predicates ]----------

    public function canBeReviewed(): bool
    {
        return $this->state === RuleState::Proposed;
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
            $this->state,
            $this->reason,
            $this->proposer_type,
            $this->proposer_id,
            $replacedNumber,
        );
    }

    // ----------[ Asserts ]----------

    /**
     * Refuses an approval by the actor who proposed the rule.
     *
     * @throws RuleSelfApproval
     */
    private function assertNotProposedBy(ActorIdentity $approver): void
    {
        if ($this->proposer_type === null) {
            return;
        }

        $proposer = ActorIdentity::fromStored($this->proposer_type, (string) $this->proposer_id);

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
        if ($this->state !== RuleState::Proposed) {
            throw RuleNotProposed::inState($this->state->value);
        }
    }

    // ----------[ Internals ]----------

    private function closeProposal(RuleState $outcome): void
    {
        $this->assertProposed();

        $this->state = $outcome;
        $this->assertSaved($this->save());
    }

    // ----------[ Queries ]----------

    /**
     * The rule read under its row lock, for a change that must happen once.
     */
    public static function lockedById(string $ruleId): self
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
        $query->where('state', RuleState::Active->value);
    }
}
