<?php

declare(strict_types=1);

namespace App\Core\Hooks\Storage;

use App\Core\Hooks\Decisions\StateReference;

/**
 * A frame as it is stored: its id, the reference its state is rebuilt from, whether it is the bottom, and the version it was stored in.
 */
final readonly class FrameRecord
{
    public function __construct(
        public string $id,
        public StateReference $reference,
        public bool $isBottom,
        public int $schemaVersion,
    ) {}
}
