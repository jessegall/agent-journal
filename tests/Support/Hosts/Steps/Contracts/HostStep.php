<?php

declare(strict_types=1);

namespace Tests\Support\Hosts\Steps\Contracts;

use Tests\Support\Seeding\TestJournal;

/**
 * One named action of a test host's story: a mock that waits for it holds its answer until it ran.
 */
interface HostStep
{
    /**
     * Runs the step on the test's journal, when the story reaches it.
     */
    public function __invoke(TestJournal $journal): void;
}
