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
            // A request runs under its limit, as RequestTimeLimit::handle sets it when Octane takes the request.
            set_time_limit($limit);
            $this->journal->service(HostWake::class)->waitForHost('host-that-is-never-woken', 1);

            $this->assertSame((string) ($limit + 1), ini_get('max_execution_time'));
        } finally {
            set_time_limit((int) $before);
        }
    }

    public function test_a_wait_in_a_process_with_no_limit_sets_none(): void
    {
        $before = ini_get('max_execution_time');

        try {
            set_time_limit(0);
            $this->journal->service(HostWake::class)->waitForHost('host-that-is-never-woken', 1);

            $this->assertSame('0', ini_get('max_execution_time'));
        } finally {
            set_time_limit((int) $before);
        }
    }
}
