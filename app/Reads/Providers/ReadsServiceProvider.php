<?php

declare(strict_types=1);

namespace App\Reads\Providers;

use App\Reads\Contracts\ReadMeter;
use App\Reads\Support\ReadLog;
use App\Reads\Support\ScopedReadMeter;
use Illuminate\Console\Events\CommandFinished;
use Illuminate\Console\Events\CommandStarting;
use Illuminate\Container\Container;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Database\Connection;
use Illuminate\Database\DatabaseManager;
use Illuminate\Database\Events\ConnectionEstablished;
use Illuminate\Database\Events\QueryExecuted;
use Illuminate\Queue\Events\JobFailed;
use Illuminate\Queue\Events\JobProcessed;
use Illuminate\Queue\Events\JobProcessing;
use Illuminate\Support\ServiceProvider;

/**
 * Counts every query on every connection, the open one and each opened later, into the read meter of the request,
 * job or command running it. The meter is resolved at each call, never captured.
 */
final class ReadsServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->scoped(ScopedReadMeter::class);
        $this->app->alias(ScopedReadMeter::class, ReadMeter::class);
    }

    public function boot(DatabaseManager $databases, Dispatcher $events): void
    {
        foreach ($databases->getConnections() as $connection) {
            self::countQueriesOn($connection);
        }

        $events->listen(ConnectionEstablished::class, static fn (ConnectionEstablished $event) => self::countQueriesOn($event->connection));
        $events->listen(QueryExecuted::class, static fn () => ScopedReadMeter::ofCurrentScope()->recordCompletedQuery());
        $events->listen(CommandStarting::class, static fn () => ScopedReadMeter::ofCurrentScope()->begin());
        $events->listen(CommandFinished::class, static fn (CommandFinished $finished) => self::endEntry("artisan {$finished->command}"));
        $events->listen(JobProcessing::class, static fn () => ScopedReadMeter::ofCurrentScope()->begin());
        $events->listen(JobProcessed::class, static fn (JobProcessed $processed) => self::endEntry("job {$processed->job->resolveName()}"));
        $events->listen(JobFailed::class, static fn (JobFailed $failed) => self::endEntry("job {$failed->job->resolveName()}"));
        $events->listen('eloquent.retrieved: *', static fn (string $event, array $models) => ScopedReadMeter::ofCurrentScope()->recordModel($models[0]::class));
    }

    private static function endEntry(string $label): void
    {
        Container::getInstance()->make(ReadLog::class)->record($label, ScopedReadMeter::ofCurrentScope()->end());
    }

    private static function countQueriesOn(Connection $connection): void
    {
        $connection->beforeExecuting(static fn (string $query, array $bindings, Connection $on) => ScopedReadMeter::ofCurrentScope()->recordQuery((string) $on->getName(), ! self::onlyReads($query)));
    }

    /**
     * A statement that only reads: a select, or a with that ends in one.
     */
    private static function onlyReads(string $query): bool
    {
        return preg_match('/^\\s*(select|with|show|explain)\\b/i', $query) === 1 && preg_match('/\\b(insert|update|delete)\\b/i', $query) !== 1;
    }
}
