<?php

declare(strict_types=1);

namespace App\Data\Hosts;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

/**
 * What a host sends of a process's output: changed screens of a terminal and bytes of a pipe.
 */
final class HostOutputData extends Data
{
    /**
     * The most a host sends in one post.
     */
    public const int MAXIMUM_BYTES = 256 * 1024;

    /**
     * @param  list<HostFrameData>  $frames
     * @param  list<HostChunkData>  $chunks
     */
    public function __construct(
        #[DataCollectionOf(HostFrameData::class)]
        public readonly array $frames = [],
        #[DataCollectionOf(HostChunkData::class)]
        public readonly array $chunks = [],
    ) {}
}
