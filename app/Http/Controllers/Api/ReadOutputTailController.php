<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Api\Processes\OutputTail;
use App\Api\Processes\ReadOutputTailPayload;
use App\Models\Runs\ProcessRun;
use App\Support\OutputTailReads;

/**
 * Answers the last lines of a part's stream and records the bytes read as evidence read.
 */
final readonly class ReadOutputTailController
{
    public function __invoke(ReadOutputTailPayload $call, ProcessRun $processRun, OutputTailReads $reads): OutputTail
    {
        return $reads->tail($processRun->id, $call->part, $call->stream, $call->lines);
    }
}
