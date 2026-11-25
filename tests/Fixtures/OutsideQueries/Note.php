<?php

declare(strict_types=1);

namespace Tests\Fixtures\OutsideQueries;

use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

/**
 * A model whose own queries may filter as they like, with the scopes a query from outside chains.
 *
 * @property string $author
 */
final class Note extends Model
{
    // ----------[ Queries ]----------

    /**
     * @return list<self>
     */
    public static function newestOf(string $author): array
    {
        return array_values(self::query()->where('author', $author)->latest()->limit(5)->get()->all());
    }

    // ----------[ Scopes ]----------

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function byAuthor(Builder $query, string $author): void
    {
        $query->where('author', $author);
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function newestFirst(Builder $query): void
    {
        $query->latest();
    }
}
