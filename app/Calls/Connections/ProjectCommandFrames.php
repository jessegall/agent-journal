<?php

declare(strict_types=1);

namespace App\Calls\Connections;

use App\Values\CommandFrame;
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
     * @param  list<CommandFrame>  $frames
     */
    public static function ofFrames(array $frames): self
    {
        return self::from(['frames' => array_map(fn (CommandFrame $frame) => $frame->toArray(), $frames)]);
    }
}
