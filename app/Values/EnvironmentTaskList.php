<?php

declare(strict_types=1);

namespace App\Values;

/**
 * How many tasks of one environment the acting user holds, and the first of them by number.
 */
final readonly class EnvironmentTaskList
{
    /**
     * @param  list<EnvironmentTask>  $tasks
     */
    public function __construct(public int $count, public array $tasks) {}
}
