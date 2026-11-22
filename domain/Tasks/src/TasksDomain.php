<?php

declare(strict_types=1);

namespace Domain\Tasks;

use App\Concerns\HasAssignables;
use App\Concerns\HasLinkRecords;
use App\Concerns\HasStates;
use App\Contracts\AssignableContributor;
use App\Contracts\AutoAssignmentProvider;
use App\Contracts\Command;
use App\Contracts\CommandProvider;
use App\Contracts\InternalAssignableContributor;
use App\Contracts\LinkRecordProvider;
use App\Contracts\NativePartProvider;
use App\Contracts\PageProvider;
use App\Contracts\PolicyProvider;
use App\Contracts\SkillProvider;
use App\Contracts\StateProvider;
use App\Declarations\ActionRoute;
use App\Declarations\Page;
use App\Declarations\Slot;
use App\Enums\AccessType;
use App\Enums\Icon;
use App\Mcp\Contracts\McpToolProvider;
use App\Support\AutoAssignerDefinition;
use App\Support\Domain;
use App\Support\Exports;
use App\Support\FolderClasses;
use App\Support\PoolDefinition;
use App\Support\Searchable;
use App\Values\PolicyDefinition;
use Domain\Tasks\Contracts\AssignedTaskResolver;
use Domain\Tasks\Contracts\TaskAssignmentResolver;
use Domain\Tasks\Contracts\TaskDetailsResolver;
use Domain\Tasks\Contracts\TaskGraphResolver;
use Domain\Tasks\Contracts\TaskHistoryResolver;
use Domain\Tasks\Contracts\TaskListResolver;
use Domain\Tasks\Contracts\TaskLogResolver;
use Domain\Tasks\Contracts\TaskProgressCounter;
use Domain\Tasks\Contracts\TaskProofResolver;
use Domain\Tasks\Contracts\TaskResolver;
use Domain\Tasks\Contracts\TaskWaitResolver;
use Domain\Tasks\Data\TaskDetails;
use Domain\Tasks\Data\TaskGraph;
use Domain\Tasks\Data\TaskGraphDestinations;
use Domain\Tasks\Data\TaskGraphEdge;
use Domain\Tasks\Data\TaskGraphNode;
use Domain\Tasks\Data\TaskGraphSuggestion;
use Domain\Tasks\Data\TaskText;
use Domain\Tasks\Enums\TaskHolderFilter;
use Domain\Tasks\Enums\TaskState;
use Domain\Tasks\Enums\TaskWaitChange;
use Domain\Tasks\Events\TaskBlocked;
use Domain\Tasks\Events\TaskCancelled;
use Domain\Tasks\Events\TaskCheckRecorded;
use Domain\Tasks\Events\TaskDescribed;
use Domain\Tasks\Events\TaskFinished;
use Domain\Tasks\Events\TaskLogged;
use Domain\Tasks\Events\TaskStartCommitted;
use Domain\Tasks\Events\TaskStarted;
use Domain\Tasks\Events\TaskWaitChanged;
use Domain\Tasks\Exceptions\TaskMissing;
use Domain\Tasks\Http\Controllers\AddTaskWaitPageController;
use Domain\Tasks\Http\Controllers\BlockTaskPageController;
use Domain\Tasks\Http\Controllers\CancelTaskPageController;
use Domain\Tasks\Http\Controllers\CreateTaskPageController;
use Domain\Tasks\Http\Controllers\RemoveTaskWaitPageController;
use Domain\Tasks\Http\Controllers\StartTaskPageController;
use Domain\Tasks\Http\Controllers\WaiveTaskWaitPageController;
use Domain\Tasks\Mcp\Resources\TaskResource;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Models\TaskRun;
use Domain\Tasks\Policies\TaskPolicy;
use Domain\Tasks\Policies\TaskRunPolicy;
use Domain\Tasks\Resolvers\TaskAssignments;
use Domain\Tasks\Resolvers\TaskRecords;
use Domain\Tasks\Resolvers\TaskRunAssignments;
use Domain\Tasks\Resolvers\TasksWindowResolver;
use Domain\Tasks\Resolvers\TaskWindowResolver;
use Domain\Tasks\Support\Assignments\ActiveTaskAssignments;
use Domain\Tasks\Support\Assignments\NamedTaskPoolFactory;
use Domain\Tasks\Support\Assignments\OpenTaskPoolFactory;
use Domain\Tasks\Support\Assignments\TaskAssigner;
use Domain\Tasks\Support\Mcp\HeldTasksOverview;
use Domain\Tasks\Support\Skills\TasksSkill;
use Domain\Tasks\Support\States\Support\WorkingOnTaskStateFactory;
use Domain\Tasks\Support\States\Support\WorkingOnTaskStateReference;
use Domain\Tasks\Support\TaskLogSearchAccess;
use Domain\Tasks\Support\TaskLogSearchProvider;
use Domain\Tasks\Support\TaskReferenceRecognizer;
use Domain\Tasks\Support\TaskSearchAccess;
use Domain\Tasks\Support\TaskSearchProvider;
use Domain\Tasks\Support\TaskType;
use Domain\Tasks\Values\TaskAssignmentCompletion;
use Domain\Tasks\Values\TaskCard;
use Domain\Tasks\Values\TaskExecution;
use Domain\Tasks\Values\TaskFilters;
use Domain\Tasks\Values\TaskHistoryPage;
use Domain\Tasks\Values\TaskList;
use Domain\Tasks\Values\TaskLogLine;
use Domain\Tasks\Values\TaskLogPage;
use Domain\Tasks\Values\TaskProgress;
use Domain\Tasks\Values\TaskProof;
use Domain\Tasks\Values\TaskProofPage;
use Domain\Tasks\Values\TaskSummary;
use Domain\Tasks\Values\TaskTransition;
use Domain\Tasks\Values\TaskWaitLink;
use Domain\Tasks\Values\TaskWaits;

