<?php

declare(strict_types=1);

namespace App\Providers;

use App\Concerns\LoadsCoreRoutes;
use App\Console\Commands\PruneHookHistoryCommand;
use App\Console\Commands\RelayHookCommand;
use App\Contracts\Actors\ActorGuidance;
use App\Contracts\Actors\ActorProviderRegistration;
use App\Contracts\Actors\ActorVisibility;
use App\Contracts\Admission\StackAdmission;
use App\Contracts\Drivers\DriverCompatibilities;
use App\Contracts\Drivers\PinnedBuilds;
use App\Contracts\Events\FactStaging;
use App\Contracts\Events\HelperRecordFacts;
use App\Contracts\Processes\StopEvidence;
use App\Contracts\Processes\StopPreparer;
use App\Contracts\Sessions\StartTransaction;
use App\Contracts\Work\AgentFocuses;
use App\Contracts\Work\AgentStack;
use App\Contracts\Work\CurrentState;
use App\Contracts\Work\IncomingWorkRegistration;
use App\Contracts\Work\StackTransaction as StackTransactionContract;
use App\Contracts\Work\StackTransactionRunner;
use App\Contracts\Work\UserStack;
use App\Contracts\Work\WorkProgress;
use App\Declarations\StateMethods;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentStackRow;
use App\Models\Drivers\FailureReceipt;
use App\Models\Drivers\HookCall;
use App\Models\Sessions\StopCheck;
use App\Models\Support\AgentSessionScope;
use App\Resolvers\PinnedCompatibilities;
use App\Resolvers\StopCheckRecords;
use App\Support\Admission\AdvisoryStackAdmission;
use App\Support\AgentContext;
use App\Support\AgentStacks;
use App\Support\AgentStackSessions;
use App\Support\Compatibility\PinnedDriverBuilds;
use App\Support\ContextBudget;
use App\Support\CurrentStates;
use App\Support\Delivery\StateBridgeFactStaging;
use App\Support\Delivery\StateEventDispatcher;
use App\Support\Drivers\Adapters\SupportedDriverAdapters;
use App\Support\Drivers\Contracts\DriverAdapters;
use App\Support\HelperRecordFactSender;
use App\Support\HookGuidance;
use App\Support\HookRetryWindow;
use App\Support\IncomingWorkList;
use App\Support\Inspection\Contracts\StackInspectionQuery as StackInspectionQueryContract;
use App\Support\Inspection\Queries\StackInspectionQuery;
use App\Support\NoStopPreparation;
use App\Support\OperationDeadline;
use App\Support\PendingAgentMessages;
use App\Support\PendingWorkSources;
use App\Support\ProtectedAccounts;
use App\Support\Readers\FrameProgress;
use App\Support\RetentionPeriods;
use App\Support\Stack\Contracts\StateFactory;
use App\Support\Stack\RegisteredStateFactory;
use App\Support\Stack\StateTypes;
use App\Support\StackTransaction;
use App\Support\StateCatalog\Contracts\StateTypes as StateTypesContract;
use App\Support\StateEvents\StateEventScope;
use App\Support\States\Contracts\StopConditionGate;
use App\Support\StopCheckGate;
use App\Support\StoredAgentFocuses;
use App\Support\UserStacks;
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

        $this->app->bind(AgentStack::class, AgentStacks::class);
        $this->app->bind(AgentFocuses::class, StoredAgentFocuses::class);
        $this->app->bind(HelperRecordFacts::class, HelperRecordFactSender::class);
        $this->app->bind(CurrentState::class, CurrentStates::class);
        $this->app->bind(StackTransactionRunner::class, StackTransaction::class);
        $this->app->bind(UserStack::class, UserStacks::class);
        $this->app->bind(StackInspectionQueryContract::class, StackInspectionQuery::class);
        $this->app->bind(StackTransactionContract::class, StackTransaction::class);
        $this->app->bind(StateTypesContract::class, StateTypes::class);
        $this->app->singleton(IncomingWorkList::class);
        $this->app->singleton(IncomingWorkRegistration::class, IncomingWorkList::class);

        $this->app->singleton(StateTypes::class);
        $this->app->singleton(StateMethods::class);
        $this->app->bind(StartTransaction::class, StackTransaction::class);
        $this->app->bind(FactStaging::class, StateBridgeFactStaging::class);
        $this->app->bind(WorkProgress::class, FrameProgress::class);

        $this->app->singleton(ProtectedAccounts::class, fn ($app) => new ProtectedAccounts([
            $app->make(Repository::class)->string('accounts.root'),
        ]));

        $this->app->bind(DriverCompatibilities::class, PinnedCompatibilities::class);
        $this->app->bind(DriverAdapters::class, SupportedDriverAdapters::class);
        $this->app->scoped(StackAdmission::class, AdvisoryStackAdmission::class);
        $this->app->scoped(StopEvidence::class, StopCheckRecords::class);
        $this->app->scoped(StopConditionGate::class, StopCheckGate::class);
        $this->app->bindIf(StopPreparer::class, NoStopPreparation::class);
        $this->app->bind(ActorGuidance::class, HookGuidance::class);
        $this->app->bind(PinnedBuilds::class, PinnedDriverBuilds::class);

        $this->app->singleton(RetentionPeriods::class, fn () => new RetentionPeriods(
            $this->app->make('config')->integer('hooks.hook_call_days'),
            $this->app->make('config')->integer('hooks.closed_stack_days'),
        ));

        $this->app->scoped(StateFactory::class, RegisteredStateFactory::class);

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
        $actors->registerStackSessions(Agent::class, AgentStackSessions::class);
        $this->loadCoreRoutes('hooks/hooks.php');
        $this->commands([
            PruneHookHistoryCommand::class,
            RelayHookCommand::class,
        ]);

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
