<?php

declare(strict_types=1);

namespace App\Providers;

use App\Concerns\Linkable;
use App\Exceptions\ReadLimitInvalid;
use App\Exceptions\ReadPolicyMissing;
use App\Reads\Contracts\ReadLog as ReadLogContract;
use App\Reads\Contracts\ReadMeter as ReadMeterContract;
use App\Reads\ReadLog;
use App\Reads\ReadMeter;
use App\Reads\SelfMeasuredCommands;
use App\Records\Contracts\ReadableModel;
use App\Support\Reflector;
use Illuminate\Console\Events\CommandFinished;
use Illuminate\Console\Events\CommandStarting;
use Illuminate\Container\Container;
use Illuminate\Contracts\Config\Repository;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Database\Connection;
use Illuminate\Database\DatabaseManager;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Database\Events\ConnectionEstablished;
use Illuminate\Database\Events\QueryExecuted;
use Illuminate\Queue\Events\JobFailed;
use Illuminate\Queue\Events\JobProcessed;
use Illuminate\Queue\Events\JobProcessing;
use Illuminate\Support\ServiceProvider;
use WeakMap;

/**
 * Counts every query on every connection, the open one and each opened later, into the read meter of the request,
 * job or command running it. The meter is resolved at each call, never captured. A command that measures its own units
 * of work, such as engine:tick, keeps no measurement of its own open.
 */
final class ReadsServiceProvider extends ServiceProvider
{
    /**
     * The connections already counted: Laravel announces a reconnected connection as established again.
     *
     * @var WeakMap<Connection, true>|null
     */
    private static WeakMap|null $countedConnections = null;

    public function register(): void
    {
        $this->app->bind(ReadLogContract::class, ReadLog::class);
        $this->app->scoped(ReadMeter::class);
        $this->app->alias(ReadMeter::class, ReadMeterContract::class);
        $this->app->singleton(SelfMeasuredCommands::class);
    }

    public function boot(
        DatabaseManager $databases,
        Dispatcher $events,
        Repository $config,
        SelfMeasuredCommands $selfMeasured,
    ): void {
        $defaultLimit = $config->integer('reads.default_limit');
        $pageMax = $config->integer('reads.page_max');

        if ($defaultLimit < 1 || $defaultLimit > $pageMax) {
            throw ReadLimitInvalid::configured($defaultLimit, $pageMax);
        }

        $this->app->booted(static function (): void {
            foreach (Relation::morphMap() as $linkType => $model) {
                $isLinkable = in_array(Linkable::class, class_uses_recursive($model), true);

                if ($isLinkable && ! Reflector::factory()->isSubclassOf($model, ReadableModel::class)) {
                    throw ReadPolicyMissing::for($model, $linkType);
                }
            }
        });

        foreach ($databases->getConnections() as $connection) {
            self::countQueriesOn($connection);
        }

        $events->listen(
            ConnectionEstablished::class,
            static fn (ConnectionEstablished $event) => self::countQueriesOn($event->connection),
        );

        $events->listen(
            QueryExecuted::class,
            static fn () => ReadMeter::ofCurrentScope()->recordCompletedQuery(),
        );

        $events->listen(
            CommandStarting::class,
            static fn (
                CommandStarting $starting,
            ) => $selfMeasured->has($starting->command) ? null : ReadMeter::ofCurrentScope()->begin(),
        );

        $events->listen(
            CommandFinished::class,
            static fn (CommandFinished $finished) => $selfMeasured->has($finished->command) ? null : self::endEntry(
                "artisan {$finished->command}",
            ),
        );

        $events->listen(JobProcessing::class, static fn () => ReadMeter::ofCurrentScope()->begin());

        $events->listen(
            JobProcessed::class,
            static fn (JobProcessed $processed) => self::endEntry("job {$processed->job->resolveName()}"),
        );

        $events->listen(
            JobFailed::class,
            static fn (JobFailed $failed) => self::endEntry("job {$failed->job->resolveName()}"),
        );

        $events->listen(
            'eloquent.retrieved: *',
            static fn (
                string $event,
                array $models,
            ) => ReadMeter::ofCurrentScope()->recordModel($models[0]::class),
        );
    }

    private static function endEntry(string $label): void
    {
        Container::getInstance()->make(ReadLog::class)->record($label, ReadMeter::ofCurrentScope()->end());
    }

    private static function countQueriesOn(Connection $connection): void
    {
        self::$countedConnections ??= new WeakMap();

        if (isset(self::$countedConnections[$connection])) {
            return;
        }

        self::$countedConnections[$connection] = true;

        $connection->beforeExecuting(
            static fn (
                string $query,
                array $bindings,
                Connection $on,
            ) => ReadMeter::ofCurrentScope()->recordQuery(
                (string) $on->getName(),
                ! self::doesOnlyRead($query),
                $query,
            ),
        );
    }

    /**
     * A statement that only reads: a select, or a with that ends in one.
     */
    private static function doesOnlyRead(string $query): bool
    {
        return preg_match(
            '/^\\s*(select|with|show|explain)\\b/i',
            $query,
        ) === 1 && preg_match('/\\b(insert|update|delete)\\b/i', $query) !== 1;
    }
}
