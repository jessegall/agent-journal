<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Exceptions\StatementTimedOut;
use App\Exceptions\WorkBudgetSpent;
use App\Values\RefreshCandidates;
use App\Values\SearchBatch;
use App\Values\SearchQuery;
use App\Values\SearchResult;
use App\Values\TieredSearchSource;
use Illuminate\Database\Eloquent\Model;

/**
 * The shared search over a source of records: titles by tier, then long text in segments, and a reread of held hits.
 */
interface TieredSearch
{
    /**
     * The most rows of one title tier a call reads at once.
     */
    public const int BLOCK_ROW_LIMIT = 32;

    /**
     * The characters of long text a body read takes from each record at once.
     */
    public const int SEGMENT_CHARACTER_LIMIT = 2048;

    /**
     * @template TModel of Model
     *
     * @param  TieredSearchSource<TModel>  $source
     *
     * @throws StatementTimedOut
     * @throws WorkBudgetSpent
     */
    public function search(SearchQuery|RefreshCandidates $query, TieredSearchSource $source): SearchBatch;

    /**
     * The hit of the numbered record the words name in full, when the reader may open it.
     *
     * @template TModel of Model
     *
     * @param  TieredSearchSource<TModel>  $source
     */
    public function numberedReference(
        SearchQuery $query,
        ReferenceRecognizer $recognizer,
        TieredSearchSource $source,
    ): SearchResult|null;
}
