<?php

declare(strict_types=1);

namespace App\Data;

use App\Values\ProofSample;
use Spatie\LaravelData\Data;

/**
 * One sample a proof manifest lists: its output file, the exit status it ended with and the branch it proves.
 */
final class ProofSampleData extends Data
{
    public function __construct(
        public readonly string $file,
        public readonly int $exit,
        public readonly string $proves,
    ) {}

    public function sample(): ProofSample
    {
        return new ProofSample($this->file, $this->exit, $this->proves);
    }
}
