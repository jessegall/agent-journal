<?php

declare(strict_types=1);

namespace App\Agents\Values;

/**
 * A browser writer's private submission as the journal knows it: its single-use id and its sequence. The value
 * itself is never part of it; it waits in the cache under the id until the host claims it.
 */
final readonly class PrivateSubmission
{
    public function __construct(
        public string $submissionId,
        public int $sequence,
    ) {}
}
