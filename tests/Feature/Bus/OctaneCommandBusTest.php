<?php

declare(strict_types=1);

namespace Tests\Feature\Bus;

use App\Core\Bus\Contracts\CommandBus;
use App\Core\Bus\Exceptions\CommandRefused;
use Illuminate\Support\Facades\Log;
use Tests\Fixtures\Modules\Notes\Commands\RefuseNote;
use Tests\Fixtures\Modules\Notes\Commands\WriteNote;

/**
 * The bus under Octane (doc 19, story 67): each request on one booted app gets its own bus with its own actor, also
 * after a request that ended in an exception.
 */
final class OctaneCommandBusTest extends CommandBusTestCase
{
    public function test_each_request_gets_its_own_bus_with_its_own_actor(): void
    {
        $this->installCommandModules();
        $this->startUserRequestAs(1);
        $first = $this->app->make(CommandBus::class);

        try {
            $first->run(new RefuseNote('first request fails'));
        } catch (CommandRefused) {
        }

        $this->app->forgetScopedInstances();
        $this->startRequestAs(9, 90);
        $second = $this->app->make(CommandBus::class);
        $log = Log::spy();
        $second->run(new WriteNote('second request'));

        $this->assertNotSame($first, $second);
        $log->shouldHaveReceived('info')->withArgs(fn (string $line, array $context) => $context['actor'] === 'agent:9');
    }
}
