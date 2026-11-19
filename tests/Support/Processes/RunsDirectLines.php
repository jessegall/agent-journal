<?php

declare(strict_types=1);

namespace Tests\Support\Processes;

use App\Processes\Support\SpoolRecorder;
use Illuminate\Support\Facades\Storage;
use Tests\Fixtures\Agents\TestLaunch;

/**
 * A launched agent with the process runner switched on and a fake spool disk, for tests that send shell lines.
 */
trait RunsDirectLines
{
    private TestLaunch $launch;

    protected function setUpRunsDirectLines(): void
    {
        Storage::fake(SpoolRecorder::DISK);
        config(['processes.runner' => true]);
        $this->launch = TestLaunch::start();
    }
}
