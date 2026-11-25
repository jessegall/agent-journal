<?php

declare(strict_types=1);

namespace Tests\Fixtures\Architecture\NamedTwice;

/**
 * A chain that names a task twice, and three that pass: a step between, another name read back, and a reader on its
 * own line.
 */
final class NamedTwiceChains
{
    public function twice(object $tasks): object
    {
        return $tasks->task('Ship')->taskCalled('Ship');
    }

    public function withStepBetween(object $tasks): object
    {
        return $tasks->task('Ship')->startRun('Ship', 'Ada')->taskCalled('Ship');
    }

    public function anotherName(object $tasks): object
    {
        return $tasks->task('Ship')->taskCalled('Dock');
    }

    public function readerAlone(object $tasks): object
    {
        $tasks->task('Ship');

        return $tasks->taskCalled('Ship');
    }
}
