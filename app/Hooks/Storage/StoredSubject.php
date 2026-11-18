<?php

declare(strict_types=1);

namespace App\Hooks\Storage;

use App\Hooks\Decisions\SubjectReference;
use Spatie\LaravelData\Data;

/**
 * The subject of a stored frame, as it is written in the frames column.
 */
final class StoredSubject extends Data
{
    public function __construct(
        public readonly string $id,
        public readonly int $runNumber,
    ) {}

    public static function fromSubjectReference(SubjectReference $subject): self
    {
        return new self($subject->id, $subject->runNumber);
    }

    public function toReference(): SubjectReference
    {
        return new SubjectReference($this->id, $this->runNumber);
    }
}
