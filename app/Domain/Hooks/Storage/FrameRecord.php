<?php

declare(strict_types=1);

namespace App\Domain\Hooks\Storage;

use App\Domain\Hooks\Decisions\StateReference;

/**
 * A frame as it is stored: its id, the reference its state is rebuilt from, and whether it is the bottom.
 */
final readonly class FrameRecord
{
    public function __construct(
        public string $id,
        public StateReference $reference,
        public bool $isBottom,
    ) {}
}
