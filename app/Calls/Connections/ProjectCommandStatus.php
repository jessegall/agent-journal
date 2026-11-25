<?php

declare(strict_types=1);

namespace App\Calls\Connections;

use App\Enums\Connections\CommandRunState;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

/**
 * Where a journal verb's run stands, as its request id reads it, and the frames it recorded once it settled with an
 * outcome; a run the caller cannot see, or one no record survives of, reads unknown.
 */
final class ProjectCommandStatus extends Data
{
    /**
     * @param  list<ProjectCommandFrame>  $frames
     */
    public function __construct(
        public readonly CommandRunState $state,
        #[DataCollectionOf(ProjectCommandFrame::class)]
        public readonly array $frames,
    ) {}

    /**
     * @param  list<ProjectCommandFrame>  $frames
     */
    public static function of(CommandRunState $state, array $frames): self
    {
        return self::from([
            'state' => $state,
            'frames' => $frames,
        ]);
    }
}
