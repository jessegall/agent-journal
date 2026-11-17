<?php

declare(strict_types=1);

namespace App\Domain\Rules\Models;

use App\Core\Links\Linkable;
use App\Domain\Rules\Exceptions\RuleNotProposed;
use App\Domain\Rules\RuleState;
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

    public static function proposed(string $text): self
    {
        $rule = new self(['text' => $text]);
        $rule->state = RuleState::Proposed;
        $rule->save();

        return $rule;
    }

    /**
     * The rule read again under its row lock, for a change that must happen once.
     */
    public static function lockedFor(self $rule): self
    {
        return self::query()->whereKey($rule->id)->lockForUpdate()->sole();
    }

    public function approve(): void
    {
        $this->settleProposal(RuleState::Active);
    }

    public function deny(): void
    {
        $this->settleProposal(RuleState::Denied);
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

    private function settleProposal(RuleState $outcome): void
    {
        if ($this->state !== RuleState::Proposed) {
            throw RuleNotProposed::inState($this->state->value);
        }

        $this->state = $outcome;
        $this->save();
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['state' => RuleState::class];
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
