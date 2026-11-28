<?php

declare(strict_types=1);

namespace Domain\Tasks;

use App\Access\Contracts\PolicyProvider;
use App\Access\Values\PolicyDefinition;
use App\Agents\Drivers\Contracts\NativePartProvider;
use App\Agents\Enums\AccessType;
use App\Assignments\AutoAssignerDefinition;
use App\Assignments\Contracts\AssignableContributor;
use App\Assignments\Contracts\AutoAssignmentProvider;
use App\Assignments\Contracts\InternalAssignableContributor;
use App\Assignments\PoolDefinition;
use App\Concerns\HasAssignables;
use App\Concerns\HasLinkRecords;
use App\Concerns\HasStates;
use App\Declarations\Page;
use App\Declarations\PageActions;
use App\Declarations\PageSlots;
use App\Mcp\Contracts\McpToolProvider;
use App\Navigation\Contracts\DraftProducerProvider;
use App\Navigation\Contracts\NavigationProvider;
use App\Navigation\Contracts\PageProvider;
use App\Navigation\Declarations\NavigationItem;
use App\Navigation\Enums\Icon;
use App\Records\Contracts\LinkRecordProvider;
use App\Records\Contracts\StateProvider;
use App\Skills\Contracts\SkillProvider;
use App\Support\Domain;
use App\Support\Exports;
use App\Support\SearchSource;
use Domain\Comments\CommentsDomain;
use Domain\Tasks\Commands\ApplyTaskWaits\ApplyTaskWaitsCommand;
use Domain\Tasks\Contracts\AssignedTaskResolver;
use Domain\Tasks\Contracts\TaskAssignmentResolver;
use Domain\Tasks\Contracts\TaskDetailsResolver;
use Domain\Tasks\Contracts\TaskGraphResolver;
use Domain\Tasks\Contracts\TaskHistoryResolver;
use Domain\Tasks\Contracts\TaskListResolver;
use Domain\Tasks\Contracts\TaskLogResolver;
use Domain\Tasks\Contracts\TaskProgressCounter;
use Domain\Tasks\Contracts\TaskProofResolver;
use Domain\Tasks\Contracts\TaskRunEndEvent;
use Domain\Tasks\Contracts\TaskStateEvent;
use Domain\Tasks\Contracts\TaskVisibility;
use Domain\Tasks\Contracts\TaskWaitResolver;
use Domain\Tasks\Data\TaskDetails;
use Domain\Tasks\Data\TaskGraph;
use Domain\Tasks\Data\TaskGraphDestinations;
use Domain\Tasks\Data\TaskGraphEdge;
use Domain\Tasks\Data\TaskGraphNode;
use Domain\Tasks\Data\TaskGraphSuggestion;
use Domain\Tasks\Data\TasksPaneData;
use Domain\Tasks\Data\TaskText;
use Domain\Tasks\Enums\TaskHolderFilter;
use Domain\Tasks\Enums\TaskStatus;
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
use Domain\Tasks\Exceptions\TaskGraphChanged;
use Domain\Tasks\Exceptions\TaskMissing;
use Domain\Tasks\Exceptions\TaskWaitRefused;
use Domain\Tasks\Http\Controllers\AddTaskWaitPageController;
use Domain\Tasks\Http\Controllers\BlockTaskPageController;
use Domain\Tasks\Http\Controllers\CancelTaskPageController;
use Domain\Tasks\Http\Controllers\CreateTaskPageController;
use Domain\Tasks\Http\Controllers\RemoveTaskWaitPageController;
use Domain\Tasks\Http\Controllers\StartTaskPageController;
use Domain\Tasks\Http\Controllers\WaiveTaskWaitPageController;
use Domain\Tasks\Http\Pages\TaskPageBuilder;
use Domain\Tasks\Http\Pages\TaskPageData;
use Domain\Tasks\Http\Pages\TasksPageBuilder;
use Domain\Tasks\Http\Pages\TasksPageData;
use Domain\Tasks\Http\Windows\TasksWindowBuilder;
use Domain\Tasks\Mcp\Resources\TaskResource;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Models\TaskRun;
use Domain\Tasks\Policies\TaskPolicy;
use Domain\Tasks\Policies\TaskRunPolicy;
use Domain\Tasks\Resolvers\TaskAssignmentProvider;
use Domain\Tasks\Resolvers\TaskRecords;
use Domain\Tasks\Resolvers\TaskRunAssignmentProvider;
use Domain\Tasks\Support\Assignments\AssignedWorkProvider;
use Domain\Tasks\Support\Assignments\AutoAssigner;
use Domain\Tasks\Support\Assignments\NamedTaskPoolFactory;
use Domain\Tasks\Support\Assignments\OpenTaskPoolFactory;
use Domain\Tasks\Support\Mcp\HeldTasksOverview;
use Domain\Tasks\Support\Skills\TasksSkill;
use Domain\Tasks\Support\States\LogDueState;
use Domain\Tasks\Support\States\WorkOnTaskState;
use Domain\Tasks\Support\TaskDraftProducer;
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
use Domain\Tasks\Values\TaskWaitPair;
use Domain\Tasks\Values\TaskWaits;

