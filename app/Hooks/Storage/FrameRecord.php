<?php

declare(strict_types=1);

namespace App\Hooks\Storage;

use App\Hooks\Decisions\StateReference;
use Carbon\CarbonImmutable;

/**
 * A frame as it is stored: its id, the reference its state is rebuilt from, whether it is the bottom, the version it
 * was
 * stored in, and the server time it entered the stack.
 */
final readonly class FrameRecord
{
    public function __construct(
        public string $id,
        public StateReference $reference,
        public bool $isBottom,
        public int $schemaVersion,
        public CarbonImmutable $enteredAt,
    ) {}

    /**
     * The frame named in words with the version it was stored in, for a message.
     */
    public function description(): string
    {
        return "The frame {$this->id} of {$this->reference->typeKey} is stored in version {$this->schemaVersion}";
    }
}
