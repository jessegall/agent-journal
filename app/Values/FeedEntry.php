<?php

declare(strict_types=1);

namespace App\Values;

use App\Hosts\HostChunks;
use App\Hosts\Protocol\Payloads\HostChunkPayload;
use App\Hosts\Protocol\Payloads\HostFramePayload;

/**
 * One entry a worker read: a frame or chunk of its process, an answer to one of its instructions, or a wake of its
 * runtime, with the cursor after it.
 */
final readonly class FeedEntry
{
    private function __construct(
        public string $stream,
        public string $cursor,
        public HostFramePayload|null $frame,
        public HostChunkPayload|null $chunk,
        public string|null $answeredInstructionId,
        public bool $hasEnded = false,
    ) {}

    /**
     * @param  array<string, string>  $fields
     */
    public static function of(string $stream, string $cursor, array $fields): self
    {
        return new self(
            $stream,
            $cursor,
            isset($fields['frame']) ? HostFramePayload::from(
                json_decode($fields['frame'], true, flags: JSON_THROW_ON_ERROR),
            ) : null,
            isset($fields['chunk']) ? HostChunkPayload::from(
                json_decode($fields['chunk'], true, flags: JSON_THROW_ON_ERROR),
            ) : null,
            $fields['answered'] ?? null,
            isset($fields['ended']),
        );
    }

    /**
     * What the entry's chunk printed, decoded; nothing for an entry without a chunk.
     */
    public function printed(): string
    {
        if ($this->chunk === null) {
            return '';
        }

        return HostChunks::printed($this->chunk);
    }

    public function isWake(): bool
    {
        return $this->frame === null && $this->chunk === null && $this->answeredInstructionId === null && ! $this->hasEnded;
    }
}
