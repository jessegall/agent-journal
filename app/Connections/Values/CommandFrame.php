<?php

declare(strict_types=1);

namespace App\Connections\Values;

/**
 * One frame of a journal verb's output, in the order it was written: standard output or error, as text or as base64
 * when it is not UTF-8, or the exit frame with the verb's code.
 */
final readonly class CommandFrame
{
    private function __construct(
        public int $sequence,
        public string $stream,
        public string $text,
        public bool $isBase64,
        public int $exitCode,
    ) {}

    public static function output(int $sequence, string $stream, string $bytes): self
    {
        $isText = mb_check_encoding($bytes, 'UTF-8');

        return new self($sequence, $stream, $isText ? $bytes : base64_encode($bytes), ! $isText, 0);
    }

    /**
     * A frame as a run recorded it.
     *
     * @param  array{sequence: int, stream: string, text: string, isBase64: bool, exitCode: int}  $frame
     */
    public static function fromRecord(array $frame): self
    {
        return new self($frame['sequence'], $frame['stream'], $frame['text'], $frame['isBase64'], $frame['exitCode']);
    }

    public static function exit(int $sequence, int $code): self
    {
        return new self($sequence, 'exit', '', false, $code);
    }

    /**
     * @return array{sequence: int, stream: string, text: string, isBase64: bool, exitCode: int}
     */
    public function toArray(): array
    {
        return [
            'sequence' => $this->sequence,
            'stream' => $this->stream,
            'text' => $this->text,
            'isBase64' => $this->isBase64,
            'exitCode' => $this->exitCode,
        ];
    }
}
