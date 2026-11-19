<?php

declare(strict_types=1);

namespace App\Hooks\Storage;

use App\Hooks\Decisions\StateReference;
use App\Hooks\Enums\NoSubject;
use Carbon\CarbonImmutable;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Casts\DateTimeInterfaceCast;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Transformers\DateTimeInterfaceTransformer;

/**
 * One frame as it is written in the frames column; a frame about no subject stores a null subject. Every frame stores
 * the time it entered the stack.
 */
final class StoredFrame extends Data
{
    /**
     * The entry time to the microsecond with its offset, so a restored frame keeps exactly the time it entered with.
     */
    public const string TIME_FORMAT = 'Y-m-d\\TH:i:s.uP';

    public function __construct(
        public readonly string $id,
        public readonly string $typeKey,
        public readonly int $schemaVersion,
        public readonly bool $isBottom,
        public readonly StoredSubject|null $subject,
        #[WithCast(DateTimeInterfaceCast::class, format: self::TIME_FORMAT)]
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: self::TIME_FORMAT)]
        public readonly CarbonImmutable $enteredAt,
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
            $record->enteredAt,
        );
    }

    public function toRecord(): FrameRecord
    {
        $subject = $this->subject?->toReference() ?? NoSubject::None;

        return new FrameRecord(
            $this->id,
            new StateReference($this->typeKey, $subject),
            $this->isBottom,
            $this->schemaVersion,
            $this->enteredAt,
        );
    }
}