final class TasksDomain extends Domain implements
    AssignableContributor,
    AutoAssignmentProvider,
    DraftProducerProvider,
    InternalAssignableContributor,
    LinkRecordProvider,
    McpToolProvider,
    NativePartProvider,
    NavigationProvider,
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

    public function draftProducers(): array
    {
        return ['task' => TaskDraftProducer::class];
    }

    /**
     * @return list<class-string<Domain>>
     */
    public function requires(): array
    {
        return [CommentsDomain::class];
    }

    /**
     * The native parts a declared page mounts: a plan's task graph, and a task's Waits, Logs and Proofs tabs.
     *
     * @return list<string>
     */
    public function nativeParts(): array
    {
        return [
            'TaskGraph.vue',
            'TaskLogsTab.vue',
            'TaskProofsTab.vue',
            'TaskWaitsTab.vue',
        ];
    }

    public function navigation(): array
    {
        return [NavigationItem::page('list', 'Tasks', Icon::Tasks, position: 10)];
    }

    public function pages(): array
    {
        return [
            Page::build()
                ->key('list')
                ->title('Tasks')
                ->icon(Icon::Tasks)
                ->pageType(TasksPageData::class)
                ->pageBuilder(TasksPageBuilder::class)
                ->declaredLayout()
                ->withWindow(TasksPaneData::class, TasksWindowBuilder::class, 'TasksPane.vue')
                ->finish()
                ->at('')
                ->onHome(25)
                ->actions(fn (PageActions $actions) => $actions
                    ->post('create', CreateTaskPageController::class, 'create-task')),
            Page::build()
                ->key('task')
                ->title('Task')
                ->icon(Icon::Tasks)
                ->pageType(TaskPageData::class)
                ->pageBuilder(TaskPageBuilder::class)
                ->declaredLayout()
                ->finish()
                ->at('{task}')
                ->inInspector()
                ->actions(fn (PageActions $actions) => $actions
                    ->post('{task}/start', StartTaskPageController::class, 'start')
                    ->post('{task}/block', BlockTaskPageController::class, 'block')
                    ->post('{task}/cancel', CancelTaskPageController::class, 'cancel')
                    ->post('{task}/waits', AddTaskWaitPageController::class, 'add-wait')
                    ->post('{task}/waits/remove', RemoveTaskWaitPageController::class, 'remove-wait')
                    ->post('{task}/waits/waive', WaiveTaskWaitPageController::class, 'waive-wait'))
                ->slots(fn (PageSlots $slots) => $slots->record('inspector', 'task', 'task')),
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
                TaskStateEvent::class,
                TaskRunEndEvent::class,
                TaskProgressCounter::class,
                TaskHistoryResolver::class,
                TaskLogResolver::class,
                TaskProofResolver::class,
                TaskWaitResolver::class,
                TaskGraphResolver::class,
                TaskVisibility::class,
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
                TaskStatus::class,
                TaskExecution::class,
                TaskDetails::class,
                TaskText::class,
                TaskType::class,
            )
            ->commands(ApplyTaskWaitsCommand::class)
            ->values(TaskWaitPair::class)
            ->exceptions(TaskMissing::class, TaskGraphChanged::class, TaskWaitRefused::class)
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
        return [
            WorkOnTaskState::class,
            LogDueState::class,
        ];
    }

    public function assignables(): array
    {
        return [Task::linkType() => TaskAssignmentProvider::class];
    }

    public function internalAssignables(): array
    {
        return [TaskRun::linkType() => TaskRunAssignmentProvider::class];
    }

    public function autoAssigners(): array
    {
        return [new AutoAssignerDefinition(TaskType::linkType(), AutoAssigner::class, AssignedWorkProvider::class)];
    }

    public function assignmentPools(): array
    {
        return [
            new PoolDefinition(
                OpenTaskPoolFactory::KEY,
                TaskType::linkType(),
                OpenTaskPoolFactory::class,
                'Open tasks',
            ),
            new PoolDefinition(
                NamedTaskPoolFactory::KEY,
                TaskType::linkType(),
                NamedTaskPoolFactory::class,
                'Named tasks',
            ),
        ];
    }

    public function linkRecords(): array
    {
        return [Task::linkType() => TaskRecords::class];
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
            SearchSource::make(
                'task',
                'Tasks',
                TaskSearchAccess::class,
                TaskSearchProvider::class,
                TaskReferenceRecognizer::class,
            ),
            SearchSource::make('log', 'Task log lines', TaskLogSearchAccess::class, TaskLogSearchProvider::class),
        ];
    }

    public function skills(): array
    {
        return [TasksSkill::class];
    }
}
