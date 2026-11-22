<?php

declare(strict_types=1);

namespace Domain\Tasks\Support;

use App\Contracts\SearchProvider;
use App\Contracts\ServedEnvironment;
use App\Enums\ScoreTier;
use App\Support\RecordIdentity;
use App\Values\AdmittedConstraints;
use App\Values\RefreshCandidates;
use App\Values\SearchBatch;
use App\Values\SearchQuery;
use App\Values\SearchResult;
use App\Values\SearchWords;
use App\Values\SourcePosition;
use Domain\Tasks\Models\Task;
use Illuminate\Database\Eloquent\Builder;

/**
 * Searches task titles by a bounded keyset scan: a high-water id fixed on the first call, then blocks of at most 32
 * ids in binary order, tier by tier from exact title down to contains, emitting only hits whose highest tier is the
 * tier being visited. A complete task reference is answered first, at tier 500, by its indexed lookup.
 */
final readonly class TaskSearchProvider implements SearchProvider
{
    public const int BLOCK_SIZE = 32;

    private const string TIER = 'tier';

    private const string AFTER = 'after';

    private const string HIGH_WATER = 'high_water';

    private const string REFERENCE = 'reference';

    public function __construct(
        private TaskSearchAccess $access,
        private TaskReferenceRecognizer $recognizer,
        private TaskReferenceLookup $lookup,
        private ServedEnvironment $environment,
    ) {}

    public function search(SearchQuery $query): SearchBatch
    {
        $constraints = $this->access->constraints($query->reader);

        if ($query instanceof RefreshCandidates) {
            return $this->refresh($query, $constraints);
        }

        if ($constraints->recordIds->admitsNone()) {
            return SearchBatch::exhausted('', []);
        }

        if ($query->position === null) {
            return $this->start($query, $constraints);
        }

        return $this->scan($query, $query->position, $constraints);
    }

    /**
     * Fixes the high water, answers a complete reference first, then scans the first block of the top title tier.
     */
    private function start(SearchQuery $query, AdmittedConstraints $constraints): SearchBatch
    {
        $highWater = $this->admitted($constraints)->max('id');

        if (! is_string($highWater)) {
            return SearchBatch::exhausted('', []);
        }

        $reference = $this->referenceHit($query, $constraints);
        if ($reference !== null) {
            $first = self::position(ScoreTier::ExactTitle, '', $highWater, $reference->reference->id);

            return SearchBatch::more($highWater, [$reference], $first);
        }

        return $this->scan($query, self::position(ScoreTier::ExactTitle, '', $highWater, ''), $constraints);
    }

    /**
     * One block of the current tier: its hits are certified, since every later id of this tier sorts after them
     * and every other unseen hit sits in a lower tier.
     */
    private function scan(SearchQuery $query, SourcePosition $position, AdmittedConstraints $constraints): SearchBatch
    {
        $tier = ScoreTier::from($position->integer(self::TIER));
        $highWater = $position->text(self::HIGH_WATER);
        $referenceId = $position->text(self::REFERENCE);
        $blockSize = max(1, min(self::BLOCK_SIZE, $query->budget->candidates));

        $block = $this->admitted($constraints)
            ->where('id', '>', $position->text(self::AFTER))
            ->where('id', '<=', $highWater)
            ->orderBy('id')
            ->limit($blockSize)
            ->get(['id', 'number', 'title']);

        $hits = [];
        $lastExamined = $position->text(self::AFTER);

        foreach ($block as $task) {
            if (count($hits) === $query->pageAllowance) {
                break;
            }

            $lastExamined = $task->id;

            if ($task->id !== $referenceId && $query->words->titleTier($task->title) === $tier) {
                $hits[] = self::titleHit($task, $tier);
            }
        }

        $examinedWholeBlock = $block->isEmpty() || $lastExamined === $block->last()->id;
        $tierFinished = $examinedWholeBlock && $block->count() < $blockSize;
        $nextPosition = $tierFinished
            ? $this->nextTier($tier, $highWater, $referenceId)
            : self::position($tier, $lastExamined, $highWater, $referenceId);

        if ($nextPosition === null) {
            return SearchBatch::exhausted($highWater, $hits);
        }

        if ($hits === []) {
            return SearchBatch::scanning($highWater, $nextPosition);
        }

        return SearchBatch::more($highWater, $hits, $nextPosition);
    }

    /**
     * Rereads the held tasks in one query, inside the reader's live grant, and answers each with its current tier
     * and title; a task no longer admitted or no longer matching is left out, so the search drops it.
     */
    private function refresh(RefreshCandidates $query, AdmittedConstraints $constraints): SearchBatch
    {
        $ids = $query->recordIds();
        $reference = $this->recognizer->recognize($query->words->text);

        $tasks = $this->admitted($constraints)
            ->whereKey($ids)
            ->readExactly(count($ids))
            ->get(['id', 'number', 'title']);

        $matches = [];

        foreach ($tasks as $task) {
            if (! $this->access->admitsOpen($query->reader, $task->id)) {
                continue;
            }

            if ($reference !== null && $reference->number === $task->number) {
                $matches[] = self::referenceResult($task);

                continue;
            }

            $tier = $query->words->titleTier($task->title);

            if ($tier !== null) {
                $matches[] = self::titleHit($task, $tier);
            }
        }

        usort($matches, fn (SearchResult $first, SearchResult $second): int => $first->compare($second));

        return SearchBatch::refreshed('', $query, $matches);
    }

    /**
     * The start of the next title tier, or null when the lowest tier is done and the range is proven empty.
     */
    private function nextTier(ScoreTier $tier, string $highWater, string $referenceId): SourcePosition|null
    {
        $next = $tier->nextTitleTier();

        if ($next === null) {
            return null;
        }

        return self::position($next, '', $highWater, $referenceId);
    }

    private function referenceHit(SearchQuery $query, AdmittedConstraints $constraints): SearchResult|null
    {
        $reference = $this->recognizer->recognize($query->words->text);

        if ($reference === null) {
            return null;
        }

        $hit = $this->lookup->find($reference, $constraints);

        if ($hit === null || ! $this->access->admitsOpen($query->reader, $hit->reference->id)) {
            return null;
        }

        return $hit;
    }

    /**
     * The tasks the reader may search: those of the served environment, limited to the admitted ids.
     *
     * @return Builder<Task>
     */
    private function admitted(AdmittedConstraints $constraints): Builder
    {
        $query = Task::query()->inEnvironments($this->environment->environmentIds());

        if ($constraints->recordIds->isRestricted()) {
            $query->whereKey($constraints->recordIds->names());
        }

        return $query;
    }

    private static function titleHit(Task $task, ScoreTier $tier): SearchResult
    {
        return SearchResult::shortened(
            "Task {$task->number} · {$task->title}",
            $task->title,
            new RecordIdentity(Task::LINK_TYPE, $task->id),
            $tier,
        );
    }

    private static function referenceResult(Task $task): SearchResult
    {
        return SearchResult::shortened(
            "Task {$task->number} · {$task->title}",
            "Task {$task->number}",
            new RecordIdentity(Task::LINK_TYPE, $task->id),
            ScoreTier::Reference,
        );
    }

    private static function position(
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
}
