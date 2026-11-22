<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\ScoreTier;
use Closure;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

/**
 * What a domain tells the shared tiered search about one searchable: the rows the reader may search, the column
 * the title tiers compare, the columns a hit needs, how a row becomes a hit, whether the reader may open a record,
 * and its complete-reference hit, when the words are one.
 */
final readonly class TieredSearchSource
{
    /**
     * @param  Closure(): Builder<Model>  $admitted
     * @param  list<string>  $columns
     * @param  Closure(Model, ScoreTier): SearchResult  $hitOf
     * @param  Closure(string): bool  $admitsOpen
     * @param  Closure(SearchQuery, self): (SearchResult|null)  $referenceOf
     */
    public function __construct(
        public Closure $admitted,
        public string $titleColumn,
        public array $columns,
        public Closure $hitOf,
        public Closure $admitsOpen,
        public Closure $referenceOf,
    ) {}

    /**
     * @return Builder<Model>
     */
    public function rows(): Builder
    {
        return ($this->admitted)();
    }

    public function hit(Model $row, ScoreTier $tier): SearchResult
    {
        return ($this->hitOf)($row, $tier);
    }

    public function admitsOpen(string $recordId): bool
    {
        return ($this->admitsOpen)($recordId);
    }

    public function referenceHit(SearchQuery $query): SearchResult|null
    {
        return ($this->referenceOf)($query, $this);
    }
}
