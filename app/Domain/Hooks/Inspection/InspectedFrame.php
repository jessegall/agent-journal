<?php

declare(strict_types=1);

namespace App\Domain\Hooks\Inspection;

use App\Domain\Hooks\Decisions\SubjectReference;
use App\Domain\Hooks\Storage\FrameRecord;
use Spatie\LaravelData\Data;

/**
 * One frame as the inspector shows it; a frame about no subject shows a null subject.
 */
final class InspectedFrame extends Data
{
    public function __construct(
        public readonly string $id,
        public readonly string $typeKey,
        public readonly ?InspectedSubject $subject,
        public readonly bool $isBottom,
    ) {}

    public static function fromFrameRecord(FrameRecord $record): self
    {
        $subject = $record->reference->subject;

        return new self(
            $record->id,
            $record->reference->typeKey,
            $subject instanceof SubjectReference ? new InspectedSubject($subject->id, $subject->runNumber) : null,
            $record->isBottom,
        );
    }
}
