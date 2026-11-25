<?php

declare(strict_types=1);

namespace App\Providers;

use App\Console\Commands\PruneReceiptsCommand;
use App\Contracts\Authorization\OperationResolver as OperationResolverContract;
use App\Contracts\Bus\CallerReceipts as CallerReceiptsContract;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Bus\CommandFacts;
use App\Contracts\Bus\CommandStops as CommandStopsContract;
use App\Contracts\Bus\CommandTransaction as CommandTransactionContract;
use App\Contracts\Bus\GuardedCommandBus;
use App\Contracts\Bus\JournalCommands as JournalCommandsContract;
use App\Contracts\Bus\OwnerCommands as OwnerCommandsContract;
use App\Contracts\Bus\RequestKey as RequestKeyContract;
use App\Contracts\Events\FactStaging;
use App\Contracts\Reads\RowCapture as RowCaptureContract;
use App\Contracts\Refusals\RefusalMapper as RefusalMapperContract;
use App\Contracts\Work\UnitOfWork;
use App\Resolvers\OperationResolver;
use App\Support\AcceptedReceipt;
use App\Support\ActiveEventUnits;
use App\Support\CallerReceipts;
use App\Support\CommandOriginChecks;
use App\Support\CommandRegistry;
use App\Support\CommandStops;
use App\Support\CommandTransaction;
use App\Support\ConsoleOwner;
use App\Support\DispatcherFactStaging;
use App\Support\EventUnitLifecycle;
use App\Support\JournalCommands;
use App\Support\LaravelCommandBus;
use App\Support\MiddlewareRunner;
use App\Support\OuterTransactionOwner;
use App\Support\OutsideCommandAllowance;
use App\Support\OwnerCommands;
use App\Support\Publication;
use App\Support\RefusalMapper;
use App\Support\RequestKey;
use App\Support\RowCapture;
use App\Support\RunningCommand;
use App\Support\SignedCallRefusal;
use Illuminate\Console\Events\CommandFinished;
use Illuminate\Container\Container;
use Illuminate\Contracts\Debug\ExceptionHandler;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Database\Connection;
use Illuminate\Database\DatabaseManager;
use Illuminate\Database\Events\ConnectionEstablished;
use Illuminate\Foundation\Exceptions\Handler;
use Illuminate\Http\Request;
use Illuminate\Support\ServiceProvider;
use Throwable;

/**
 * Binds the command bus for each request, and refuses any transaction a handler or middleware opens itself while a
 * command runs: the bus opens the one transaction.
 */
final class CommandBusServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->alias(RequestKey::class, RequestKeyContract::class);
        $this->app->bind(CallerReceiptsContract::class, CallerReceipts::class);
        $this->app->bind(OperationResolverContract::class, OperationResolver::class);
        $this->app->bind(RefusalMapperContract::class, RefusalMapper::class);
        $this->app->bind(OwnerCommandsContract::class, OwnerCommands::class);
        $this->app->scoped(AcceptedReceipt::class);
        $this->app->bindIf(FactStaging::class, DispatcherFactStaging::class);
        $this->app->singleton(OutsideCommandAllowance::class);
        $this->app->singleton(OuterTransactionOwner::class);
        $this->app->scoped(ActiveEventUnits::class);
        $this->app->bind(RowCaptureContract::class, RowCapture::class);
        $this->app->bind(CommandFacts::class, EventUnitLifecycle::class);
        $this->app->bind(JournalCommandsContract::class, JournalCommands::class);
        $this->app->bind(UnitOfWork::class, EventUnitLifecycle::class);
        $this->app->scoped(Publication::class);
        $this->app->scoped(CommandTransactionContract::class, CommandTransaction::class);
        $this->app->alias(CommandStops::class, CommandStopsContract::class);

        $this->app->scoped(
            LaravelCommandBus::class,
            fn ($app) => LaravelCommandBus::forRequest(
                $app,
                $app->make(CommandRegistry::class),
                $app->make(CommandOriginChecks::class),
                $app->make(MiddlewareRunner::class),
            ),
        );

        $this->app->alias(LaravelCommandBus::class, CommandBus::class);
        $this->app->alias(LaravelCommandBus::class, GuardedCommandBus::class);
    }

    /**
     * Guards the connection already open and every connection opened later, such as one made again after a purge or
     * a reconnect.
     */
    public function boot(DatabaseManager $databases, Dispatcher $events): void
    {
        $this->commands([PruneReceiptsCommand::class]);
        $this->callAfterResolving(ExceptionHandler::class, self::renderSignedCallRefusals(...));
        self::refuseExplicitTransactionsOn($databases->connection());

        $events->listen(
            ConnectionEstablished::class,
            static fn (ConnectionEstablished $event) => self::refuseExplicitTransactionsOn($event->connection),
        );

        $events->listen(CommandFinished::class, static fn () => self::finishConsoleOwner());
    }

    private static function refuseExplicitTransactionsOn(Connection $connection): void
    {
        // Resolved on each call, never captured: under Octane each request has its own RunningCommand.
        $connection->beforeStartingTransaction(
            static fn () => Container::getInstance()->make(RunningCommand::class)->assertNoExplicitTransaction(),
        );
    }

    /**
     * A console command's owner leaves with it, so the next command starts with no actor.
     */
    private static function finishConsoleOwner(): void
    {
        Container::getInstance()->make(ConsoleOwner::class)->finish();
    }

    /**
     * A failure on a signed agent route renders as a coded refusal, the way MCP shows it.
     */
    private static function renderSignedCallRefusals(ExceptionHandler $handler): void
    {
        if ($handler instanceof Handler) {
            $handler->renderable(
                fn (Throwable $failure, Request $request) => SignedCallRefusal::render($failure, $request),
            );
        }
    }
}
