<?php

declare(strict_types=1);

namespace Domain\Tasks\Support;

use App\Contracts\SearchProvider;
use App\Contracts\ServedEnvironment;
use App\Contracts\StatementDeadlines;
use App\Enums\ScoreTier;
use App\Support\ReadBuilder;
use App\Support\RecordIdentity;
use App\Support\TextSearch;
use App\Values\AdmittedConstraints;
use App\Values\RefreshCandidates;
use App\Values\SearchBatch;
use App\Values\SearchQuery;
use App\Values\SearchResult;
use App\Values\SourcePosition;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Models\TaskLogEntry;
use Domain\Tasks\Values\TaskLogLocation;
use Illuminate\Database\Eloquent\Collection;

/**
 * Searches task log lines as passages of their task. A high-water line id is fixed on the first call, so lines
 * appended while the search runs never force a restart; then blocks of at most 32 lines the tier's pattern matches,
 * walked by parent task and line id, the order their hits rank in, tier by tier from exact line down to contains.
 */
final readonly class TaskLogSearchProvider implements SearchProvider
{
    public const int BLOCK_ROW_LIMIT = 32;

    private const string TIER = 'tier';

    private const string AFTER_TASK = 'after_task';

    private const string AFTER_LINE = 'after_line';

    private const string HIGH_WATER = 'high_water';

    private const array COLUMNS = [
        'id', 'task_id', 'task_run_id', 'run_number', 'actor_type', 'actor_id', 'text', 'sequence', 'created_at',
    ];

    public function __construct(
        private TaskLogSearchAccess $access,
        private ServedEnvironment $environment,
        private StatementDeadlines $deadline,
    ) {}

    public function search(SearchQuery|RefreshCandidates $query): SearchBatch
    {
        $constraints = $this->access->constraints($query->reader);

        if ($constraints->recordIds->hasNoneAllowed()) {
            return SearchBatch::nothing();
        }

        if ($query instanceof RefreshCandidates) {
            return $this->refresh($query, $constraints);
        }

        if ($query->position === null) {
            $highWater = $this->lines($constraints)->max('id');

            if (! is_string($highWater)) {
                return SearchBatch::nothing();
            }

            return $this->scan($query, self::position(ScoreTier::ExactTitle, '', '', $highWater), $constraints);
        }

        return $this->scan($query, $query->position, $constraints);
    }

    /**
     * One block of the current tier: certified, since every later line of this tier sorts after these by task and
     * line id, and every other unseen hit sits in a lower tier.
     */
    private function scan(SearchQuery $query, SourcePosition $position, AdmittedConstraints $constraints): SearchBatch
    {
        $tier = ScoreTier::from($position->integer(self::TIER));
        $highWater = $position->text(self::HIGH_WATER);
        $afterTask = $position->text(self::AFTER_TASK);
        $afterLine = $position->text(self::AFTER_LINE);
        $blockSize = max(1, min(self::BLOCK_ROW_LIMIT, $query->budget->remainingCandidates()));
        $query->budget->chargeCandidates($blockSize);
        $pattern = $tier->likePattern(TextSearch::literal($query->words->text));

        $block = $this->deadline->within($query->budget->remainingMilliseconds(), fn () => $this->lines($constraints)
            ->whereLike('text', $pattern, caseSensitive: false)
            ->where('id', '<=', $highWater)
            ->afterSearchKey($afterTask, $afterLine)
            ->orderBy('task_id')
            ->orderBy('id')
            ->limit($blockSize)
            ->get(self::COLUMNS));

        $numbers = $this->taskNumbers($block);
        $hits = [];

        foreach ($block as $entry) {
            if (count($hits) === $query->pageAllowance) {
                break;
            }

            [$afterTask, $afterLine] = [$entry->task_id, $entry->id];

            if ($query->words->titleTier($entry->text) === $tier) {
                $hits[] = self::hitOf($entry, $numbers[$entry->task_id], $tier);
            }
        }

        $examinedWholeBlock = $block->isEmpty() || $afterLine === $block->last()->id;
        $tierFinished = $examinedWholeBlock && $block->count() < $blockSize;
        $nextTier = $tier->nextTitleTier();

        if ($tierFinished && $nextTier === null) {
            return SearchBatch::exhausted($highWater, $hits);
        }

        $next = $tierFinished
            ? self::position($nextTier, '', '', $highWater)
            : self::position($tier, $afterTask, $afterLine, $highWater);

        return $hits === [] ? SearchBatch::scanning($highWater, $next) : SearchBatch::more($highWater, $hits, $next);
    }

    /**
     * Rereads the held lines in one query, inside the tasks the reader may read now, and answers each that still
     * matches at its current tier.
     */
    private function refresh(RefreshCandidates $query, AdmittedConstraints $constraints): SearchBatch
    {
        $entryIds = array_values(array_filter(array_map(fn ($held) => $held->locationId, $query->candidates)));
        $query->budget()->chargePolicyChecks(count($entryIds));

        $milliseconds = $query->budget()->remainingMilliseconds();
        $lines = $this->deadline->within($milliseconds, fn () => $this->lines($constraints)
            ->whereKey($entryIds)
            ->readExactly(count($entryIds))
            ->get(self::COLUMNS));

        $numbers = $this->taskNumbers($lines);
        $matches = [];

        foreach ($lines as $entry) {
            $tier = $query->words()->titleTier($entry->text);

            if ($tier !== null && $this->access->admitsOpen($query->reader, $entry->task_id)) {
                $matches[] = self::hitOf($entry, $numbers[$entry->task_id], $tier);
            }
        }

        usort($matches, fn (SearchResult $first, SearchResult $second): int => $first->compare($second));

        return SearchBatch::refreshed('', $query, $matches);
    }

    /**
     * The lines of the tasks the reader may search: of the served environment, limited to the admitted task ids.
     *
     * @return ReadBuilder<TaskLogEntry>
     */
    private function lines(AdmittedConstraints $constraints): ReadBuilder
    {
        $tasks = Task::query()->inEnvironments($this->environment->environmentIds());

        if ($constraints->recordIds->isRestricted()) {
            $tasks->whereKey($constraints->recordIds->names());
        }

        return TaskLogEntry::query()->ofTasksIn($tasks);
    }

    /**
     * The numbers of the block's parent tasks, read once for the block.
     *
     * @param  Collection<int, TaskLogEntry>  $lines
     * @return array<string, int>
     */
    private function taskNumbers(Collection $lines): array
    {
        $taskIds = array_values(array_unique($lines->pluck('task_id')->all()));

        if ($taskIds === []) {
            return [];
        }

        return Task::query()->whereKey($taskIds)->readExactly(count($taskIds))->pluck('number', 'id')->all();
    }

    private static function hitOf(TaskLogEntry $entry, int $number, ScoreTier $tier): SearchResult
    {
        $location = TaskLogLocation::of($entry->line);

        return SearchResult::shortened(
            "Task {$number} · {$location->label()}",
            $entry->text,
            new RecordIdentity(Task::LINK_TYPE, $entry->task_id),
            $tier,
            $location->location(),
        );
    }

    private static function position(
        ScoreTier $tier,
        string $afterTask,
        string $afterLine,
        string $highWater,
    ): SourcePosition {
        return SourcePosition::of([
            self::TIER => $tier->value,
            self::AFTER_TASK => $afterTask,
            self::AFTER_LINE => $afterLine,
            self::HIGH_WATER => $highWater,
        ]);
    }
}
