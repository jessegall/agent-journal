<?php

declare(strict_types=1);

namespace App\Support;

/**
 * What a read interest's view holds when it asks for the next frame: the interest it reads through and the host
 * process, stream and sequence of the frame it shows; a first ask holds no frame.
 */
final readonly class HeldFrame
{
    public function __construct(
        public string $readInterestId,
        public string $epoch,
        public string $stream,
        public int $sequence,
    ) {}
}