final class TasksDomain extends Domain implements
    AssignableContributor,
    AutoAssignmentProvider,
    CommandProvider,
    InternalAssignableContributor,
    LinkRecordProvider,
    McpToolProvider,
    NativePartProvider,
    PageProvider,
    PolicyProvider,
    SkillProvider,
    StateProvider
{
    use HasAssignables;
    use HasLinkRecords;
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
        return FolderClasses::in(__DIR__.'/Commands/*', Command::class);
    }

    /**
     * @return list<class-string<Domain>>
     */
    public function requires(): array
    {
        return [];
    }

    /**
     * The native parts a declared page mounts: a plan's task graph, and a task's Waits, Logs and Proofs tabs.
     *
     * @return list<string>
     */
    public function nativeParts(): array
    {
        return ['TaskCommentsTab.vue', 'TaskGraph.vue', 'TaskLogsTab.vue', 'TaskProofsTab.vue', 'TaskWaitsTab.vue'];
    }

    public function pages(): array
    {
        return [
            Page::layout('list', 'Tasks', Icon::Tasks, TasksWindowResolver::class)
                ->at('')
                ->onHome(25)
                ->actions(ActionRoute::post('create', CreateTaskPageController::class, 'create-task')),
            Page::layout('task', 'Task', Icon::Tasks, TaskWindowResolver::class)
                ->at('{task}')
                ->inInspector()
                ->actions(
                    ActionRoute::post('{task}/start', StartTaskPageController::class, 'start'),
                    ActionRoute::post('{task}/block', BlockTaskPageController::class, 'block'),
                    ActionRoute::post('{task}/cancel', CancelTaskPageController::class, 'cancel'),
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
                TaskDescribed::class,
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
                TaskGraphResolver::class,
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
                TaskGraph::class,
                TaskGraphNode::class,
                TaskGraphEdge::class,
                TaskGraphSuggestion::class,
                TaskGraphDestinations::class,
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

    public function mcpResources(): array
    {
        return [TaskResource::class];
    }

    public function overviewContributions(): array
    {
        return [HeldTasksOverview::class];
    }

    public function searchables(): array
    {
        return [
            Searchable::make(
                'task',
                'Tasks',
                TaskSearchAccess::class,
                TaskSearchProvider::class,
                TaskReferenceRecognizer::class,
            ),
            Searchable::make('log', 'Task log lines', TaskLogSearchAccess::class, TaskLogSearchProvider::class),
        ];
    }

    public function skills(): array
    {
        return [TasksSkill::class];
    }
}
