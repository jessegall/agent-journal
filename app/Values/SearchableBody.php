<?php

declare(strict_types=1);

namespace App\Values;

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
     * @param  Closure(TModel, string, int, int, int): SearchResult  $hitOf  the row, the segment text, the match's
     *                                                                       column in it, its character offset in the
     *                                                                       whole text and its line there, from 1
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
    public function hit(Model $row, string $segment, int $column, int $characterOffset, int $line): SearchResult
    {
        return ($this->hitOf)($row, $segment, $column, $characterOffset, $line);
    }

    /**
     * @param  TModel  $row
     */
    public function passage(Model $row, string $text, HitIdentity $held, SearchWords $words): SearchResult|null
    {
        return ($this->passageOf)($row, $text, $held, $words);
    }
}
