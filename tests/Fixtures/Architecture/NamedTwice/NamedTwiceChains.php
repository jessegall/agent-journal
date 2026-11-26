<?php

declare(strict_types=1);

namespace Tests\Fixtures\Architecture\NamedTwice;

use Domain\Tasks\Tests\Fixtures\TaskFixtures;

/**
 * A chain that names a task twice, and three that pass: a step between, another name read back, and a reader on its
 * own line.
 */
final class NamedTwiceChains
{
    public function twice(TaskFixtures $tasks): object
    {
        return $tasks->task('Ship')->taskCalled('Ship');
    }

    public function withStepBetween(TaskFixtures $tasks): object
    {
        return $tasks->task('Ship')->startRun('Ship', 'Ada')->taskCalled('Ship');
    }

    public function anotherName(TaskFixtures $tasks): object
    {
        return $tasks->task('Ship')->taskCalled('Dock');
    }

    public function readerAlone(TaskFixtures $tasks): object
    {
        $tasks->task('Ship');

        return $tasks->taskCalled('Ship');
    }
}
