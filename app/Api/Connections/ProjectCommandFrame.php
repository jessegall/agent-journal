<?php

declare(strict_types=1);

namespace App\Api\Connections;

use Spatie\LaravelData\Data;

/**
 * One frame of a journal verb's output, in the order it was written, as a run keeps it and as it goes on the wire:
 * standard output or error as text, or as base64 when it is not UTF-8, or the exit frame with the verb's code and
 * no text.
 */
final class ProjectCommandFrame extends Data
{
    public function __construct(
        public readonly int $sequence,
        public readonly string $stream,
        public readonly string|null $text,
        public readonly bool $isBase64,
        public readonly int $exitCode,
    ) {}

    public static function output(int $sequence, string $stream, string $bytes): self
    {
        $isText = mb_check_encoding($bytes, 'UTF-8');
        $text = $isText ? $bytes : base64_encode($bytes);

        return new self($sequence, $stream, $text, ! $isText, 0);
    }

    public static function exit(int $sequence, int $code): self
    {
        return new self($sequence, 'exit', null, false, $code);
    }
}
