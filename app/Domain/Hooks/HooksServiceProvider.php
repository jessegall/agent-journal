<?php

declare(strict_types=1);

namespace App\Domain\Hooks;

use App\Domain\Agents\AgentContext;
use App\Domain\Agents\LaunchTransaction;
use App\Domain\Hooks\Console\PruneHookHistoryCommand;
use App\Domain\Hooks\Console\RelayHookCommand;
use App\Domain\Hooks\Inputs\MissingCommandFacts;
use App\Domain\Hooks\Inputs\ShellCommandParser;
use App\Domain\Hooks\Models\AgentSessionScope;
use App\Domain\Hooks\Models\AgentStackRow;
use App\Domain\Hooks\Models\HookCall;
use App\Domain\Hooks\Stack\RegisteredStateFactory;
use App\Domain\Hooks\Stack\StateFactory;
use App\Domain\Hooks\Stack\StateTypes;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Container\Container;
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
        $this->app->singleton(StateTypes::class);
        $this->app->bind(LaunchTransaction::class, StackTransaction::class);
        $this->app->singleton(RetentionPeriods::class, fn () => new RetentionPeriods(
            $this->app->make('config')->integer('hooks.hook_call_days'),
            $this->app->make('config')->integer('hooks.closed_stack_days'),
        ));
        $this->app->bindIf(ShellCommandParser::class, MissingCommandFacts::class);
        $this->app->scoped(StateFactory::class, RegisteredStateFactory::class);
        $this->app->singleton(OperationDeadline::class, fn () => new OperationDeadline($this->app->make('config')->integer('hooks.operation_deadline_milliseconds')));
        $this->app->singleton(HookRetryWindow::class, fn () => new HookRetryWindow($this->app->make('config')->integer('hooks.retry_seconds')));
    }

    public function boot(Dispatcher $events): void
    {
        $this->loadRoutesFrom(__DIR__.'/Routes/hooks.php');
        $this->commands([PruneHookHistoryCommand::class, RelayHookCommand::class]);
        $this->callAfterResolving(Schedule::class, fn (Schedule $schedule) => $schedule->command('hooks:prune')->daily());

        $scope = new AgentSessionScope(static fn () => Container::getInstance()->make(AgentContext::class));

        foreach ([AgentStackRow::class, HookCall::class] as $model) {
            $events->listen("eloquent.booted: {$model}", fn () => $model::addGlobalScope($scope));
        }
    }
}
