<?php

declare(strict_types=1);

namespace Tests\Feature\Sharing;

use App\Sharing\Models\ShareInstallation;
use Illuminate\Contracts\Console\Kernel;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * The share service's health check: unhealthy while nothing answers on the listener port or no supervisor holds the
 * gateways; healthy when the listener answers and a run lease is fresh.
 */
final class SharingHealthTest extends TestCase
{
    use RefreshHookDatabase;

    private const string RUN = '01JD8X0G9M3QZ6V4K2RUN0000A';

    public function test_the_service_is_healthy_only_with_an_answering_listener_and_a_fresh_run_lease(): void
    {
        $server = stream_socket_server('tcp://127.0.0.1:0');
        $this->assertNotFalse($server);
        $port = (int) substr((string) stream_socket_get_name($server, false), strlen('127.0.0.1:'));
        config(['sharing.listener.host' => '127.0.0.1', 'sharing.listener.port' => $port]);

        $this->assertSame(1, $this->health(), 'No supervisor holds the gateways.');

        ShareInstallation::create()->holdFor(self::RUN);
        $this->assertSame(0, $this->health());

        fclose($server);
        $this->assertSame(1, $this->health(), 'The listener no longer answers.');

        $this->travel(91)->seconds();
        $this->assertSame(1, $this->health());
    }

    private function health(): int
    {
        return $this->app->make(Kernel::class)->call('sharing:health');
    }
}
