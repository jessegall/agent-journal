<?php

declare(strict_types=1);

namespace App\Support;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

/**
 * Narrows a query to rows whose column holds the search words, without regard to case; no search or an empty one
 * keeps every row. The words are matched literally, so % and _ in them are no wildcards.
 */
final class TextSearch
{
    /**
     * @template TModel of Model
     *
     * @param  Builder<TModel>  $query
     */
    public static function narrow(Builder $query, string $column, string|null $search): void
    {
        if ($search === null || trim($search) === '') {
            return;
        }

        $query->whereLike($column, '%'.self::literal($search).'%', caseSensitive: false);
    }

    /**
     * The words as a LIKE pattern matches them literally: trimmed, with %, _ and the escape character escaped.
     */
    public static function literal(string $search): string
    {
        return addcslashes(trim($search), '%_\\');
    }
}
