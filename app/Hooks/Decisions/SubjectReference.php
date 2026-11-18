<?php

declare(strict_types=1);

namespace App\Hooks\Decisions;

/**
 * The subject a state is about, such as one run of a task.
 */
final readonly class SubjectReference
{
    public function __construct(
        public string $id,
        public int $runNumber,
    ) {}
}
