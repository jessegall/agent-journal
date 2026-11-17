<?php

declare(strict_types=1);

namespace App\Domain\Rules\Models;

use App\Core\Links\Support\Linkable;
use App\Domain\Rules\Enums\RuleState;
use App\Domain\Rules\Exceptions\RuleMissing;
use App\Domain\Rules\Exceptions\RuleNotProposed;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * A standing instruction every agent gets once the owner approved it, until it is removed. Its text stays as proposed.
 * Every agent reads every rule, so it has no agent limit.
 *
 * @property int $id
 * @property string $text
 * @property RuleState $state
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['text'])]
final class Rule extends Model
{
    use Linkable;

    /**
     * @var array<string, mixed>
     */
    protected $attributes = ['state' => 'active'];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['state' => RuleState::class];
    }

    public static function proposed(string $text): self
    {
        $rule = new self(['text' => $text]);
        $rule->state = RuleState::Proposed;
        $rule->save();

        return $rule;
    }

    /**
     * The rule read under its row lock, for a change that must happen once.
     */
    public static function lockedById(int $ruleId): self
    {
        return self::query()->whereKey($ruleId)->lockForUpdate()->first() ?? throw RuleMissing::withId($ruleId);
    }

    public function approve(): void
    {
        $this->closeProposal(RuleState::Active);
    }

    public function deny(): void
    {
        $this->closeProposal(RuleState::Denied);
    }

    public function canBeReviewed(): bool
    {
        return $this->state === RuleState::Proposed;
    }

    public function remove(): void
    {
        $this->state = RuleState::Removed;
        $this->save();
    }

    private function closeProposal(RuleState $outcome): void
    {
        if ($this->state !== RuleState::Proposed) {
            throw RuleNotProposed::inState($this->state->value);
        }

        $this->state = $outcome;
        $this->save();
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function matching(Builder $query, string $search): void
    {
        if (trim($search) === '') {
            return;
        }

        $query->whereLike('text', '%'.addcslashes(trim($search), '%_\\').'%', caseSensitive: false);
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
