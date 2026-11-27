<?php

declare(strict_types=1);

namespace Tests\Unit\Drivers;

use App\Agents\Drivers\Contracts\PinnedBuilds;
use App\Hosts\DriverInstallList;
use Tests\TestCase;

/**
 * The drivers a connected machine's installer seals are the drivers the profiles start, at the builds the journal
 * pins, each with a host name of its own.
 */
final class DriverInstallListTest extends TestCase
{
    public function test_each_driver_is_the_one_its_profile_starts_at_the_pinned_build(): void
    {
        $drivers = $this->app->make(DriverInstallList::class)->drivers()->toArray()['drivers'];

        $this->assertSame([
            [
                'name' => 'claude-code',
                'executable' => 'claude',
                'build' => $this->app->make(PinnedBuilds::class)->versionOf('claude-code'),
                'check' => ['--version'],
                'host_name' => 'CLAUDE_CODE_EXECUTABLE',
            ],
            [
                'name' => 'codex',
                'executable' => 'codex',
                'build' => $this->app->make(PinnedBuilds::class)->versionOf('codex'),
                'check' => ['--version'],
                'host_name' => 'CODEX_EXECUTABLE',
            ],
        ], $drivers);
    }
}
