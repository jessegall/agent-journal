<?php

declare(strict_types=1);

namespace Tests\Support\Processes;

use Tests\Fixtures\Agents\TestStart;

/**
 * A started agent with the process runner switched on and a fake spool disk, for tests that send shell lines.
 */
trait RunsDirectLines
{
    private TestStart $start;

    protected function setUpRunsDirectLines(): void
    {
        ProcessOutputDisk::fake();
        config(['processes.runner' => true]);
        $this->start = $this->journal->signedStart('Line runner');
    }
}
