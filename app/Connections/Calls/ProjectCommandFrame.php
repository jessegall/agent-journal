<?php

declare(strict_types=1);

namespace App\Connections\Calls;

use App\Connections\Values\CommandFrame;
use Spatie\LaravelData\Data;

/**
 * One frame of a journal verb's output on the wire: standard output or error as text, or as base64 when it is not
 * UTF-8, or the exit frame with the verb's code.
 */
final class ProjectCommandFrame extends Data
{
    public function __construct(
        public readonly int $sequence,
        public readonly string $stream,
        public readonly string $data,
        public readonly bool $base64,
        public readonly int $code,
    ) {}

    public static function fromFrame(CommandFrame $frame): self
    {
        return self::from($frame->toArray());
    }
}
