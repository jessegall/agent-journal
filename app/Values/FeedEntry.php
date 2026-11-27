<?php

declare(strict_types=1);

namespace App\Values;

use App\Hosts\Data\HostChunkData;
use App\Hosts\Data\HostFrameData;

/**
 * One entry a worker read: a frame or chunk of its process, an answer to one of its orders, or a wake of its
 * runtime, with the cursor after it.
 */
final readonly class FeedEntry
{
    private function __construct(
        public string $stream,
        public string $cursor,
        public HostFrameData|null $frame,
        public HostChunkData|null $chunk,
        public string|null $answeredOrderId,
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
            isset($fields['frame']) ? HostFrameData::from(
                json_decode($fields['frame'], true, flags: JSON_THROW_ON_ERROR),
            ) : null,
            isset($fields['chunk']) ? HostChunkData::from(
                json_decode($fields['chunk'], true, flags: JSON_THROW_ON_ERROR),
            ) : null,
            $fields['answered'] ?? null,
            isset($fields['ended']),
        );
    }

    public function isWake(): bool
    {
        return $this->frame === null && $this->chunk === null && $this->answeredOrderId === null && ! $this->hasEnded;
    }
}
