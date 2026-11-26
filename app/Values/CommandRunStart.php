<?php

declare(strict_types=1);

namespace App\Values;

use App\Api\Connections\ProjectCommandFrame;
use App\Enums\Connections\CommandRunStatus;

/**
 * What starting a journal verb's run answered: whether this request started it now, where an earlier run of the
 * request id stands after it was reconciled, and the frames that run recorded.
 */
final readonly class CommandRunStart
{
    /**
     * @param  list<ProjectCommandFrame>  $recordedFrames
     */
    public function __construct(public bool $isNew, public CommandRunStatus $status, public array $recordedFrames) {}
}
