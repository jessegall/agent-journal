<?php

declare(strict_types=1);

namespace App\Core\Hooks;

use App\Core\Agents\Support\AgentContext;
use App\Core\Contracts\LaunchTransaction;
use App\Core\Hooks\Console\PruneHookHistoryCommand;
use App\Core\Hooks\Console\RelayHookCommand;
use App\Core\Hooks\Contracts\ShellCommandParser;
use App\Core\Hooks\Contracts\StateFactory;
use App\Core\Hooks\Inputs\MissingShellParser;
use App\Core\Hooks\Models\AgentStackRow;
use App\Core\Hooks\Models\HookCall;
use App\Core\Hooks\Models\Support\AgentSessionScope;
use App\Core\Hooks\Stack\RegisteredStateFactory;
use App\Core\Hooks\Stack\StateTypes;
use App\Core\Hooks\Support\HookRetryWindow;
use App\Core\Hooks\Support\OperationDeadline;
use App\Core\Hooks\Support\RetentionPeriods;
use App\Core\Hooks\Support\StackTransaction;
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
        $this->app->bindIf(ShellCommandParser::class, MissingShellParser::class);
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
