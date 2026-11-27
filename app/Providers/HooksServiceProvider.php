<?php

declare(strict_types=1);

namespace App\Providers;

use App\Access\Contracts\StackAdmission as StackAdmissionContract;
use App\Access\StackAdmission;
use App\Access\StateEvents\StateEventScope;
use App\Accounts\ProtectedAccounts;
use App\Actors\ActorGuidance;
use App\Actors\Contracts\ActorGuidance as ActorGuidanceContract;
use App\Actors\Contracts\ActorProviderRegistration;
use App\Actors\Contracts\ActorVisibility;
use App\Agents\Contracts\Events\HelperRecordFacts as HelperRecordFactsContract;
use App\Agents\Drivers\Contracts\DriverAdapters as DriverAdaptersContract;
use App\Agents\Drivers\Contracts\DriverCompatibilities as DriverCompatibilitiesContract;
use App\Agents\Drivers\Contracts\PinnedBuilds as PinnedBuildsContract;
use App\Agents\Drivers\Hooks\DriverAdapters;
use App\Agents\HelperRecordFacts;
use App\Bus\Contracts\Events\FactStaging;
use App\Concerns\LoadsCoreRoutes;
use App\Console\Commands\PruneHookHistoryCommand;
use App\Contracts\Work\StackTransaction as StackTransactionContract;
use App\Contracts\Work\StackTransactionRunner;
use App\Hooks\ContextBudget;
use App\Hooks\HookRetryWindow;
use App\Hooks\RetentionPeriods;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentStackRow;
use App\Models\Drivers\FailureReceipt;
use App\Models\Drivers\HookCall;
use App\Models\Sessions\StopCheck;
use App\Models\Support\AgentSessionScope;
use App\Processes\Contracts\StopEvidence as StopEvidenceContract;
use App\Processes\Contracts\StopPreparer;
use App\Processes\Readers\Contracts\Work\WorkProgress as WorkProgressContract;
use App\Processes\Readers\WorkProgress;
use App\Resolvers\DriverCompatibilities;
use App\Resolvers\StopEvidence;
use App\Scripts\NoStopPreparation;
use App\Sessions\Contracts\StartTransaction;
use App\Stacks\ActorStackSessionProvider;
use App\Stacks\AgentFocuses;
use App\Stacks\AgentStacks;
use App\Stacks\AgentState;
use App\Stacks\Attributes\StateType;
use App\Stacks\Contracts\BaseStateReference;
use App\Stacks\Contracts\StateFactory as StateFactoryContract;
use App\Stacks\Contracts\Work\AgentFocuses as AgentFocusesContract;
use App\Stacks\Contracts\Work\AgentStacks as AgentStacksContract;
use App\Stacks\Contracts\Work\CurrentState as CurrentStateContract;
use App\Stacks\Contracts\Work\IncomingWorkRegistration as IncomingWorkRegistrationContract;
use App\Stacks\Contracts\Work\UserStack as UserStackContract;
use App\Stacks\CurrentState;
use App\Stacks\Declarations\StateMethods;
use App\Stacks\Exceptions\InvalidBaseState;
use App\Stacks\IncomingWorkRegistration;
use App\Stacks\PendingAgentMessages;
use App\Stacks\PendingWorkSources;
use App\Stacks\SessionStateLifecycle;
use App\Stacks\StateFactory;
use App\Stacks\StateTypes;
use App\Stacks\Support\ReadyStateReference;
use App\Stacks\UserStack;
use App\Support\AgentContext;
use App\Support\Compatibility\PinnedBuilds;
use App\Support\Delivery\StateBridgeFactStaging;
use App\Support\Delivery\StateEventDispatcher;
use App\Support\Inspection\Contracts\StackInspectionQuery as StackInspectionQueryContract;
use App\Support\Inspection\Queries\StackInspectionQuery;
use App\Support\OperationDeadline;
use App\Support\Reflector;
use App\Support\StackTransaction;
use App\Support\StateCatalog\Contracts\StateTypes as StateTypesContract;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Container\Container;
use Illuminate\Contracts\Config\Repository;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Events\Dispatcher as LaravelEventDispatcher;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\ServiceProvider;

/**
 * Binds the state types and the retry window once per worker, and the state factory once per request,
 * and limits both Hooks models to the current agent and session each time a model boots.
 */
final class HooksServiceProvider extends ServiceProvider
{
    use LoadsCoreRoutes;

