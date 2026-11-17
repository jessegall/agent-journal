<?php

declare(strict_types=1);

namespace App\Domain\Rules\Models;

use App\Domain\Links\Linkable;
use App\Domain\Rules\RuleState;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * A standing instruction every agent gets, until it is removed.
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

    public function remove(): void
    {
        $this->state = RuleState::Removed;
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
    protected function active(Builder $query): void
    {
        $query->where('state', RuleState::Active->value);
    }
}
