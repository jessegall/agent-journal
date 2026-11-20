<?php

declare(strict_types=1);

namespace App\Hooks\Providers;

use App\Actors\Contracts\ActorProviderRegistration;
use App\Actors\Contracts\ActorVisibility;
use App\Actors\Enums\ActorType;
use App\Agents\Contracts\ReadAdmission;
use App\Agents\Support\AgentContext;
use App\Agents\Support\PendingWorkSources;
use App\Bus\Contracts\CommandAdmission;
use App\Bus\Contracts\StackAdmission;
use App\Bus\Support\OperationDeadline;
use App\Contracts\StartTransaction;
use App\Hooks\Actions\AgentStacks;
use App\Hooks\Actions\CurrentStates;
use App\Hooks\Actions\UserStacks;
use App\Hooks\Console\PruneHookHistoryCommand;
use App\Hooks\Console\RelayHookCommand;
use App\Hooks\Contracts\ActorWorkStacks;
use App\Hooks\Contracts\AgentStack;
use App\Hooks\Contracts\CurrentState;
use App\Hooks\Contracts\IncomingWorkRegistration;
use App\Hooks\Contracts\ProgramAdapters;
use App\Hooks\Contracts\ProgramCompatibilities;
use App\Hooks\Contracts\StackInspectionQuery as StackInspectionQueryContract;
use App\Hooks\Contracts\StackPermission;
use App\Hooks\Contracts\StackTransaction as StackTransactionContract;
use App\Hooks\Contracts\StackTransactionRunner;
use App\Hooks\Contracts\StateFactory;
use App\Hooks\Contracts\StateTypes as StateTypesContract;
use App\Hooks\Contracts\StopConditionGate;
use App\Hooks\Contracts\StopEvidence;
use App\Hooks\Contracts\UserStack;
use App\Hooks\Contracts\WorkProgress;
use App\Hooks\Declarations\StateMethods;
use App\Hooks\Inspection\StackInspectionQuery;
use App\Hooks\Models\AgentStackRow;
use App\Hooks\Models\FailureReceipt;
use App\Hooks\Models\HookCall;
use App\Hooks\Models\StopAttempt;
use App\Hooks\Models\Support\AgentSessionScope;
use App\Hooks\Programs\SupportedProgramAdapters;
use App\Hooks\Readers\FrameProgress;
use App\Hooks\Resolvers\PinnedCompatibilities;
use App\Hooks\Resolvers\StopAttemptRecords;
use App\Hooks\Stack\ActiveStackPermission;
use App\Hooks\Stack\AdvisoryStackAdmission;
use App\Hooks\Stack\PolicyReadAdmission;
use App\Hooks\Stack\RegisteredStateFactory;
use App\Hooks\Stack\StackCommandAdmission;
use App\Hooks\Stack\StateTypes;
use App\Hooks\StateEvents\StateEventDispatcher;
use App\Hooks\StateEvents\StateEventScope;
use App\Hooks\Support\AgentWorkStack;
use App\Hooks\Support\ContextBudget;
use App\Hooks\Support\HookRetryWindow;
use App\Hooks\Support\IncomingWorkList;
use App\Hooks\Support\PendingAgentMessages;
use App\Hooks\Support\ProtectedAccounts;
use App\Hooks\Support\RetentionPeriods;
use App\Hooks\Support\StackTransaction;
use App\Hooks\Support\StopAttemptGate;
use App\Hooks\Support\WorkStackPushes;
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
        $this->app->bind(CurrentState::class, CurrentStates::class);
        $this->app->bind(StackTransactionRunner::class, StackTransaction::class);
        $this->app->bind(UserStack::class, UserStacks::class);
        $this->app->bind(StackInspectionQueryContract::class, StackInspectionQuery::class);
        $this->app->bind(StackTransactionContract::class, StackTransaction::class);
        $this->app->bind(StackPermission::class, ActiveStackPermission::class);
        $this->app->bind(CommandAdmission::class, StackCommandAdmission::class);
        $this->app->bind(ReadAdmission::class, PolicyReadAdmission::class);
        $this->app->bind(StateTypesContract::class, StateTypes::class);
        $this->app->singleton(IncomingWorkList::class);
        $this->app->singleton(IncomingWorkRegistration::class, IncomingWorkList::class);
        $this->app->singleton(StateTypes::class);
        $this->app->singleton(StateMethods::class);
        $this->app->bind(StartTransaction::class, StackTransaction::class);
        $this->app->bind(WorkProgress::class, FrameProgress::class);
        $this->app->singleton(ProtectedAccounts::class, fn ($app) => new ProtectedAccounts([
            $app->make(Repository::class)->string('accounts.root'),
        ]));
        $this->app->bind(ProgramCompatibilities::class, PinnedCompatibilities::class);
        $this->app->bind(ProgramAdapters::class, SupportedProgramAdapters::class);
        $this->app->scoped(StackAdmission::class, AdvisoryStackAdmission::class);
        $this->app->scoped(StopEvidence::class, StopAttemptRecords::class);
        $this->app->scoped(StopConditionGate::class, StopAttemptGate::class);
        $this->app->scoped(ActorWorkStacks::class, WorkStackPushes::class);
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