    public function register(): void
    {
        $this->app->extend(
            'events',
            static fn (LaravelEventDispatcher $events) => StateEventDispatcher::fromDispatcher(
                $events,
                static fn (): StateEventScope => Container::getInstance()->make(StateEventScope::class),
            ),
        );

        Event::clearResolvedInstance('events');

        $this->app->bind(AgentStacksContract::class, AgentStacks::class);
        $this->app->bind(AgentFocusesContract::class, AgentFocuses::class);
        $this->app->bind(HelperRecordFactsContract::class, HelperRecordFacts::class);
        $this->app->bind(CurrentStateContract::class, CurrentState::class);
        $this->app->bind(StackTransactionRunner::class, StackTransaction::class);
        $this->app->bind(UserStackContract::class, UserStack::class);
        $this->app->bind(StackInspectionQueryContract::class, StackInspectionQuery::class);
        $this->app->bind(StackTransactionContract::class, StackTransaction::class);
        $this->app->bind(StateTypesContract::class, StateTypes::class);
        $this->app->singleton(IncomingWorkRegistration::class);
        $this->app->singleton(IncomingWorkRegistrationContract::class, IncomingWorkRegistration::class);

        $this->app->singleton(StateTypes::class);
        $this->app->singleton(StateMethods::class);

        $this->app->when(SessionStateLifecycle::class)
            ->needs('$baseStates')
            ->give(self::baseStatesOf($this->app->make(Repository::class)->array('journal.sessions.base_states')));

        $this->app->bind(StartTransaction::class, StackTransaction::class);
        $this->app->bind(FactStaging::class, StateBridgeFactStaging::class);
        $this->app->bind(WorkProgressContract::class, WorkProgress::class);

        $this->app->singleton(ProtectedAccounts::class, fn ($app) => new ProtectedAccounts([
            $app->make(Repository::class)->string('accounts.root'),
        ]));

        $this->app->bind(DriverCompatibilitiesContract::class, DriverCompatibilities::class);
        $this->app->bind(DriverAdaptersContract::class, DriverAdapters::class);
        $this->app->scoped(StackAdmissionContract::class, StackAdmission::class);
        $this->app->scoped(StopEvidenceContract::class, StopEvidence::class);
        $this->app->bindIf(StopPreparer::class, NoStopPreparation::class);
        $this->app->bind(ActorGuidanceContract::class, ActorGuidance::class);
        $this->app->bind(PinnedBuildsContract::class, PinnedBuilds::class);

        $this->app->singleton(RetentionPeriods::class, fn () => new RetentionPeriods(
            $this->app->make('config')->integer('hooks.hook_call_days'),
            $this->app->make('config')->integer('hooks.closed_stack_days'),
        ));

        $this->app->scoped(StateFactoryContract::class, StateFactory::class);

        $this->app->singleton(
            OperationDeadline::class,
            fn () => new OperationDeadline(
                $this->app->make('config')->integer('hooks.operation_deadline_milliseconds'),
            ),
        );

        $this->app->singleton(
            ContextBudget::class,
            fn () => new ContextBudget($this->app->make('config')->integer('hooks.context_budget_characters')),
        );

        $this->app->singleton(
            HookRetryWindow::class,
            fn () => new HookRetryWindow($this->app->make('config')->integer('hooks.retry_seconds')),
        );
    }

    public function boot(
        Dispatcher $events,
        ActorProviderRegistration $actors,
        PendingWorkSources $pendingWork,
    ): void {
        $pendingWork->register(PendingAgentMessages::class);
        $actors->registerStackSessions(Agent::class, ActorStackSessionProvider::class);
        $this->loadCoreRoutes('hooks/hooks.php');

        $this->commands([PruneHookHistoryCommand::class]);

        $this->callAfterResolving(
            Schedule::class,
            fn (Schedule $schedule) => $schedule->command('hooks:prune')->daily(),
        );

        $scope = new AgentSessionScope(
            static fn () => Container::getInstance()->make(ActorVisibility::class),
            static fn () => Container::getInstance()->make(AgentContext::class),
        );

        foreach ([
            AgentStackRow::class,
            HookCall::class,
            FailureReceipt::class,
            StopCheck::class,
        ] as $model) {
            $events->listen("eloquent.booted: {$model}", fn () => $model::addGlobalScope($scope));
        }
    }

    /**
     * The references of the base states config/journal.php lists, read once at boot, each state class taken as the
     * reference its #[StateType] names; a list that does not start with the ready state, or names a class that builds
     * no base state, fails the boot.
     *
     * @param  array<array-key, mixed>  $entries
     * @return list<class-string<BaseStateReference>>
     *
     * @throws InvalidBaseState
     */
    private static function baseStatesOf(array $entries): array
    {
        $references = array_values(array_map(self::baseStateOf(...), $entries));

        if (($references[0] ?? null) !== ReadyStateReference::class) {
            throw InvalidBaseState::notReadyFirst();
        }

        return $references;
    }

    /**
     * @return class-string<BaseStateReference>
     *
     * @throws InvalidBaseState
     */
    private static function baseStateOf(mixed $entry): string
    {
        if (! is_string($entry) || ! Reflector::exists($entry)) {
            throw InvalidBaseState::for(is_string($entry) ? $entry : get_debug_type($entry));
        }

        $named = Reflector::of($entry);
        $reference = $named->isSubclassOf(AgentState::class)
            ? Reflector::of($named->attribute(StateType::class)->reference)
            : $named;

        if (! $reference->is(BaseStateReference::class)) {
            throw InvalidBaseState::for($entry);
        }

        return $reference->name();
    }
}
