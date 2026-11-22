<?php

declare(strict_types=1);

namespace Tests\Feature\Bus;

use App\Exceptions\OverlappingTransactionOwner;
use App\Support\ActiveEventUnits;
use Illuminate\Database\DatabaseManager;
use Tests\TestCase;

/**
 * Only one connection's owner holds an event unit at a time on the shared transaction manager, and an execution's
 * units go with its scope, so an engine pass or the next request starts with none.
 */
final class OverlappingOwnersTest extends TestCase
{
    public function test_a_second_owner_on_another_connection_is_refused_while_a_unit_is_open(): void
    {
        $database = $this->app->make(DatabaseManager::class);
        $this->app->make('config')->set('database.connections.second', [...$database->connection()->getConfig(), 'name' => 'second']);
        $units = $this->app->make(ActiveEventUnits::class);
        $units->open($database->connection());

        $this->expectExceptionObject(OverlappingTransactionOwner::on('second', $database->getDefaultConnection()));

        try {
            $units->open($database->connection('second'));
        } finally {
            $database->purge('second');
        }
    }

    public function test_the_next_scope_starts_with_no_unit_and_a_closed_owner_lets_another_open(): void
    {
        $database = $this->app->make(DatabaseManager::class);
        $units = $this->app->make(ActiveEventUnits::class);
        $units->open($database->connection());
        $this->app->forgetScopedInstances();

        $next = $this->app->make(ActiveEventUnits::class);

        $this->assertNotSame($units, $next);
        $this->assertTrue($next->activeFor($database->connection())->isEmpty());
    }
}
