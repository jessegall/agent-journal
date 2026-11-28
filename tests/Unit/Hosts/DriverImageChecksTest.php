<?php

declare(strict_types=1);

namespace Tests\Unit\Hosts;

use App\Hosts\DriverImageChecks;
use Illuminate\Contracts\Config\Repository;
use Tests\TestCase;

/**
 * A driver image's start checks run the programs a session runs: on a development machine the checkout's builds,
 * mounted over the image's own as every session container mounts them, so a check never judges a program no session
 * runs.
 */
final class DriverImageChecksTest extends TestCase
{
    public function test_on_a_development_machine_each_check_mounts_the_checkouts_program_builds(): void
    {
        $this->app->make(Repository::class)->set('journal.agents.development_binaries', '/srv/journal/development');
        $this->app->forgetInstance(DriverImageChecks::class);

        $checks = $this->app->make(DriverImageChecks::class)->of('sha256:'.str_repeat('1', 64), 'claude-code');
        $targets = array_map(fn ($mount) => $mount->target, $checks[0]->manifest->mounts);

        $this->assertContains('/opt/journal/bin/journal-exec', $targets);
        $this->assertContains('/opt/journal/shell/bash', $targets);
    }

    public function test_elsewhere_a_check_runs_the_images_own_programs(): void
    {
        $this->app->make(Repository::class)->set('journal.agents.development_binaries', '');
        $this->app->forgetInstance(DriverImageChecks::class);

        $checks = $this->app->make(DriverImageChecks::class)->of('sha256:'.str_repeat('1', 64), 'claude-code');

        $this->assertSame([], $checks[0]->manifest->mounts);
    }
}
