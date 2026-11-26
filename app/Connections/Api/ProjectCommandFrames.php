<?php

declare(strict_types=1);

namespace App\Connections\Api;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

/**
 * What a journal verb wrote, frame by frame in order, ending with its exit frame.
 */
final class ProjectCommandFrames extends Data
{
    /**
     * @param  list<ProjectCommandFrame>  $frames
     */
    public function __construct(
        #[DataCollectionOf(ProjectCommandFrame::class)]
        public readonly array $frames,
    ) {}

    /**
     * The frames a run wrote, in order, as they go on the wire.
     *
     * @param  list<ProjectCommandFrame>  $frames
     */
    public static function ofFrames(array $frames): self
    {
        return self::from(['frames' => $frames]);
    }
}
