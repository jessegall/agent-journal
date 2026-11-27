<?php

declare(strict_types=1);

namespace Domain\Tasks\Support;

use App\Hosts\Contracts\ServedEnvironment;
use App\Search\Contracts\SearchProvider;
use App\Search\Contracts\TieredSearch;
use App\Search\Enums\ScoreTier;
use App\Search\Values\AdmittedConstraints;
use App\Search\Values\BodyMatch;
use App\Search\Values\HitIdentity;
use App\Search\Values\RefreshCandidates;
use App\Search\Values\SearchableBody;
use App\Search\Values\SearchBatch;
use App\Search\Values\SearchQuery;
use App\Search\Values\SearchResult;
use App\Search\Values\SearchWords;
use App\Search\Values\TieredSearchSource;
use App\Support\ReadBuilder;
use App\Support\RecordIdentity;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Values\TaskBriefPassage;

/**
 * Searches tasks through the shared bounded tiered search: a task reference such as task 2241 first, then the
 * title tiers, then the briefs, whose hits name the passage they were found at. Only tasks of the served environment
 * the reader's grant admits are read.
 */
final readonly class TaskSearchProvider implements SearchProvider
{
    public const int BLOCK_ROW_LIMIT = TieredSearch::BLOCK_ROW_LIMIT;

    public const int SEGMENT_CHARACTER_LIMIT = TieredSearch::SEGMENT_CHARACTER_LIMIT;

    private const int SNIPPET_CONTEXT_CHARACTERS = 60;

    public function __construct(
        private TaskSearchAccess $access,
        private TaskReferenceRecognizer $recognizer,
        private ServedEnvironment $environment,
        private TieredSearch $tiers,
    ) {}

    public function search(SearchQuery|RefreshCandidates $query): SearchBatch
    {
        $constraints = $this->access->constraints($query->reader);

        if ($constraints->recordIds->hasNoneAllowed()) {
            return SearchBatch::nothing();
        }

        return $this->tiers->search($query, new TieredSearchSource(
            admitted: fn () => $this->admitted($constraints),
            idColumn: 'id',
            titleColumn: 'title',
            columns: ['id', 'number', 'title', 'revision'],
            titleOf: fn (Task $task): string => $task->title,
            hitOf: self::hitOf(...),
            admitsOpen: fn (string $taskId) => $this->access->admitsOpen($query->reader, $taskId),
            referenceOf: fn (SearchQuery $asked, TieredSearchSource $tasks): SearchResult|null => $this->tiers
                ->numberedReference($asked, $this->recognizer, $tasks),
            body: new SearchableBody('brief', self::briefHit(...), self::currentPassage(...)),
        ));
    }

    /**
     * The tasks the reader may search: those of the served environment, limited to the admitted ids.
     *
     * @return ReadBuilder<Task>
     */
    private function admitted(AdmittedConstraints $constraints): ReadBuilder
    {
        return $constraints->narrow(Task::query()->inEnvironments($this->environment->environmentIds()));
    }

    private static function hitOf(Task $task, ScoreTier $tier): SearchResult
    {
        return SearchResult::shortened(
            "Task {$task->number} · {$task->title}",
            $tier === ScoreTier::Reference ? "Task {$task->number}" : $task->title,
            new RecordIdentity(Task::linkType(), $task->id),
            $tier,
        );
    }

    /**
     * A brief hit titled with the task, its excerpt the matching text with a little before it, at its passage.
     */
    private static function briefHit(Task $task, BodyMatch $match): SearchResult
    {
        return SearchResult::shortened(
            "Task {$task->number} · {$task->title}",
            $match->snippet(self::SNIPPET_CONTEXT_CHARACTERS),
            new RecordIdentity(Task::linkType(), $task->id),
            ScoreTier::BodyContains,
            new TaskBriefPassage($task->revision, $match->characterOffset)->location(),
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
        SearchWords $words,
    ): SearchResult|null {
        if ($held->locationId === null || ! TaskBriefPassage::isId($held->locationId)) {
            return null;
        }

        $passage = TaskBriefPassage::fromId($held->locationId);

        if (! $passage->isOpenIn($brief, $task->revision) || $words->titleTier($task->title) !== null) {
            return null;
        }

        $excerpt = $passage->excerptOf($brief, $task->revision, self::SEGMENT_CHARACTER_LIMIT);

        if (! $words->isFoundIn($excerpt)) {
            return null;
        }

        $match = new BodyMatch($excerpt, $words->columnIn($excerpt), $passage->characterOffset, 1);

        return self::briefHit($task, $match);
    }
}
