<?php

declare(strict_types=1);

namespace Tests\Machinery\Hosts;

use App\Hosts\HostWake;
use Illuminate\Support\Str;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\TestCase;

/**
 * A host's claim blocks until an instruction wakes it, and takes the wakes waiting together.
 */
#[TestsMachinery(HostWake::class)]
final class HostWakeTest extends TestCase
{
    public function test_a_wake_ends_the_hosts_wait_once_and_without_one_the_wait_runs_out(): void
    {
        $wake = $this->journal->service(HostWake::class);
        $host = (string) Str::ulid();

        $wake->wakeHost($host);
        $wake->wakeHost($host);

        $this->assertTrue($wake->waitForHost($host, 1));
        $this->assertFalse($wake->waitForHost($host, 1));
    }
}
