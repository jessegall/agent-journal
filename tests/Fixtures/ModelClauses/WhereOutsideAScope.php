<?php

declare(strict_types=1);

namespace Tests\Fixtures\ModelClauses;

use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

/**
 * A model that narrows a query by hand in a query method beside the scope that names it, which the scan lists.
 */
final class WhereOutsideAScope extends Model
{
    // ----------[ Queries ]----------

    public static function hasOpenOnes(): bool
    {
        return self::query()->where('open', true)->exists();
    }

    // ----------[ Scopes ]----------

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function open(Builder $query): void
    {
        $query->where('open', true);
    }
}
