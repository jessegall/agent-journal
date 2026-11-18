<?php

declare(strict_types=1);

namespace App\Queries\Support;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

/**
 * Narrows a query to rows whose column holds the search words, without regard to case; an empty search keeps every
 * row. The words are matched literally, so % and _ in them are no wildcards.
 */
final class TextSearch
{
    /**
     * @template TModel of Model
     *
     * @param  Builder<TModel>  $query
     */
    public static function narrow(Builder $query, string $column, string $search): void
    {
        if (trim($search) === '') {
            return;
        }

        $query->whereLike($column, '%'.addcslashes(trim($search), '%_\\').'%', caseSensitive: false);
    }
}
