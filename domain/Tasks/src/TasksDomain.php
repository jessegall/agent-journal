<?php

declare(strict_types=1);

namespace Domain\Tasks;

use App\Actors\Contracts\PolicyProvider;
use App\Actors\Values\PolicyDefinition;
use App\Assignments\Contracts\AutoAssignmentProvider;
use App\Assignments\Support\AutoAssignerDefinition;
use App\Assignments\Support\PoolDefinition;
use App\Autoload\Support\FolderClasses;
use App\Bus\Contracts\Command;
use App\Bus\Contracts\CommandProvider;
use App\Domains\Concerns\HasAssignables;
use App\Domains\Concerns\HasLinkRecords;
use App\Domains\Concerns\HasNumberedModels;
use App\Domains\Concerns\HasStates;
use App\Domains\Contracts\AssignableContributor;
use App\Domains\Contracts\InternalAssignableContributor;
use App\Domains\Contracts\LinkRecordProvider;
use App\Domains\Contracts\StateProvider;
use App\Domains\Support\Domain;
use App\Exports\Support\Exports;
use App\Mcp\Contracts\McpToolProvider;
use App\Numbers\Contracts\NumberedModelProvider;
use App\Numbers\Support\NumberedModel;
use App\Operations\Enums\AccessType;
use App\Skills\Contracts\SkillProvider;
use App\Ui\Contracts\PageProvider;
use App\Ui\Declarations\ActionRoute;
use App\Ui\Declarations\Page;
use App\Ui\Declarations\Slot;
use App\Ui\Enums\Icon;
use Domain\Tasks\Api\Events\TaskBlocked;
use Domain\Tasks\Api\Events\TaskCancelled;
use Domain\Tasks\Api\Events\TaskCheckRecorded;
use Domain\Tasks\Api\Events\TaskFinished;
use Domain\Tasks\Api\Events\TaskLogged;
use Domain\Tasks\Api\Events\TaskStartCommitted;
use Domain\Tasks\Api\Events\TaskWaitChanged;
use Domain\Tasks\Api\TaskAssignmentCompletion;
use Domain\Tasks\Api\TaskCard;
use Domain\Tasks\Api\TaskDetails;
use Domain\Tasks\Api\TaskExecution;
use Domain\Tasks\Api\TaskFilters;
use Domain\Tasks\Api\TaskHistoryPage;
use Domain\Tasks\Api\TaskHolderFilter;
use Domain\Tasks\Api\TaskList;
use Domain\Tasks\Api\TaskLogLine;
use Domain\Tasks\Api\TaskLogPage;
use Domain\Tasks\Api\TaskProgress;
use Domain\Tasks\Api\TaskProof;
use Domain\Tasks\Api\TaskProofPage;
use Domain\Tasks\Api\TaskSummary;
use Domain\Tasks\Api\TaskText;
use Domain\Tasks\Api\TaskTransition;
use Domain\Tasks\Api\TaskWaitLink;
use Domain\Tasks\Api\TaskWaits;
use Domain\Tasks\Api\TaskType;
use Domain\Tasks\Assignments\ActiveTaskAssignments;
use Domain\Tasks\Assignments\NamedTaskPoolFactory;
use Domain\Tasks\Assignments\OpenTaskPoolFactory;
use Domain\Tasks\Assignments\TaskAssigner;
use Domain\Tasks\Contracts\AssignedTaskResolver;
use Domain\Tasks\Contracts\TaskAssignmentResolver;
use Domain\Tasks\Contracts\TaskDetailsResolver;
use Domain\Tasks\Contracts\TaskListResolver;
use Domain\Tasks\Contracts\TaskHistoryResolver;
use Domain\Tasks\Contracts\TaskLogResolver;
use Domain\Tasks\Contracts\TaskProgressCounter;
use Domain\Tasks\Contracts\TaskProofResolver;
use Domain\Tasks\Contracts\TaskResolver;
use Domain\Tasks\Contracts\TaskWaitResolver;
use Domain\Tasks\Enums\TaskState;
use Domain\Tasks\Enums\TaskWaitChange;
use Domain\Tasks\Events\TaskStarted;
use Domain\Tasks\Exceptions\TaskMissing;
use Domain\Tasks\Http\Controllers\AddTaskWaitPageController;
use Domain\Tasks\Http\Controllers\RemoveTaskWaitPageController;
use Domain\Tasks\Http\Controllers\WaiveTaskWaitPageController;
use Domain\Tasks\Mcp\HeldTasksOverview;
use Domain\Tasks\Mcp\TaskResource;
use Domain\Tasks\Mcp\TaskSearch;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Models\TaskRun;
use Domain\Tasks\Policies\TaskPolicy;
use Domain\Tasks\Policies\TaskRunPolicy;
use Domain\Tasks\Resolvers\TaskAssignments;
use Domain\Tasks\Resolvers\TaskRecords;
use Domain\Tasks\Resolvers\TaskRunAssignments;
use Domain\Tasks\Resolvers\TasksWindowResolver;
use Domain\Tasks\Resolvers\TaskWindowResolver;
use Domain\Tasks\Skills\TasksSkill;
use Domain\Tasks\States\Support\WorkingOnTaskStateFactory;
use Domain\Tasks\States\Support\WorkingOnTaskStateReference;

