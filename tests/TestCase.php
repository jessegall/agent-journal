<?php

declare(strict_types=1);

namespace Tests;

use App\Bus\Support\OuterTransactionOwner;
use App\Bus\Support\WritesOutsideCommands;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Database\DatabaseManager;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Database\Events\ConnectionEstablished;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Illuminate\Foundation\Testing\WithCachedConfig;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Http;
use Laravel\Fortify\Features;
use PDO;
use Tests\Support\Exceptions\DatabaseUsedWithoutHookDatabase;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TimeLimits\Exceptions\TestTimedOut;
use Tests\Support\TimeLimits\TestAlarm;
use Throwable;

/**
 * Every feature test's base: the configuration files are read once per process and kept, as Laravel's own
 * WithCachedConfig does, so a test's boot loads none of them again.
 */
abstract class TestCase extends BaseTestCase
{
    use WithCachedConfig;

    /**
     * @var array<string, class-string> the application's morph map, before a test adds fixture types to it
     */
    private array $applicationMorphMap = [];

    protected function setUp(): void
    {
        parent::setUp();

        $this->applicationMorphMap = Relation::morphMap();
        Http::preventStrayRequests();
        $this->withoutVite();
        $this->app->make(WritesOutsideCommands::class)->allow();
        $this->app->make(OuterTransactionOwner::class)->register();
        $this->beforeApplicationDestroyed(fn () => $this->closeConnections());
    }

    /**
     * Rolls back what a test left open on any connection and closes each, after Laravel's own rollback: a failed
     * test's exception keeps its connection alive through the trace, and an open transaction there would hold the
     * locks the next test's table cleanup waits for.
     */
    /**
     * Fakes the named business events and keeps Eloquent's own events real, so the event unit still captures each
     * save; a bare Event::fake() would fake those too.
     */
    protected function fakeBusinessEvents(string ...$events): void
    {
        Event::fake($events);
    }

    protected function closeConnections(): void
    {
        foreach ($this->app->make(DatabaseManager::class)->getConnections() as $connection) {
            $pdo = $connection->getRawPdo();

            if ($pdo instanceof PDO && $pdo->inTransaction()) {
                $pdo->rollBack();
            }

            $connection->disconnect();
        }
    }

    /**
     * The alarm stops before the cleanup, so a slow test still empties the rows it committed; the morph map is static
     * and outlives the application, so a test's fixture types leave with it.
     */
    protected function tearDown(): void
    {
        if (TestAlarm::isAvailable()) {
            TestAlarm::disarm();
        }

        Relation::morphMap($this->applicationMorphMap, false);

        parent::tearDown();
    }

    /**
     * A test that ran out of time fails as the timeout, even when its own code caught the timeout and failed on
     * something else, such as an assertThrows that expected another exception.
     */
    protected function onNotSuccessfulTest(Throwable $failure): never
    {
        if (TestAlarm::hasRung() && ! $failure instanceof TestTimedOut) {
            TestAlarm::throwTimeout();
        }

        parent::onNotSuccessfulTest($failure);
    }

    /**
     * Creates the application and, before any trait sets up, stops every query of a class without RefreshHookDatabase.
     */
    protected function refreshApplication(): void
    {
        parent::refreshApplication();

        if (! in_array(RefreshHookDatabase::class, class_uses_recursive(static::class), true)) {
            $this->refuseQueries($this->app->make(DatabaseManager::class));
        }
    }

    protected function skipUnlessFortifyHas(string $feature, string|null $message = null): void
    {
        if (! Features::enabled($feature)) {
            $this->markTestSkipped($message ?? "Fortify feature [{$feature}] is not enabled.");
        }
    }

    /**
     * Refuses each statement before it runs, on the connections made so far and on every connection made later.
     */
    private function refuseQueries(DatabaseManager $database): void
    {
        $refuse = fn () => throw DatabaseUsedWithoutHookDatabase::by(static::class);

        foreach ($database->getConnections() as $connection) {
            $connection->beforeExecuting($refuse);
        }

        $this->app->make(Dispatcher::class)->listen(
            ConnectionEstablished::class,
            fn (ConnectionEstablished $event) => $event->connection->beforeExecuting($refuse),
        );
    }
}
