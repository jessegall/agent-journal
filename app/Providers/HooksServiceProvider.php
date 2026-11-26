<?php

declare(strict_types=1);

namespace App\Providers;

use App\Agents\Drivers\Hooks\DriverAdapters;
use App\Concerns\LoadsCoreRoutes;
use App\Console\Commands\PruneHookHistoryCommand;
use App\Console\Commands\RelayHookCommand;
use App\Contracts\Actors\ActorGuidance as ActorGuidanceContract;
use App\Contracts\Actors\ActorProviderRegistration;
use App\Contracts\Actors\ActorVisibility;
use App\Contracts\Admission\StackAdmission as StackAdmissionContract;
use App\Contracts\Drivers\DriverAdapters as DriverAdaptersContract;
use App\Contracts\Drivers\DriverCompatibilities as DriverCompatibilitiesContract;
use App\Contracts\Drivers\PinnedBuilds as PinnedBuildsContract;
use App\Contracts\Events\FactStaging;
use App\Contracts\Events\HelperRecordFacts as HelperRecordFactsContract;
use App\Contracts\Processes\StopEvidence as StopEvidenceContract;
use App\Contracts\Processes\StopPreparer;
use App\Contracts\Sessions\StartTransaction;
use App\Contracts\Work\AgentFocuses as AgentFocusesContract;
use App\Contracts\Work\AgentStacks as AgentStacksContract;
use App\Contracts\Work\CurrentState as CurrentStateContract;
use App\Contracts\Work\IncomingWorkRegistration as IncomingWorkRegistrationContract;
use App\Contracts\Work\StackTransaction as StackTransactionContract;
use App\Contracts\Work\StackTransactionRunner;
use App\Contracts\Work\UserStack as UserStackContract;
use App\Contracts\Work\WorkProgress as WorkProgressContract;
use App\Declarations\StateMethods;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentStackRow;
use App\Models\Drivers\FailureReceipt;
use App\Models\Drivers\HookCall;
use App\Models\Sessions\StopCheck;
use App\Models\Support\AgentSessionScope;
use App\Resolvers\DriverCompatibilities;
use App\Resolvers\StopEvidence;
use App\Support\ActorGuidance;
use App\Support\ActorStackSessionProvider;
use App\Support\Admission\StackAdmission;
use App\Support\AgentContext;
use App\Support\AgentFocuses;
use App\Support\AgentStacks;
use App\Support\Compatibility\PinnedBuilds;
use App\Support\ContextBudget;
use App\Support\CurrentState;
use App\Support\Delivery\StateBridgeFactStaging;
use App\Support\Delivery\StateEventDispatcher;
use App\Support\HelperRecordFacts;
use App\Support\HookRetryWindow;
use App\Support\IncomingWorkRegistration;
use App\Support\Inspection\Contracts\StackInspectionQuery as StackInspectionQueryContract;
use App\Support\Inspection\Queries\StackInspectionQuery;
use App\Support\NoStopPreparation;
use App\Support\OperationDeadline;
use App\Support\PendingAgentMessages;
use App\Support\PendingWorkSources;
use App\Support\ProtectedAccounts;
use App\Support\Readers\WorkProgress;
use App\Support\RetentionPeriods;
use App\Support\Stack\Contracts\StateFactory as StateFactoryContract;
use App\Support\Stack\StateFactory;
use App\Support\Stack\StateTypes;
use App\Support\StackTransaction;
use App\Support\StateCatalog\Contracts\StateTypes as StateTypesContract;
use App\Support\StateEvents\StateEventScope;
use App\Support\States\Contracts\StopConditionGate as StopConditionGateContract;
use App\Support\StopConditionGate;
use App\Support\UserStack;
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
        $this->app->scoped(StopConditionGateContract::class, StopConditionGate::class);
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

        $this->commands([PruneHookHistoryCommand::class, RelayHookCommand::class]);

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
}
