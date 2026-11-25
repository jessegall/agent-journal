<?php

declare(strict_types=1);

namespace Tests\Unit\Support;

use App\Commands\Layouts\SaveLayout\SaveLayoutCommand;
use App\Contracts\Bus\CommandBus;
use App\Data\Layouts\LayoutShape;
use Illuminate\Database\DatabaseManager;
use Illuminate\Http\Client\StrayRequestException;
use Illuminate\Support\Facades\Http;
use Tests\Commands\Layouts\SaveLayoutTest;
use Tests\Support\Exceptions\BusUsedInUnitTest;
use Tests\Support\Exceptions\DatabaseUsedWithoutHookDatabase;
use Tests\Support\Exceptions\HttpUsedInUnitTest;
use Tests\TestCase;

/**
 * A unit test stays isolated: a query, a request into the application, a command on the bus and a call out to the
 * network are each refused before they happen.
 */
final class UnitTestGuardsTest extends TestCase
{
    public function test_a_query_is_refused(): void
    {
        $this->assertThrows(
            fn () => $this->app->make(DatabaseManager::class)->select('select 1'),
            DatabaseUsedWithoutHookDatabase::class,
        );
    }

    public function test_a_request_into_the_application_is_refused(): void
    {
        $this->assertThrows(fn () => $this->get('/'), HttpUsedInUnitTest::class);
    }

    public function test_a_command_on_the_bus_is_refused(): void
    {
        $command = new SaveLayoutCommand('Writing', LayoutShape::from(SaveLayoutTest::shape('chat')));

        $this->assertThrows(fn () => $this->app->make(CommandBus::class)->run($command), BusUsedInUnitTest::class);
    }

    public function test_a_call_out_to_the_network_is_refused(): void
    {
        $this->assertThrows(fn () => Http::get('https://example.test'), StrayRequestException::class);
    }
}
