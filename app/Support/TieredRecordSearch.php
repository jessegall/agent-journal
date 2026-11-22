<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\ReferenceRecognizer;
use App\Enums\ScoreTier;
use App\Exceptions\StatementTimedOut;
use App\Exceptions\WorkBudgetSpent;
use App\Values\HitIdentity;
use App\Values\RefreshCandidates;
use App\Values\SearchBatch;
use App\Values\SearchQuery;
use App\Values\SearchResult;
use App\Values\SourcePosition;
use App\Values\TieredSearchSource;
use Closure;
use Illuminate\Database\Eloquent\Model;

/**
 * The bounded tiered search a domain's provider shares: a high-water id fixed on the first call, a complete
 * reference answered first at tier 500, then blocks of at most 32 rows in binary id order, tier by tier from exact
 * title down to contains, each narrowed by its LIKE pattern, emitting only rows whose highest tier is the tier
 * being visited, so every batch's hits are certified. A refresh rereads held records in bulk and answers those that
 * still match.
 */
final readonly class TieredRecordSearch
{
    public const int BLOCK_SIZE = 32;

    public const string TIER = 'tier';

    public const string AFTER = 'after';

    public const string HIGH_WATER = 'high_water';

    public const string REFERENCE = 'reference';

    public function __construct(private StatementDeadline $deadline) {}

    /**
     * A whole search over titles only: the range is exhausted after the contains tier.
     *
     * @throws StatementTimedOut
     * @throws WorkBudgetSpent
     */
    public function search(SearchQuery $query, TieredSearchSource $source): SearchBatch
    {
        if ($query instanceof RefreshCandidates) {
            return $this->refresh($query, $source);
        }

        if ($query->position === null) {
            return $this->start($query, $source, self::noTierAfterTitles(...));
        }

        return $this->scanTitles($query, $query->position, $source, self::noTierAfterTitles(...));
    }

    /**
     * Fixes the high water, answers a complete reference first, then scans the first block of the top title tier.
     *
     * @param  Closure(string, string): (SourcePosition|null)  $afterTitles  where the search goes after the last
     *                                                                        title tier, given the high water and
     *                                                                        the reference id
     *
     * @throws StatementTimedOut
     * @throws WorkBudgetSpent
     */
    public function start(SearchQuery $query, TieredSearchSource $source, Closure $afterTitles): SearchBatch
    {
        $highWater = $source->rows()->max('id');

        if (! is_string($highWater)) {
            return SearchBatch::exhausted('', []);
        }

        $reference = $source->referenceHit($query);

        if ($reference !== null) {
            $first = self::position(ScoreTier::ExactTitle, '', $highWater, $reference->reference->id);

            return SearchBatch::more($highWater, [$reference], $first);
        }

        $first = self::position(ScoreTier::ExactTitle, '', $highWater, '');

        return $this->scanTitles($query, $first, $source, $afterTitles);
    }

    /**
     * One block of the current title tier: its hits are certified, since every later id of this tier sorts after
     * them and every other unseen hit sits in a lower tier.
     *
     * @param  Closure(string, string): (SourcePosition|null)  $afterTitles
     *
     * @throws StatementTimedOut
     * @throws WorkBudgetSpent
     */
    public function scanTitles(
        SearchQuery $query,
        SourcePosition $position,
        TieredSearchSource $source,
        Closure $afterTitles,
    ): SearchBatch {
        $tier = ScoreTier::from($position->integer(self::TIER));
        $highWater = $position->text(self::HIGH_WATER);
        $referenceId = $position->text(self::REFERENCE);
        $after = $position->text(self::AFTER);
        $blockSize = max(1, min(self::BLOCK_SIZE, $query->budget->remainingCandidates()));
        $query->budget->chargeCandidates($blockSize);
        $pattern = $tier->likePattern(TextSearch::literal($query->words->text));

        $block = $this->deadline->within($query->budget->remainingMilliseconds(), fn () => $source->rows()
            ->whereLike($source->titleColumn, $pattern, caseSensitive: false)
            ->where('id', '>', $after)
            ->where('id', '<=', $highWater)
            ->orderBy('id')
            ->limit($blockSize)
            ->get($source->columns));

        $hits = [];
        $lastExamined = $after;

        foreach ($block as $row) {
            if (count($hits) === $query->pageAllowance) {
                break;
            }

            $lastExamined = (string) $row->getKey();
            $title = (string) $row->getAttribute($source->titleColumn);

            if ($lastExamined !== $referenceId && $query->words->titleTier($title) === $tier) {
                $hits[] = $source->hit($row, $tier);
            }
        }

        $examinedWholeBlock = $block->isEmpty() || $lastExamined === (string) $block->last()?->getKey();
        $tierFinished = $examinedWholeBlock && $block->count() < $blockSize;
        $next = $tierFinished
            ? self::afterTier($tier, $highWater, $referenceId, $afterTitles)
            : self::position($tier, $lastExamined, $highWater, $referenceId);

        if ($next === null) {
            return SearchBatch::exhausted($highWater, $hits);
        }

        if ($hits === []) {
            return SearchBatch::scanning($highWater, $next);
        }

        return SearchBatch::more($highWater, $hits, $next);
    }

    /**
     * Rereads the held records in one query inside the reader's live grant and answers each held identity without
     * a location that still matches, at its current tier; whatever no longer matches is left out.
     *
     * @throws StatementTimedOut
     * @throws WorkBudgetSpent
     */
    public function refresh(RefreshCandidates $query, TieredSearchSource $source): SearchBatch
    {
        $ids = $query->recordIds();
        $query->budget->chargePolicyChecks(count($ids));
        $reference = $source->referenceHit($query);

        $rows = $this->deadline->within($query->budget->remainingMilliseconds(), fn () => $source->rows()
            ->whereKey($ids)
            ->readExactly(count($ids))
            ->get($source->columns)
            ->keyBy(fn (Model $row): string => (string) $row->getKey()));

        $matches = [];

        foreach ($query->candidates as $candidate) {
            $match = $this->currentMatch($query, $source, $candidate, $rows->get($candidate->recordId), $reference);

            if ($match !== null) {
                $matches[] = $match;
            }
        }

        usort($matches, fn (SearchResult $first, SearchResult $second): int => $first->compare($second));

        return SearchBatch::refreshed('', $query, $matches);
    }

    /**
     * The complete-reference hit of a numbered record: the record with the recognized number in the journal's
     * group, inside the rows the reader may search, when the reader may open it.
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

        $row = $source->rows()->numberedInJournal($reference->number)->first($source->columns);

        if (! $row instanceof Model || ! $source->admitsOpen((string) $row->getKey())) {
            return null;
        }

        return $source->hit($row, ScoreTier::Reference);
    }

    public static function position(
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

    private function currentMatch(
        SearchQuery $query,
        TieredSearchSource $source,
        HitIdentity $candidate,
        Model|null $row,
        SearchResult|null $reference,
    ): SearchResult|null {
        if ($row === null || $candidate->locationId !== null || ! $source->admitsOpen($candidate->recordId)) {
            return null;
        }

        if ($reference !== null && $reference->reference->id === $candidate->recordId) {
            return $reference;
        }

        $tier = $query->words->titleTier((string) $row->getAttribute($source->titleColumn));

        return $tier === null ? null : $source->hit($row, $tier);
    }

    /**
     * @param  Closure(string, string): (SourcePosition|null)  $afterTitles
     */
    private static function afterTier(
        ScoreTier $tier,
        string $highWater,
        string $referenceId,
        Closure $afterTitles,
    ): SourcePosition|null {
        $next = $tier->nextTitleTier();

        if ($next === null) {
            return $afterTitles($highWater, $referenceId);
        }

        return self::position($next, '', $highWater, $referenceId);
    }

    private static function noTierAfterTitles(string $highWater, string $referenceId): SourcePosition|null
    {
        return null;
    }
}
