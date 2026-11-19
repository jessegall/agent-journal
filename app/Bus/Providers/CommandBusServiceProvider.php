<?php

declare(strict_types=1);

namespace App\Bus\Providers;

use App\Bus\Console\PruneReceiptsCommand;
use App\Bus\Contracts\CommandBus;
use App\Bus\Contracts\CommandTransaction;
use App\Bus\Support\CommandRegistry;
use App\Bus\Support\ConsoleOwner;
use App\Bus\Support\LaravelCommandBus;
use App\Bus\Support\RunningCommand;
use App\Bus\Support\RunningCommandTransaction;
use Illuminate\Console\Events\CommandFinished;
use Illuminate\Container\Container;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Database\Connection;
use Illuminate\Database\DatabaseManager;
use Illuminate\Database\Events\ConnectionEstablished;
use Illuminate\Support\ServiceProvider;

/**
 * Binds the command bus for each request, and refuses any transaction a handler or middleware opens itself while a
 * command runs: the bus opens the one transaction (doc 19, section 6.11).
 */
final class CommandBusServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->scoped(CommandTransaction::class, RunningCommandTransaction::class);
        $this->app->scoped(CommandBus::class, fn ($app): CommandBus => LaravelCommandBus::forRequest($app, $app->make(CommandRegistry::class)));
    }

    /**
     * Guards the connection already open and every connection opened later, such as one made again after a purge or
     * a reconnect.
     */
    public function boot(DatabaseManager $databases, Dispatcher $events): void
    {
        $this->commands([PruneReceiptsCommand::class]);
        self::refuseExplicitTransactionsOn($databases->connection());
        $events->listen(ConnectionEstablished::class, static fn (ConnectionEstablished $event) => self::refuseExplicitTransactionsOn($event->connection));
        $events->listen(CommandFinished::class, static fn () => self::finishConsoleOwner());
    }

    private static function refuseExplicitTransactionsOn(Connection $connection): void
    {
        // Resolved on each call, never captured: under Octane each request has its own RunningCommand.
        $connection->beforeStartingTransaction(static fn () => Container::getInstance()->make(RunningCommand::class)->refuseExplicitTransaction());
    }

    /**
     * A console command's owner leaves with it, so the next command starts with no actor.
     */
    private static function finishConsoleOwner(): void
    {
        Container::getInstance()->make(ConsoleOwner::class)->finish();
    }
}
