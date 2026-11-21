<?php

declare(strict_types=1);

namespace App\Profiles\Values;

/**
 * The latest token count a program reported for one of its threads: the thread's total so far, the parts of it the
 * program named, and the last turn's total, each part only when it was reported.
 */
final readonly class ThreadTokens
{
    public function __construct(
        public string $threadId,
        public int $total,
        public int|null $input,
        public int|null $cachedInput,
        public int|null $output,
        public int|null $reasoningOutput,
        public int|null $lastTurnTotal,
        public UsageSource $source,
    ) {}
}
