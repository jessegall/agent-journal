<?php

declare(strict_types=1);

namespace App\Hooks\Providers;

use App\Actors\Contracts\ActorProviderRegistration;
use App\Actors\Contracts\ActorVisibility;
use App\Actors\Enums\ActorType;
use App\Agents\Contracts\ActorGuidance;
use App\Agents\Contracts\PinnedBuilds;
use App\Agents\Support\AgentContext;
use App\Agents\Support\PendingWorkSources;
use App\Bus\Contracts\FactStaging;
use App\Bus\Contracts\StackAdmission;
use App\Bus\Support\OperationDeadline;
use App\Contracts\StartTransaction;
use App\Hooks\Actions\AgentStacks;
use App\Hooks\Actions\CurrentStates;
use App\Hooks\Actions\HelperRecordFactSender;
use App\Hooks\Actions\UserStacks;
use App\Hooks\Actions\WorkStackPushes;
use App\Hooks\Admission\AdvisoryStackAdmission;
use App\Hooks\Compatibility\PinnedDriverBuilds;
use App\Hooks\Console\PruneHookHistoryCommand;
use App\Hooks\Console\RelayHookCommand;
use App\Hooks\Contracts\ActorWorkStacks;
use App\Hooks\Contracts\AgentStack;
use App\Hooks\Contracts\CurrentState;
use App\Hooks\Contracts\DriverCompatibilities;
use App\Hooks\Contracts\HelperRecordFacts;
use App\Hooks\Contracts\IncomingWorkRegistration;
use App\Hooks\Contracts\StackTransaction as StackTransactionContract;
use App\Hooks\Contracts\StackTransactionRunner;
use App\Hooks\Contracts\StopEvidence;
use App\Hooks\Contracts\StopPreparer;
use App\Hooks\Contracts\UserStack;
use App\Hooks\Contracts\WorkProgress;
use App\Hooks\Declarations\StateMethods;
use App\Hooks\Delivery\StateBridgeFactStaging;
use App\Hooks\Delivery\StateEventDispatcher;
use App\Hooks\Drivers\Adapters\SupportedDriverAdapters;
use App\Hooks\Drivers\Contracts\DriverAdapters;
use App\Hooks\Inspection\Contracts\StackInspectionQuery as StackInspectionQueryContract;
use App\Hooks\Inspection\Queries\StackInspectionQuery;
use App\Hooks\Models\AgentStackRow;
use App\Hooks\Models\FailureReceipt;
use App\Hooks\Models\HookCall;
use App\Hooks\Models\StopAttempt;
use App\Hooks\Models\Support\AgentSessionScope;
use App\Hooks\Readers\FrameProgress;
use App\Hooks\Resolvers\PinnedCompatibilities;
use App\Hooks\Resolvers\StopAttemptRecords;
use App\Hooks\Stack\ActiveStackPermission;
use App\Hooks\Stack\Contracts\StackPermission;
use App\Hooks\Stack\Contracts\StateFactory;
use App\Hooks\Stack\RegisteredStateFactory;
use App\Hooks\Stack\StateTypes;
use App\Hooks\Stack\TargetStates;
use App\Hooks\StateCatalog\Contracts\StateTypes as StateTypesContract;
use App\Hooks\StateEvents\StateEventScope;
use App\Hooks\StateLoading\Contracts\StackStates;
use App\Hooks\States\Contracts\StopConditionGate;
use App\Hooks\Support\AgentWorkStack;
use App\Hooks\Support\ContextBudget;
use App\Hooks\Support\HookGuidance;
use App\Hooks\Support\HookRetryWindow;
use App\Hooks\Support\IncomingWorkList;
use App\Hooks\Support\NoStopPreparation;
use App\Hooks\Support\PendingAgentMessages;
use App\Hooks\Support\ProtectedAccounts;
use App\Hooks\Support\RetentionPeriods;
use App\Hooks\Support\StackTransaction;
use App\Hooks\Support\StopAttemptGate;
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
        $this->app->bind(HelperRecordFacts::class, HelperRecordFactSender::class);
        $this->app->bind(CurrentState::class, CurrentStates::class);
        $this->app->bind(StackTransactionRunner::class, StackTransaction::class);
        $this->app->bind(UserStack::class, UserStacks::class);
        $this->app->bind(StackInspectionQueryContract::class, StackInspectionQuery::class);
        $this->app->bind(StackTransactionContract::class, StackTransaction::class);
        $this->app->bind(StackPermission::class, ActiveStackPermission::class);
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
        $this->app->scoped(StopEvidence::class, StopAttemptRecords::class);
        $this->app->scoped(StopConditionGate::class, StopAttemptGate::class);
        $this->app->bindIf(StopPreparer::class, NoStopPreparation::class);
        $this->app->bind(ActorGuidance::class, HookGuidance::class);
        $this->app->bind(PinnedBuilds::class, PinnedDriverBuilds::class);
        $this->app->scoped(ActorWorkStacks::class, WorkStackPushes::class);

        $this->app->singleton(RetentionPeriods::class, fn () => new RetentionPeriods(
            $this->app->make('config')->integer('hooks.hook_call_days'),
            $this->app->make('config')->integer('hooks.closed_stack_days'),
        ));

        $this->app->scoped(StateFactory::class, RegisteredStateFactory::class);
        $this->app->bind(StackStates::class, TargetStates::class);

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
        $actors->registerWorkStack(ActorType::Agent, AgentWorkStack::class);
        $this->loadRoutesFrom(dirname(__DIR__).'/Routes/hooks.php');
        $this->commands([PruneHookHistoryCommand::class, RelayHookCommand::class]);

        $this->callAfterResolving(
            Schedule::class,
            fn (Schedule $schedule) => $schedule->command('hooks:prune')->daily(),
        );

        $scope = new AgentSessionScope(
            static fn () => Container::getInstance()->make(ActorVisibility::class),
            static fn () => Container::getInstance()->make(AgentContext::class),
        );

        foreach ([AgentStackRow::class, HookCall::class, FailureReceipt::class, StopAttempt::class] as $model) {
            $events->listen("eloquent.booted: {$model}", fn () => $model::addGlobalScope($scope));
        }
    }
}
