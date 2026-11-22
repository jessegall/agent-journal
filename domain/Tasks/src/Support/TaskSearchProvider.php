<?php

declare(strict_types=1);

namespace Domain\Tasks\Support;

use App\Contracts\SearchProvider;
use App\Contracts\ServedEnvironment;
use App\Enums\ScoreTier;
use App\Support\RecordIdentity;
use App\Support\TieredRecordSearch;
use App\Values\AdmittedConstraints;
use App\Values\HitIdentity;
use App\Values\SearchableBody;
use App\Values\SearchBatch;
use App\Values\SearchQuery;
use App\Values\SearchResult;
use App\Values\TieredSearchSource;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Values\TaskBriefPassage;
use Illuminate\Database\Eloquent\Builder;

/**
 * Searches tasks through the shared bounded tiered search: a task reference such as task 2241 first, then the
 * title tiers, then the briefs, whose hits name the passage they were found at. Only tasks of the served environment
 * the reader's grant admits are read.
 */
final readonly class TaskSearchProvider implements SearchProvider
{
    public const int BLOCK_SIZE = TieredRecordSearch::BLOCK_SIZE;

    public const int SEGMENT_CHARACTERS = TieredRecordSearch::SEGMENT_CHARACTERS;

    private const int SNIPPET_CONTEXT_CHARACTERS = 60;

    public function __construct(
        private TaskSearchAccess $access,
        private TaskReferenceRecognizer $recognizer,
        private ServedEnvironment $environment,
        private TieredRecordSearch $tiers,
    ) {}

    public function search(SearchQuery $query): SearchBatch
    {
        $constraints = $this->access->constraints($query->reader);

        if ($constraints->recordIds->admitsNone()) {
            return SearchBatch::exhausted('', []);
        }

        return $this->tiers->search($query, new TieredSearchSource(
            admitted: fn () => $this->admitted($constraints),
            idColumn: 'id',
            titleColumn: 'title',
            columns: ['id', 'number', 'title', 'revision'],
            titleOf: fn (Task $task): string => $task->title,
            hitOf: self::hitOf(...),
            admitsOpen: fn (string $taskId): bool => $this->access->admitsOpen($query->reader, $taskId),
            referenceOf: fn (SearchQuery $asked, TieredSearchSource $tasks): SearchResult|null => $this->tiers
                ->numberedReference($asked, $this->recognizer, $tasks),
            body: new SearchableBody('brief', self::briefHit(...), self::currentPassage(...)),
        ));
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

    private static function hitOf(Task $task, ScoreTier $tier): SearchResult
    {
        return SearchResult::shortened(
            "Task {$task->number} · {$task->title}",
            $tier === ScoreTier::Reference ? "Task {$task->number}" : $task->title,
            new RecordIdentity(Task::LINK_TYPE, $task->id),
            $tier,
        );
    }

    /**
     * A brief hit titled with the task, its excerpt the matching text with a little before it, at its passage.
     */
    private static function briefHit(Task $task, string $text, int $column, int $characterOffset): SearchResult
    {
        $from = max(0, $column - self::SNIPPET_CONTEXT_CHARACTERS);

        return SearchResult::shortened(
            "Task {$task->number} · {$task->title} · Brief",
            mb_substr($text, $from, SearchResult::SNIPPET_CHARACTER_LIMIT),
            new RecordIdentity(Task::LINK_TYPE, $task->id),
            ScoreTier::BodyContains,
            new TaskBriefPassage($task->revision, $characterOffset)->location(),
        );
    }

    /**
     * A held brief hit as it stands now: the same passage of an unchanged brief that still holds the words, while
     * the title still holds no tier; null when the passage is gone.
     */
    private static function currentPassage(
        Task $task,
        string $brief,
        HitIdentity $held,
        SearchQuery $query,
    ): SearchResult|null {
        if ($held->locationId === null || ! TaskBriefPassage::isId($held->locationId)) {
            return null;
        }

        $passage = TaskBriefPassage::fromId($held->locationId);

        if (! $passage->isOpenIn($brief, $task->revision) || $query->words->titleTier($task->title) !== null) {
            return null;
        }

        $excerpt = $passage->excerptOf($brief, $task->revision, self::SEGMENT_CHARACTERS);

        if (! $query->words->isFoundIn($excerpt)) {
            return null;
        }

        $found = mb_stripos($excerpt, $query->words->text);

        return self::briefHit($task, $excerpt, $found === false ? 0 : $found, $passage->characterOffset);
    }
}
