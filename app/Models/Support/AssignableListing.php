<?php

declare(strict_types=1);

namespace App\Models\Support;

use App\Support\TextSearch;
use BackedEnum;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;

/**
 * The scopes an owner model of assignable records lists them with: only some ids, a title search and a set of states.
 * A model using it has a title column and a state column holding a backed enum.
 */
trait AssignableListing
{
    /**
     * Only the records with these ids, read in chunks the database can take; no ids means no records.
     *
     * @param  Builder<static>  $query
     * @param  list<string>  $ids
     */
    #[Scope]
    protected function amongIds(Builder $query, array $ids): void
    {
        $query->where(function (Builder $among) use ($ids): void {
            $among->whereRaw('1 = 0');

            foreach (array_chunk($ids, 10000) as $chunk) {
                $among->orWhereIn($among->qualifyColumn('id'), $chunk);
            }
        });
    }

    /**
     * Records whose title holds the search words, without regard to case; an empty search matches every record.
     *
     * @param  Builder<static>  $query
     */
    #[Scope]
    protected function matching(Builder $query, string $search): void
    {
        TextSearch::narrow($query, 'title', $search);
    }

    /**
     * Records in one of these states; no states means every state.
     *
     * @param  Builder<static>  $query
     * @param  list<BackedEnum>  $states
     */
    #[Scope]
    protected function inStates(Builder $query, array $states): void
    {
        if ($states === []) {
            return;
        }

        $query->whereIn('status', array_map(fn (BackedEnum $state) => $state->value, $states));
    }
}
