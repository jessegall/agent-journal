<?php

declare(strict_types=1);

namespace Tests\Unit\Hosts;

use App\Hosts\HostWake;
use Tests\TestCase;

/**
 * A host's claim that waits for a wake gets the wait on top of the request's whole time limit, so a long poll that
 * waits close to the limit is not stopped while it answers (the 30-second fatal the local host's claims met).
 */
final class HostWakeTimeLimitTest extends TestCase
{
    public function test_a_wait_for_the_host_lends_the_request_its_seconds_on_top_of_the_time_limit(): void
    {
        $limit = (int) $this->app->make('config')->get('octane.max_execution_time');
        $before = ini_get('max_execution_time');

        try {
            $this->journal->service(HostWake::class)->waitForHost('host-that-is-never-woken', 1);

            $this->assertSame((string) ($limit + 1), ini_get('max_execution_time'));
        } finally {
            set_time_limit((int) $before);
        }
    }
}
