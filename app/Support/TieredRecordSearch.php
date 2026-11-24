<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Processes\StatementDeadlines;
use App\Contracts\Records\ReferenceRecognizer;
use App\Contracts\Search\TieredSearch;
use App\Enums\ScoreTier;
use App\Exceptions\StatementTimedOut;
use App\Exceptions\WorkBudgetSpent;
use App\Values\BodyMatch;
use App\Values\HitIdentity;
use App\Values\RefreshCandidates;
use App\Values\SearchableBody;
use App\Values\SearchBatch;
use App\Values\SearchQuery;
use App\Values\SearchResult;
use App\Values\SourcePosition;
use App\Values\TieredSearchSource;
use Closure;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;

/**
 * The bounded tiered search every domain's provider shares. A high-water id is fixed on the first call and a
 * complete reference answered first at tier 500; then blocks of at most 32 rows in binary id order, tier by tier
 * from exact title down to contains, each narrowed by its LIKE pattern, emitting only rows whose highest tier is
 * the tier being visited, so every batch's hits are certified; then, for a source with a long text, the texts the
 * pattern matches, read in fixed segments that overlap by the words' length so a phrase across an edge is found.
 * A refresh rereads held records in bulk and answers those that still match.
 */
final readonly class TieredRecordSearch implements TieredSearch
{
    private const int BYTES_PER_CHARACTER = 4;

    private const string TIER = 'tier';

    private const string AFTER = 'after';

    private const string HIGH_WATER = 'high_water';

    private const string REFERENCE = 'reference';

    private const string RECORD = 'record';

    private const string OFFSET = 'offset';

    private const string SEGMENT = 'search_segment';

    private const string LENGTH = 'search_length';

    private const string TEXT = 'search_text';

    private const string LINES_BEFORE = 'search_lines_before';

    public function __construct(private StatementDeadlines $deadline) {}

    /**
     * One call of the search over a source: a refresh, the first call, a title tier or the body tier.
     *
     *
     * @template TModel of Model
     *
     * @param  TieredSearchSource<TModel>  $source
     *
     * @throws StatementTimedOut
     * @throws WorkBudgetSpent
     */
    public function search(SearchQuery|RefreshCandidates $query, TieredSearchSource $source): SearchBatch
    {
        if ($query instanceof RefreshCandidates) {
            return $this->refresh($query, $source);
        }

        if ($query->position === null) {
            return $this->start($query, $source);
        }

        if ($query->position->integer(self::TIER) === ScoreTier::BodyContains->value && $source->body !== null) {
            return $this->scanBodies($query, $query->position, $source, $source->body);
        }

        return $this->scanTitles($query, $query->position, $source);
    }

    /**
     * The complete-reference hit of a numbered record: the record with the recognized number in the journal's
     * group, inside the rows the reader may search, when the reader may open it.
     *
     * @template TModel of Model
     *
     * @param  TieredSearchSource<TModel>  $source
     */
    public function numberedReference(
        SearchQuery $query,
        ReferenceRecognizer $recognizer,
        TieredSearchSource $source,
    ): SearchResult|null {
        $reference = $recognizer->recognize($query->words->text);

        if ($reference === null) {
            return null;
        }

        $row = $source->rows()
            ->scopes(['numberedInJournal' => [$reference->number]])
            ->first($source->columns);

        if ($row === null || ! $source->admitsOpen((string) $row->getKey())) {
            return null;
        }

        return $source->hit($row, ScoreTier::Reference);
    }

    /**
     * Fixes the high water, answers a complete reference first, then scans the first block of the top title tier.
     *
     * @template TModel of Model
     *
     * @param  TieredSearchSource<TModel>  $source
     */
    private function start(SearchQuery $query, TieredSearchSource $source): SearchBatch
    {
        $highWater = $source->rows()->max($source->idColumn);

        if (! is_string($highWater)) {
            return SearchBatch::nothing();
        }

        $reference = $source->referenceHit($query);

        if ($reference !== null) {
            $first = self::titlePosition(ScoreTier::ExactTitle, '', $highWater, $reference->reference->id);

            return SearchBatch::more($highWater, [$reference], $first);
        }

        return $this->scanTitles($query, self::titlePosition(ScoreTier::ExactTitle, '', $highWater, ''), $source);
    }

    /**
     * One block of the current title tier: its hits are certified, since every later id of this tier sorts after
     * them and every other unseen hit sits in a lower tier.
     *
     * @template TModel of Model
     *
     * @param  TieredSearchSource<TModel>  $source
     */
    private function scanTitles(SearchQuery $query, SourcePosition $position, TieredSearchSource $source): SearchBatch
    {
        $tier = ScoreTier::from($position->integer(self::TIER));
        $highWater = $position->text(self::HIGH_WATER);
        $referenceId = $position->text(self::REFERENCE);
        $after = $position->text(self::AFTER);
        $blockSize = max(1, min(self::BLOCK_ROW_LIMIT, $query->budget->remainingCandidates()));
        $query->budget->chargeCandidates($blockSize);
        $pattern = $tier->likePattern(TextSearch::literal($query->words->text));

        $block = $this->read($query, fn () => $source->rows()
            ->whereLike($source->titleColumn, $pattern, caseSensitive: false)
            ->where($source->idColumn, '>', $after)
            ->where($source->idColumn, '<=', $highWater)
            ->orderBy($source->idColumn)
            ->limit($blockSize)
            ->get($source->columns));

        $hits = [];
        $lastExamined = $after;

        foreach ($block as $row) {
            if (count($hits) === $query->pageAllowance) {
                break;
            }

            $lastExamined = (string) $row->getKey();

            if ($lastExamined !== $referenceId && $query->words->titleTier($source->titleOf($row)) === $tier) {
                $hits[] = $source->hit($row, $tier);
            }
        }

        $examinedWholeBlock = $block->isEmpty() || $lastExamined === (string) $block->last()->getKey();
        $tierFinished = $examinedWholeBlock && $block->count() < $blockSize;

        $next = $tierFinished
            ? self::afterTier($tier, $highWater, $referenceId, $source)
            : self::titlePosition($tier, $lastExamined, $highWater, $referenceId);

        if ($next === null) {
            return SearchBatch::exhausted($highWater, $hits);
        }

        return self::batch($highWater, $hits, $next);
    }

    /**
     * One step of the body tier: a block of whole first segments, or the next segment of the one long text the
     * last step stopped inside. A text read only in part never yields a head before its match is seen, and the
     * rows read are bounded by the byte budget.
     *
     * @template TModel of Model
     *
     * @param  TieredSearchSource<TModel>  $source
     * @param  SearchableBody<TModel>  $body
     */
    private function scanBodies(
        SearchQuery $query,
        SourcePosition $position,
        TieredSearchSource $source,
        SearchableBody $body,
    ): SearchBatch {
        $highWater = $position->text(self::HIGH_WATER);
        $referenceId = $position->text(self::REFERENCE);
        $after = $position->text(self::AFTER);
        $record = $position->text(self::RECORD);
        $start = $record === '' ? 1 : $position->integer(self::OFFSET);
        $rowLimit = $record === '' ? self::bodyRowsFor($query) : 1;
        $query->budget->chargeCandidates($rowLimit);
        $query->budget->chargeBytes($rowLimit * self::SEGMENT_CHARACTER_LIMIT * self::BYTES_PER_CHARACTER);
        $pattern = ScoreTier::BodyContains->likePattern(TextSearch::literal($query->words->text));

        $rows = $this->read($query, fn () => $source->rows()
            ->whereLike($body->column, $pattern, caseSensitive: false)
            ->where($source->idColumn, '<=', $highWater)
            ->when(
                $record === '',
                fn (Builder $rows) => $rows->where($source->idColumn, '>', $after),
                fn (Builder $rows) => $rows->where($source->idColumn, $record),
            )
            ->orderBy($source->idColumn)
            ->limit($rowLimit)
            ->select($source->columns)
            ->selectRaw("substr({$body->column}, ?, ?) as ".self::SEGMENT, [$start, self::SEGMENT_CHARACTER_LIMIT])
            ->selectRaw("length({$body->column}) as ".self::LENGTH)
            ->selectRaw(self::linesBefore($body->column), [$start - 1, $start - 1])
            ->get());

        $hits = [];
        $overlap = max(0, mb_strlen($query->words->text) - 1);

        foreach ($rows as $row) {
            if (count($hits) === $query->pageAllowance) {
                return self::batch($highWater, $hits, self::bodyPosition($after, $highWater, $referenceId));
            }

            $id = (string) $row->getKey();
            $hit = $this->bodyHit($query, $source, $body, $row, $start, $referenceId);

            if ($hit !== null) {
                $hits[] = $hit;
                $after = $id;

                continue;
            }

            $read = $start - 1 + self::SEGMENT_CHARACTER_LIMIT;

            if ($read < (int) $row->getAttribute(self::LENGTH)) {
                $next = self::bodyPosition($after, $highWater, $referenceId, $id, $read + 1 - $overlap);

                return self::batch($highWater, $hits, $next);
            }

            $after = $id;
        }

        if ($record === '' && $rows->count() < $rowLimit) {
            return SearchBatch::exhausted($highWater, $hits);
        }

        return self::batch($highWater, $hits, self::bodyPosition($after, $highWater, $referenceId));
    }

    /**
     * The body hit of one row's segment: only for a record whose title holds no tier, so its highest tier is the
     * body, at the character the match starts at in the whole text.
     *
     * @template TModel of Model
     *
     * @param  TieredSearchSource<TModel>  $source
     * @param  SearchableBody<TModel>  $body
     * @param  TModel  $row
     */
    private function bodyHit(
        SearchQuery $query,
        TieredSearchSource $source,
        SearchableBody $body,
        Model $row,
        int $start,
        string $referenceId,
    ): SearchResult|null {
        if ((string) $row->getKey() === $referenceId || $query->words->titleTier($source->titleOf($row)) !== null) {
            return null;
        }

        $segment = (string) $row->getAttribute(self::SEGMENT);

        if (! $query->words->isFoundIn($segment)) {
            return null;
        }

        $column = $query->words->columnIn($segment);
        $line = (int) $row->getAttribute(self::LINES_BEFORE) + substr_count(mb_substr($segment, 0, $column), "\n") + 1;

        return $body->hit($row, new BodyMatch($segment, $column, $start - 1 + $column, $line));
    }

    /**
     * Rereads the held records in one query inside the reader's live grant and answers each held identity that
     * still matches: a title hit at its current tier, a passage through the source's own check of its text.
     *
     * @template TModel of Model
     *
     * @param  TieredSearchSource<TModel>  $source
     */
    private function refresh(RefreshCandidates $query, TieredSearchSource $source): SearchBatch
    {
        $ids = $query->recordIds();
        $query->budget()->chargePolicyChecks(count($ids));
        $reference = $source->referenceHit($query->original);

        $rows = $this->read($query->original, fn () => $this->rowsWithText($source, $ids));

        $matches = [];

        foreach ($query->candidates as $candidate) {
            $row = $rows->get($candidate->recordId);
            $match = $this->currentMatch($query->original, $source, $candidate, $row, $reference);

            if ($match !== null) {
                $matches[] = $match;
            }
        }

        usort($matches, fn (SearchResult $first, SearchResult $second): int => $first->compare($second));

        return SearchBatch::refreshed('', $query, $matches);
    }

    /**
     * @param  list<string>  $ids
     *
     * @template TModel of Model
     *
     * @param  TieredSearchSource<TModel>  $source
     * @return Collection<string, TModel>
     */
    private function rowsWithText(TieredSearchSource $source, array $ids): Collection
    {
        $rows = $source->rows()->whereIn($source->idColumn, $ids)->readExactly(count($ids))->select($source->columns);

        if ($source->body !== null) {
            $rows->selectRaw("{$source->body->column} as ".self::TEXT);
        }

        return $rows->get()->keyBy(fn (Model $row): string => (string) $row->getKey());
    }

    /**
     * @template TModel of Model
     *
     * @param  TieredSearchSource<TModel>  $source
     * @param  TModel|null  $row
     */
    private function currentMatch(
        SearchQuery $query,
        TieredSearchSource $source,
        HitIdentity $candidate,
        Model|null $row,
        SearchResult|null $reference,
    ): SearchResult|null {
        if ($row === null || ! $source->admitsOpen($candidate->recordId)) {
            return null;
        }

        if ($candidate->locationId !== null) {
            $text = (string) $row->getAttribute(self::TEXT);

            return $source->body?->passage($row, $text, $candidate, $query->words);
        }

        if ($reference !== null && $reference->reference->id === $candidate->recordId) {
            return $reference;
        }

        $tier = $query->words->titleTier($source->titleOf($row));

        if ($tier === null) {
            return null;
        }

        return $source->hit($row, $tier);
    }

    /**
     * @template TResult
     *
     * @param  Closure(): TResult  $statement
     * @return TResult
     */
    private function read(SearchQuery $query, Closure $statement): mixed
    {
        return $this->deadline->within($query->budget->remainingMilliseconds(), $statement);
    }

    /**
     * The SQL counting the line breaks before a segment's start, so a hit knows its line without reading the text
     * before it.
     *
     * @param  literal-string  $column
     * @return literal-string
     */
    private static function linesBefore(string $column): string
    {
        $before = "substr({$column}, 1, ?)";

        return "length({$before}) - length(replace({$before}, chr(10), '')) as ".self::LINES_BEFORE;
    }

    /**
     * As many texts as one step may read whole first segments of within its byte budget, at most one block.
     */
    private static function bodyRowsFor(SearchQuery $query): int
    {
        $byBytes = intdiv($query->budget->remainingBytes(), self::SEGMENT_CHARACTER_LIMIT * self::BYTES_PER_CHARACTER);

        return max(1, min(self::BLOCK_ROW_LIMIT, $query->budget->remainingCandidates(), $byBytes));
    }

    /**
     * @param  list<SearchResult>  $hits
     */
    private static function batch(string $highWater, array $hits, SourcePosition $next): SearchBatch
    {
        if ($hits === []) {
            return SearchBatch::scanning($highWater, $next);
        }

        return SearchBatch::more($highWater, $hits, $next);
    }

    /**
     * The start of the tier after this title tier: the next title tier, the body tier of a source with a long
     * text, or null when the range is proven empty.
     *
     * @template TModel of Model
     *
     * @param  TieredSearchSource<TModel>  $source
     */
    private static function afterTier(
        ScoreTier $tier,
        string $highWater,
        string $referenceId,
        TieredSearchSource $source,
    ): SourcePosition|null {
        $next = $tier->nextTitleTier();

        if ($next !== null) {
            return self::titlePosition($next, '', $highWater, $referenceId);
        }

        if ($source->body === null) {
            return null;
        }

        return self::bodyPosition('', $highWater, $referenceId);
    }

    private static function titlePosition(
        ScoreTier $tier,
        string $after,
        string $highWater,
        string $referenceId,
    ): SourcePosition {
        return SourcePosition::of([
            self::TIER => $tier->value,
            self::AFTER => $after,
            self::HIGH_WATER => $highWater,
            self::REFERENCE => $referenceId,
        ]);
    }

    /**
     * A position in the body tier: the last record read whole, and the long text being read in segments, if any,
     * with the character its next segment starts at.
     */
    private static function bodyPosition(
        string $after,
        string $highWater,
        string $referenceId,
        string $record = '',
        int $offset = 1,
    ): SourcePosition {
        return SourcePosition::of([
            self::TIER => ScoreTier::BodyContains->value,
            self::AFTER => $after,
            self::HIGH_WATER => $highWater,
            self::REFERENCE => $referenceId,
            self::RECORD => $record,
            self::OFFSET => $offset,
        ]);
    }
}
