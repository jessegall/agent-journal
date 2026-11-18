<?php

declare(strict_types=1);

namespace App\Processes\Values;

/**
 * A reader replayed over a part's stored output: where it stopped reading each stream, and what it made of it.
 */
final readonly class ReplayedOutput
{
    public function __construct(public ReaderCheckpoint $consumed, public ReaderAssessment $assessment) {}
}
