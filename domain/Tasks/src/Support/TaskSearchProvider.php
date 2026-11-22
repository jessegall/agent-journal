<?php

declare(strict_types=1);

namespace Domain\Tasks\Support;

use App\Contracts\SearchProvider;
use App\Contracts\ServedEnvironment;
use App\Enums\ScoreTier;
use App\Support\RecordIdentity;
use App\Support\StatementDeadline;
use App\Values\AdmittedConstraints;
use App\Values\HitIdentity;
use App\Values\RefreshCandidates;
use App\Values\SearchBatch;
use App\Values\SearchQuery;
use App\Values\SearchResult;
use App\Values\SourcePosition;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Values\TaskBriefPassage;
use Illuminate\Database\Eloquent\Builder;

/**
 * Searches tasks by a bounded keyset scan: a high-water id fixed on the first call, then blocks of at most 32 ids in
 * binary order, tier by tier from exact title down to contains, emitting only hits whose highest tier is the tier
 * being visited; then the briefs, read in fixed segments that overlap by the words' length so a phrase across a
 * segment edge is found. A complete task reference is answered first, at tier 500, by its indexed lookup.
 */
final readonly class TaskSearchProvider implements SearchProvider
{
    public const int BLOCK_SIZE = 32;

    public const int SEGMENT_CHARACTERS = 2048;

    private const int BYTES_PER_CHARACTER = 4;

    private const int SNIPPET_CONTEXT_CHARACTERS = 60;

    private const string TIER = 'tier';

    private const string AFTER = 'after';

    private const string HIGH_WATER = 'high_water';

    private const string REFERENCE = 'reference';

    private const string RECORD = 'record';

    private const string OFFSET = 'offset';

    public function __construct(
        private TaskSearchAccess $access,
        private TaskReferenceRecognizer $recognizer,
        private TaskReferenceLookup $lookup,
        private ServedEnvironment $environment,
        private StatementDeadline $deadline,
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

        if ($query->position->integer(self::TIER) === ScoreTier::BodyContains->value) {
            return $this->scanBriefs($query, $query->position, $constraints);
        }

        return $this->scanTitles($query, $query->position, $constraints);
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

        return $this->scanTitles($query, self::position(ScoreTier::ExactTitle, '', $highWater, ''), $constraints);
    }

    /**
     * One block of the current title tier: its hits are certified, since every later id of this tier sorts after
     * them and every other unseen hit sits in a lower tier.
     */
    private function scanTitles(
        SearchQuery $query,
        SourcePosition $position,
        AdmittedConstraints $constraints,
    ): SearchBatch {
        $tier = ScoreTier::from($position->integer(self::TIER));
        $highWater = $position->text(self::HIGH_WATER);
        $referenceId = $position->text(self::REFERENCE);
        $blockSize = max(1, min(self::BLOCK_SIZE, $query->budget->remainingCandidates()));
        $query->budget->chargeCandidates($blockSize);

        $block = $this->deadline->within($query->budget->remainingMilliseconds(), fn () => $this->admitted($constraints)
            ->where('id', '>', $position->text(self::AFTER))
            ->where('id', '<=', $highWater)
            ->orderBy('id')
            ->limit($blockSize)
            ->get(['id', 'number', 'title']));

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
            ? self::afterTitleTier($tier, $highWater, $referenceId)
            : self::position($tier, $lastExamined, $highWater, $referenceId);

        return self::batch($highWater, $hits, $nextPosition);
    }

    /**
     * One step of the brief tier: a block of whole first segments, or the next segment of the one long brief the
     * last step stopped inside. A brief read only in part never yields a head before its match is seen, and the
     * rows read are bounded by the byte budget.
     */
    private function scanBriefs(
        SearchQuery $query,
        SourcePosition $position,
        AdmittedConstraints $constraints,
    ): SearchBatch {
        $highWater = $position->text(self::HIGH_WATER);
        $referenceId = $position->text(self::REFERENCE);
        $after = $position->text(self::AFTER);
        $record = $position->text(self::RECORD);
        $start = $record === '' ? 1 : $position->integer(self::OFFSET);
        $rowLimit = $record === '' ? self::briefRowsFor($query) : 1;
        $query->budget->chargeCandidates($rowLimit);
        $query->budget->chargeBytes($rowLimit * self::SEGMENT_CHARACTERS * self::BYTES_PER_CHARACTER);

        $rows = $this->deadline->within($query->budget->remainingMilliseconds(), fn () => $this->admitted($constraints)
            ->where('id', '<=', $highWater)
            ->when(
                $record === '',
                fn (Builder $rows) => $rows->where('id', '>', $after),
                fn (Builder $rows) => $rows->whereKey($record),
            )
            ->orderBy('id')
            ->limit($rowLimit)
            ->select(['id', 'number', 'title', 'revision'])
            ->selectRaw('substr(brief, ?, ?) as brief_segment', [$start, self::SEGMENT_CHARACTERS])
            ->selectRaw('length(brief) as brief_length')
            ->get());

        $hits = [];
        $overlap = max(0, mb_strlen($query->words->text) - 1);

        foreach ($rows as $task) {
            if (count($hits) === $query->pageAllowance) {
                return self::batch($highWater, $hits, self::briefPosition($after, $highWater, $referenceId));
            }

            $hit = $this->briefHit($query, $task, $start, $referenceId);

            if ($hit !== null) {
                $hits[] = $hit;
                $after = $task->id;

                continue;
            }

            $read = $start - 1 + self::SEGMENT_CHARACTERS;

            if ($read < (int) $task->getAttribute('brief_length')) {
                $next = self::briefPosition($after, $highWater, $referenceId, $task->id, $read + 1 - $overlap);

                return self::batch($highWater, $hits, $next);
            }

            $after = $task->id;
        }

        if ($record === '' && $rows->count() < $rowLimit) {
            return SearchBatch::exhausted($highWater, $hits);
        }

        return self::batch($highWater, $hits, self::briefPosition($after, $highWater, $referenceId));
    }

    /**
     * The brief hit of one row's segment: only for a task whose title holds no tier, so its highest tier is the
     * brief, with the passage it starts at.
     */
    private function briefHit(SearchQuery $query, Task $task, int $start, string $referenceId): SearchResult|null
    {
        if ($task->id === $referenceId || $query->words->titleTier($task->title) !== null) {
            return null;
        }

        $segment = (string) $task->getAttribute('brief_segment');

        if (! $query->words->isFoundIn($segment)) {
            return null;
        }

        $found = mb_stripos($segment, $query->words->text);
        $column = $found === false ? 0 : $found;
        $passage = new TaskBriefPassage($task->revision, $start - 1 + $column);

        return self::briefResult($task, $segment, $column, $passage);
    }

    /**
     * Rereads the held tasks in one query, inside the reader's live grant, and answers each held identity that still
     * matches with its current tier and excerpt; a title hit is a title hit again, a passage is the same passage of
     * an unchanged brief. Whatever no longer matches is left out, so the search drops it.
     */
    private function refresh(RefreshCandidates $query, AdmittedConstraints $constraints): SearchBatch
    {
        $ids = $query->recordIds();
        $reference = $this->recognizer->recognize($query->words->text);
        $query->budget->chargePolicyChecks(count($ids));

        $tasks = $this->deadline->within($query->budget->remainingMilliseconds(), fn () => $this->admitted($constraints)
            ->whereKey($ids)
            ->readExactly(count($ids))
            ->get(['id', 'number', 'title', 'revision', 'brief'])
            ->keyBy('id'));

        $matches = [];

        foreach ($query->candidates as $candidate) {
            $task = $tasks->get($candidate->recordId);

            if (! $task instanceof Task || ! $this->access->admitsOpen($query->reader, $task->id)) {
                continue;
            }

            $match = $this->currentMatch($query, $candidate, $task, $reference?->number);

            if ($match !== null) {
                $matches[] = $match;
            }
        }

        usort($matches, fn (SearchResult $first, SearchResult $second): int => $first->compare($second));

        return SearchBatch::refreshed('', $query, $matches);
    }

    private function currentMatch(
        SearchQuery $query,
        HitIdentity $candidate,
        Task $task,
        int|null $referenceNumber,
    ): SearchResult|null {
        if ($candidate->locationId === null) {
            if ($referenceNumber === $task->number) {
                return self::referenceResult($task);
            }

            $tier = $query->words->titleTier($task->title);

            return $tier === null ? null : self::titleHit($task, $tier);
        }

        if (! TaskBriefPassage::isId($candidate->locationId)) {
            return null;
        }

        $passage = TaskBriefPassage::fromId($candidate->locationId);

        if (! $passage->isOpenIn($task->brief, $task->revision)) {
            return null;
        }

        $excerpt = $passage->excerptOf($task->brief, $task->revision, self::SEGMENT_CHARACTERS);

        if ($query->words->titleTier($task->title) !== null || ! $query->words->isFoundIn($excerpt)) {
            return null;
        }

        $found = mb_stripos($excerpt, $query->words->text);

        return self::briefResult($task, $excerpt, $found === false ? 0 : $found, $passage);
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

    /**
     * As many briefs as one step may read whole first segments of within its byte budget, at most one block.
     */
    private static function briefRowsFor(SearchQuery $query): int
    {
        $byBytes = intdiv($query->budget->remainingBytes(), self::SEGMENT_CHARACTERS * self::BYTES_PER_CHARACTER);

        return max(1, min(self::BLOCK_SIZE, $query->budget->remainingCandidates(), $byBytes));
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

    /**
     * A brief hit titled with the task and its passage, its excerpt the matching text with a little before it.
     */
    private static function briefResult(Task $task, string $text, int $column, TaskBriefPassage $passage): SearchResult
    {
        $from = max(0, $column - self::SNIPPET_CONTEXT_CHARACTERS);

        return SearchResult::shortened(
            "Task {$task->number} · {$task->title} · Brief",
            mb_substr($text, $from, SearchResult::SNIPPET_CHARACTER_LIMIT),
            new RecordIdentity(Task::LINK_TYPE, $task->id),
            ScoreTier::BodyContains,
            $passage->location(),
        );
    }

    /**
     * The start of the tier after this title tier: the next title tier, or the briefs after the last one.
     */
    private static function afterTitleTier(ScoreTier $tier, string $highWater, string $referenceId): SourcePosition
    {
        $next = $tier->nextTitleTier();

        if ($next === null) {
            return self::briefPosition('', $highWater, $referenceId);
        }

        return self::position($next, '', $highWater, $referenceId);
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

    /**
     * A position in the brief tier: the last task read whole, and the long brief being read in segments, if any,
     * with the character its next segment starts at.
     */
    private static function briefPosition(
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
