<?php

declare(strict_types=1);

namespace App\Domain\Tasks;

/**
 * How far a set of tasks has got: how many are done, started, blocked, and how many there are.
 */
final readonly class TaskProgress
{
    public function __construct(
        public int $done,
        public int $started,
        public int $blocked,
        public int $total,
    ) {}
}
