<?php

declare(strict_types=1);

namespace App\Providers;

use App\Access\Contracts\OperationResolver as OperationResolverContract;
use App\Api\SignedApiRefusal;
use App\Bus\AcceptedReceipt;
use App\Bus\CommandEnd;
use App\Bus\CommandOriginChecks;
use App\Bus\CommandStops;
use App\Bus\CommandTransaction;
use App\Bus\ConsoleOwner;
use App\Bus\Contracts\CallerReceipts as CallerReceiptsContract;
use App\Bus\Contracts\CommandBus;
use App\Bus\Contracts\CommandEnd as CommandEndContract;
use App\Bus\Contracts\CommandFacts;
use App\Bus\Contracts\CommandStops as CommandStopsContract;
use App\Bus\Contracts\CommandTransaction as CommandTransactionContract;
use App\Bus\Contracts\CommittedListenerFailures;
use App\Bus\Contracts\Events\FactStaging;
use App\Bus\Contracts\GuardedCommandBus;
use App\Bus\Contracts\JournalCommands as JournalCommandsContract;
use App\Bus\Contracts\OwnerCommands as OwnerCommandsContract;
use App\Bus\Contracts\Refusals\RefusalMapper as RefusalMapperContract;
use App\Bus\Contracts\RequestKey as RequestKeyContract;
use App\Bus\Contracts\Work\UnitOfWork;
use App\Bus\DispatcherFactStaging;
use App\Bus\EventUnitLifecycle;
use App\Bus\JournalCommands;
use App\Bus\LaravelCommandBus;
use App\Bus\MiddlewareRunner;
use App\Bus\OuterTransactionOwner;
use App\Bus\OutsideCommandAllowance;
use App\Bus\OwnerCommands;
use App\Bus\Publication;
use App\Bus\RefusalMapper;
use App\Bus\ReportedListenerFailures;
use App\Bus\RequestKey;
use App\Bus\RowCapture;
use App\Bus\RunningCommand;
use App\Console\Commands\PruneReceiptsCommand;
use App\Reads\Contracts\RowCapture as RowCaptureContract;
use App\Resolvers\OperationResolver;
use App\Support\ActiveEventUnits;
use App\Support\CallerReceipts;
use App\Support\CommandRegistry;
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
        $this->app->bind(CommandEndContract::class, CommandEnd::class);
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
        $this->app->scoped(CommittedListenerFailures::class, ReportedListenerFailures::class);
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
                fn (Throwable $failure, Request $request) => SignedApiRefusal::render($failure, $request),
            );
        }
    }
}
