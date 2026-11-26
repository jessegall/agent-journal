<?php

declare(strict_types=1);

namespace App\Processes\Values;

use App\Values\PartEnd;

/**
 * One stored run a shipped reader was proven on: its output file, the exit status it ended with and the branch it
 * proves (passed, findings, or refused for an execution error that must never read as either).
 */
final readonly class ProofSample
{
    public function __construct(public string $file, public int $exit, public string $proves) {}

    /**
     * Whether the sample proves a clean or a findings run, the branches a reader is proven on.
     */
    public function provesABranch(): bool
    {
        return $this->proves !== 'refused';
    }

    public function end(): PartEnd
    {
        return PartEnd::exited($this->exit);
    }
}
