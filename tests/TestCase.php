<?php

declare(strict_types=1);

namespace Tests;

use App\Numbers\Support\NumberingOutsideCommands;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Database\DatabaseManager;
use Illuminate\Database\Events\ConnectionEstablished;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Illuminate\Support\Facades\Http;
use Laravel\Fortify\Features;
use Tests\Support\DatabaseUsedWithoutHookDatabase;
use Tests\Support\RefreshHookDatabase;

abstract class TestCase extends BaseTestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        Http::preventStrayRequests();
        $this->app->make(NumberingOutsideCommands::class)->allow();
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
