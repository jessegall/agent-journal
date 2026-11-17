<?php

declare(strict_types=1);

namespace App\Core\Hooks\Storage;

use App\Core\Hooks\Decisions\NoSubject;
use App\Core\Hooks\Decisions\StateReference;
use Spatie\LaravelData\Data;

/**
 * One frame as it is written in the frames column; a frame about no subject stores a null subject.
 */
final class StoredFrame extends Data
{
    public function __construct(
        public readonly string $id,
        public readonly string $typeKey,
        public readonly int $schemaVersion,
        public readonly bool $isBottom,
        public readonly StoredSubject|null $subject,
    ) {}

    public static function fromFrameRecord(FrameRecord $record): self
    {
        $subject = $record->reference->subject;

        return new self(
            $record->id,
            $record->reference->typeKey,
            $record->schemaVersion,
            $record->isBottom,
            $subject === NoSubject::None ? null : StoredSubject::fromSubjectReference($subject),
        );
    }

    public function toRecord(): FrameRecord
    {
        $subject = $this->subject?->toReference() ?? NoSubject::None;

        return new FrameRecord($this->id, new StateReference($this->typeKey, $subject), $this->isBottom, $this->schemaVersion);
    }
}