final class TasksDomain extends Domain implements
    AssignableContributor,
    AutoAssignmentProvider,
    CommandProvider,
    InternalAssignableContributor,
    LinkRecordProvider,
    McpToolProvider,
    NumberedModelProvider,
    PageProvider,
    PolicyProvider,
    SkillProvider,
    StateProvider
{
    use HasAssignables;
    use HasLinkRecords;
    use HasNumberedModels;
    use HasStates;

    public function description(): string
    {
        return 'A task, its state, its log and what it waits on.';
    }

    /**
     * @return list<class-string>
     */
    public function commands(): array
    {
        return FolderClasses::in(__DIR__.'/Commands', Command::class);
    }

    /**
     * @return list<class-string<Domain>>
     */
    public function requires(): array
    {
        return [];
    }

    public function pages(): array
    {
        return [
            Page::make('list', 'Tasks', Icon::Tasks, TasksWindowResolver::class, 'TasksWindow.vue')
                ->at('')
                ->onHome(25),
            Page::make('task', 'Task', Icon::Tasks, TaskWindowResolver::class, 'TaskWindow.vue')
                ->at('{task}')
                ->inInspector()
                ->actions(
                    ActionRoute::post('{task}/waits', AddTaskWaitPageController::class, 'add-wait'),
                    ActionRoute::post('{task}/waits/remove', RemoveTaskWaitPageController::class, 'remove-wait'),
                    ActionRoute::post('{task}/waits/waive', WaiveTaskWaitPageController::class, 'waive-wait'),
                )
                ->slots(Slot::record('inspector', 'task', 'task')),
        ];
    }

    public function exports(): Exports
    {
        return Exports::make()
            ->events(
                TaskStarted::class,
                TaskFinished::class,
                TaskBlocked::class,
                TaskCancelled::class,
                TaskStartCommitted::class,
                TaskLogged::class,
                TaskCheckRecorded::class,
                TaskWaitChanged::class,
            )
            ->contracts(
                TaskProgressCounter::class,
                TaskHistoryResolver::class,
                TaskLogResolver::class,
                TaskProofResolver::class,
                TaskWaitResolver::class,
                TaskResolver::class,
                TaskAssignmentResolver::class,
                AssignedTaskResolver::class,
                TaskListResolver::class,
                TaskDetailsResolver::class,
            )
            ->values(
                TaskProgress::class,
                TaskHistoryPage::class,
                TaskTransition::class,
                TaskLogPage::class,
                TaskLogLine::class,
                TaskProofPage::class,
                TaskProof::class,
                TaskWaits::class,
                TaskWaitLink::class,
                TaskWaitChange::class,
                TaskSummary::class,
                TaskAssignmentCompletion::class,
                TaskCard::class,
                TaskFilters::class,
                TaskHolderFilter::class,
                TaskList::class,
                TaskState::class,
                TaskExecution::class,
                TaskDetails::class,
                TaskText::class,
                TaskType::class,
            )
            ->exceptions(TaskMissing::class)
            ->build();
    }

    public function policies(): array
    {
        return [
            new PolicyDefinition(
                TaskPolicy::class,
                [AccessType::Read, AccessType::Create, AccessType::Edit, AccessType::Admin],
            ),
            new PolicyDefinition(
                TaskRunPolicy::class,
                [AccessType::Create, AccessType::Edit],
            ),
        ];
    }

    public function states(): array
    {
        return [WorkingOnTaskStateReference::TYPE_KEY => WorkingOnTaskStateFactory::class];
    }

    public function assignables(): array
    {
        return [Task::LINK_TYPE => TaskAssignments::class];
    }

    public function internalAssignables(): array
    {
        return [TaskRun::LINK_TYPE => TaskRunAssignments::class];
    }

    public function autoAssigners(): array
    {
        return [new AutoAssignerDefinition(TaskType::VALUE, TaskAssigner::class, ActiveTaskAssignments::class)];
    }

    public function assignmentPools(): array
    {
        return [
            new PoolDefinition(OpenTaskPoolFactory::KEY, TaskType::VALUE, OpenTaskPoolFactory::class, 'Open tasks'),
            new PoolDefinition(NamedTaskPoolFactory::KEY, TaskType::VALUE, NamedTaskPoolFactory::class, 'Named tasks'),
        ];
    }

    public function linkRecords(): array
    {
        return [Task::LINK_TYPE => TaskRecords::class];
    }

    public function numberedModels(): array
    {
        return [NumberedModel::global(Task::class)];
    }

    public function mcpResources(): array
    {
        return [TaskResource::class];
    }

    public function overviewContributions(): array
    {
        return [HeldTasksOverview::class];
    }

    public function searchContributions(): array
    {
        return [TaskSearch::class];
    }

    public function skills(): array
    {
        return [TasksSkill::class];
    }
}
