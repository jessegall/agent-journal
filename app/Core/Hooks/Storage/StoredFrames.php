<?php

declare(strict_types=1);

namespace App\Core\Hooks\Storage;

use App\Core\Hooks\Exceptions\StoredValueInvalid;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

/**
 * The frames column: a version and the frames, bottom first.
 */
final class StoredFrames extends Data
{
    public const int CURRENT_VERSION = 1;

    /**
     * @param  list<StoredFrame>  $frames
     */
    public function __construct(
        public readonly int $version,
        #[DataCollectionOf(StoredFrame::class)]
        public readonly array $frames,
    ) {}

    public static function fromFrameRecords(FrameRecords $records): self
    {
        return new self(self::CURRENT_VERSION, array_map(StoredFrame::fromFrameRecord(...), $records->all()));
    }

    public function toRecords(): FrameRecords
    {
        if ($this->version !== self::CURRENT_VERSION) {
            throw StoredValueInvalid::forVersion('frames', $this->version);
        }

        return new FrameRecords(array_map(fn (StoredFrame $frame) => $frame->toRecord(), $this->frames));
    }
}
