<?php

declare(strict_types=1);

namespace Tests\Machinery\Bus;

use App\Contracts\Bus\CommandBus;
use App\Exceptions\CommandRefused;
use Illuminate\Support\Facades\Log;
use Tests\Fixtures\Modules\Notes\Commands\RefuseNote\RefuseNoteCommand;
use Tests\Fixtures\Modules\Notes\Commands\WriteNote\WriteNoteCommand;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\Support\TestIds;

/**
 * The bus under Octane: each request on one booted app gets its own bus with its own actor, also
 * after a request that ended in an exception.
 */
#[TestsMachinery(CommandBus::class)]
final class OctaneCommandBusTest extends CommandBusTestCase
{
    public function test_each_request_gets_its_own_bus_with_its_own_actor(): void
    {
        $this->installCommandModules();
        $this->journal->actAsUserId(TestIds::of(1));
        $first = $this->app->make(CommandBus::class);

        $this->assertThrows(fn () => $first->run(new RefuseNoteCommand('first request fails')), CommandRefused::class);

        $this->app->forgetScopedInstances();
        $this->journal->actAsAgentIds(TestIds::of(9), TestIds::of(90));
        $second = $this->app->make(CommandBus::class);
        $log = Log::spy();
        $second->run(new WriteNoteCommand('second request'));

        $this->assertNotSame($first, $second);
        $log->shouldHaveReceived('info')->withArgs(
            fn (string $line, array $context) => $context['actor'] === 'agent:'.TestIds::of(9),
        );
    }
}
