<?php

declare(strict_types=1);

namespace App\Values;

use App\Calls\Connections\ProjectCommandFrame;
use App\Enums\Connections\CommandRunState;

/**
 * What starting a journal verb's run answered: whether this request started it now, where an earlier run of the
 * request id stands after it was reconciled, and the frames that run recorded.
 */
final readonly class CommandRunStart
{
    /**
     * @param  list<ProjectCommandFrame>  $recordedFrames
     */
    public function __construct(public bool $isNew, public CommandRunState $state, public array $recordedFrames) {}
}
