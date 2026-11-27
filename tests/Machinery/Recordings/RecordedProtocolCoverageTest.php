<?php

declare(strict_types=1);

namespace Tests\Machinery\Recordings;

use App\Hosts\Protocol\HostOrderType;
use App\Hosts\Protocol\HostRefusal;
use App\Hosts\Protocol\HostRoute;
use App\Recordings\RecordedProtocol;
use App\Recordings\Recordings;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * The recordings hold all of host protocol 1: every call, every order type and every refusal of protocol/host.json is
 * in one of them, and every recorded host exchange is one the generated readers accept.
 */
#[TestsMachinery(RecordedProtocol::class)]
#[TimeLimit(seconds: 15, reason: 'It reads every recording of the project.')]
final class RecordedProtocolCoverageTest extends TestCase
{
    public function test_every_call_order_and_refusal_is_recorded_and_every_recording_keeps_the_protocol(): void
    {
        $recordings = $this->app->make(Recordings::class);
        $protocol = $this->app->make(RecordedProtocol::class);
        $read = array_map(
            fn (string $scenario) => $recordings->scenario(...explode('/', $scenario, 2)),
            $recordings->scenarioNames(),
        );

        foreach ($read as $recording) {
            $protocol->assertKept($recording);
        }

        $coverage = $protocol->coverage($read);
        $this->assertSame(
            [[], [], []],
            [
                array_map(fn (HostRoute $route) => $route->value, $coverage->routes),
                array_map(fn (HostOrderType $type) => $type->value, $coverage->orderTypes),
                array_map(fn (HostRefusal $refusal) => $refusal->value, $coverage->refusals),
            ],
            'Record a scenario that holds each of these with scripts/record-scenarios.sh.',
        );
    }
}
