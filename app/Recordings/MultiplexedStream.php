<?php

declare(strict_types=1);

namespace App\Recordings;

use Closure;

/**
 * A body in Docker's multiplexed stream: frames of an eight-byte head (the stream, three zero bytes, the length in
 * big-endian) and their bytes, with what follows the last whole frame kept as it is, as a cut body ends mid-frame.
 */
final readonly class MultiplexedStream
{
    /**
     * The content type Docker answers a multiplexed stream with.
     */
    public const string CONTENT_TYPE = 'application/vnd.docker.multiplexed-stream';

    /**
     * The bytes of a frame's head.
     */
    private const int HEAD_BYTES = 8;

    /**
     * @param  list<array{string, string}>  $frames  each frame's stream byte and bytes
     */
    private function __construct(private array $frames, private string $rest) {}

    public static function of(string $body): self
    {
        $frames = [];
        $at = 0;

        while ($at + self::HEAD_BYTES <= strlen($body)) {
            $length = (ord($body[$at + 4]) << 24) | (ord($body[$at + 5]) << 16)
                | (ord($body[$at + 6]) << 8) | ord($body[$at + 7]);

            if ($at + self::HEAD_BYTES + $length > strlen($body)) {
                break;
            }

            $frames[] = [$body[$at], substr($body, $at + self::HEAD_BYTES, $length)];
            $at += self::HEAD_BYTES + $length;
        }

        return new self($frames, substr($body, $at));
    }

    /**
     * The stream with each frame's bytes, and what follows the last frame, changed by the change; each head names
     * its frame's new length.
     *
     * @param  Closure(string): string  $change
     */
    public function changed(Closure $change): self
    {
        return new self(
            array_map(fn (array $frame) => [$frame[0], $change($frame[1])], $this->frames),
            $change($this->rest),
        );
    }

    public function bytes(): string
    {
        $bytes = '';

        foreach ($this->frames as [$stream, $frame]) {
            $bytes .= $stream."\0\0\0".pack('N', strlen($frame)).$frame;
        }

        return $bytes.$this->rest;
    }
}
