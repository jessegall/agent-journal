<?php

declare(strict_types=1);

namespace Domain\Tasks\Support;

use App\Contracts\ServedEnvironment;
use App\Enums\ScoreTier;
use App\Support\RecordIdentity;
use App\Values\AdmittedConstraints;
use App\Values\RecognizedReference;
use App\Values\SearchResult;
use Domain\Tasks\Models\Task;

/**
 * Finds the task a recognized reference names in one indexed read: the journal's task number group and the unique
 * (number_group_id, number) index, inside the served environment and the reader's admitted task ids. A missing
 * group, an absent task and one the reader may not see all give no result.
 */
final readonly class TaskReferenceLookup
{
    public function __construct(private ServedEnvironment $environment) {}

    public function find(RecognizedReference $reference, AdmittedConstraints $constraints): SearchResult|null
    {
        if ($constraints->recordIds->admitsNone()) {
            return null;
        }

        $query = Task::query()->numberedInJournal($reference->number)
            ->inEnvironments($this->environment->environmentIds());

        if ($constraints->recordIds->isRestricted()) {
            $query->whereKey($constraints->recordIds->names());
        }

        $task = $query->first(['id', 'number', 'title']);

        if ($task === null) {
            return null;
        }

        return SearchResult::shortened(
            "Task {$task->number} · {$task->title}",
            "Task {$task->number}",
            new RecordIdentity(Task::LINK_TYPE, $task->id),
            ScoreTier::Reference,
        );
    }
}
