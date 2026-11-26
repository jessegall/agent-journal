<?php

declare(strict_types=1);

namespace Tests\Unit\Drivers;

use App\Support\Compatibility\DriverCompatibility;
use App\Support\DriverInstallList;
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
                'build' => DriverCompatibility::pinned('claude-code')->version,
                'check' => ['--version'],
                'host_name' => 'CLAUDE_CODE_EXECUTABLE',
            ],
            [
                'name' => 'codex',
                'executable' => 'codex',
                'build' => DriverCompatibility::pinned('codex')->version,
                'check' => ['--version'],
                'host_name' => 'CODEX_EXECUTABLE',
            ],
        ], $drivers);
    }
}
