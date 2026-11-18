<?php

declare(strict_types=1);

namespace App\Core\Bus\Providers;

use App\Core\Bus\Contracts\CommandBus;
use App\Core\Bus\Support\CommandRegistry;
use App\Core\Bus\Support\LaravelCommandBus;
use App\Core\Bus\Support\RunningCommand;
use Illuminate\Container\Container;
use Illuminate\Database\DatabaseManager;
use Illuminate\Support\ServiceProvider;

/**
 * Binds the command bus for each request, and refuses any transaction a handler or middleware opens itself while a
 * command runs: the bus opens the one transaction (doc 19, section 6.11).
 */
final class CommandBusServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->scoped(CommandBus::class, fn ($app): CommandBus => LaravelCommandBus::forRequest($app, $app->make(CommandRegistry::class)));
    }

    public function boot(DatabaseManager $databases): void
    {
        // Resolved on each call, never captured: under Octane each request has its own RunningCommand.
        $databases->connection()->beforeStartingTransaction(static fn () => Container::getInstance()->make(RunningCommand::class)->refuseExplicitTransaction());
    }
}
