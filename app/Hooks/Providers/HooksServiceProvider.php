<?php

declare(strict_types=1);

namespace App\Hooks\Providers;

use App\Actors\Contracts\ActorProviderRegistration;
use App\Actors\Contracts\ActorVisibility;
use App\Actors\Enums\ActorType;
use App\Agents\Support\AgentContext;
use App\Bus\Contracts\StackAdmission;
use App\Bus\Support\OperationDeadline;
use App\Contracts\LaunchTransaction;
use App\Hooks\Actions\CheckProtectedResources;
use App\Hooks\Console\PruneHookHistoryCommand;
use App\Hooks\Console\RelayHookCommand;
use App\Hooks\Contracts\ActorWorkStacks;
use App\Hooks\Contracts\IncomingWorkRegistration;
use App\Hooks\Contracts\InspectsStacks;
use App\Hooks\Contracts\ProtectedResources;
use App\Hooks\Contracts\ResolvesStateTypes;
use App\Hooks\Contracts\RunsStackTransactions;
use App\Hooks\Contracts\StateFactory;
use App\Hooks\Inspection\StackInspectionQuery;
use App\Hooks\Models\AgentStackRow;
use App\Hooks\Models\FailureReceipt;
use App\Hooks\Models\HookCall;
use App\Hooks\Models\Support\AgentSessionScope;
use App\Hooks\Stack\AdvisoryStackAdmission;
use App\Hooks\Stack\RegisteredStateFactory;
use App\Hooks\Stack\StateTypes;
use App\Hooks\Support\AgentWorkStack;
use App\Hooks\Support\ContextBudget;
use App\Hooks\Support\HookRetryWindow;
use App\Hooks\Support\IncomingWorkList;
use App\Hooks\Support\ProtectedAccounts;
use App\Hooks\Support\RetentionPeriods;
use App\Hooks\Support\StackTransaction;
use App\Hooks\Support\WorkStackPushes;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Container\Container;
use Illuminate\Contracts\Config\Repository;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Support\ServiceProvider;

/**
 * Binds the state types and the retry window once per worker, and the state factory once per request,
 * and limits both Hooks models to the current agent and session each time a model boots.
 */
final class HooksServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(InspectsStacks::class, StackInspectionQuery::class);
        $this->app->bind(RunsStackTransactions::class, StackTransaction::class);
        $this->app->bind(ResolvesStateTypes::class, StateTypes::class);
        $this->app->singleton(IncomingWorkList::class);
        $this->app->singleton(IncomingWorkRegistration::class, IncomingWorkList::class);
        $this->app->singleton(StateTypes::class);
        $this->app->bind(LaunchTransaction::class, StackTransaction::class);
        $this->app->singleton(ProtectedAccounts::class, fn ($app) => new ProtectedAccounts([
            $app->make(Repository::class)->string('accounts.root'),
        ]));
        $this->app->bind(ProtectedResources::class, CheckProtectedResources::class);
        $this->app->scoped(StackAdmission::class, AdvisoryStackAdmission::class);
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

    public function boot(Dispatcher $events, ActorProviderRegistration $actors): void
    {
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

        foreach ([AgentStackRow::class, HookCall::class, FailureReceipt::class] as $model) {
            $events->listen("eloquent.booted: {$model}", fn () => $model::addGlobalScope($scope));
        }
    }
}
