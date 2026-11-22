<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\ScoreTier;
use Closure;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

/**
 * What a domain tells the shared tiered search about one searchable: the rows the reader may search, the id and
 * title columns, the columns a hit needs, how a row's title is read and becomes a hit, whether the reader may open
 * a record, its complete-reference hit when the words are one, and its long text, when it offers passages.
 */
final readonly class TieredSearchSource
{
    /**
     * @param  Closure(): Builder<Model>  $admitted
     * @param  list<string>  $columns
     * @param  Closure(Model): string  $titleOf
     * @param  Closure(Model, ScoreTier): SearchResult  $hitOf
     * @param  Closure(string): bool  $admitsOpen
     * @param  Closure(SearchQuery, self): (SearchResult|null)  $referenceOf
     */
    public function __construct(
        public Closure $admitted,
        public string $idColumn,
        public string $titleColumn,
        public array $columns,
        public Closure $titleOf,
        public Closure $hitOf,
        public Closure $admitsOpen,
        public Closure $referenceOf,
        public SearchableBody|null $body = null,
    ) {}

    /**
     * @return Builder<Model>
     */
    public function rows(): Builder
    {
        return ($this->admitted)();
    }

    public function titleOf(Model $row): string
    {
        return ($this->titleOf)($row);
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
