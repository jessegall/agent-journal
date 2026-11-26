<?php

declare(strict_types=1);

namespace App\Search\Values;

use Closure;
use Illuminate\Database\Eloquent\Model;

/**
 * The long text of a searchable the shared tiered search reads in segments after the title tiers: its column, how
 * a match in a segment becomes a passage hit, and how a held passage hit is checked again against the current
 * record, which answers null when the passage is gone.
 *
 * @template TModel of Model
 */
final readonly class SearchableBody
{
    /**
     * @param  literal-string  $column  the column of the long text, named by its owner's code
     * @param  Closure(TModel, BodyMatch): SearchResult  $hitOf  the row and where the words matched in its text
     * @param  Closure(TModel, string, HitIdentity, SearchWords): (SearchResult|null)  $passageOf  the row, its whole
     *                                                                                             text, the held hit
     *                                                                                             and the words
     */
    public function __construct(
        public string $column,
        public Closure $hitOf,
        public Closure $passageOf,
    ) {}

    /**
     * @param  TModel  $row
     */
    public function hit(Model $row, BodyMatch $match): SearchResult
    {
        return ($this->hitOf)($row, $match);
    }

    /**
     * @param  TModel  $row
     */
    public function passage(Model $row, string $text, HitIdentity $held, SearchWords $words): SearchResult|null
    {
        return ($this->passageOf)($row, $text, $held, $words);
    }
}
