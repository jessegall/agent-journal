<?php

declare(strict_types=1);

namespace App\Http\Controllers\Calls;

use App\Calls\Processes\OutputTail;
use App\Calls\Processes\ReadOutputTailCall;
use App\Models\Runs\ProcessRun;
use App\Support\OutputTailReads;

/**
 * Answers the last lines of a part's stream and records the bytes read as evidence read.
 */
final readonly class ReadOutputTailController
{
    public function __invoke(ReadOutputTailCall $call, ProcessRun $processRun, OutputTailReads $reads): OutputTail
    {
        return $reads->tail($processRun->id, $call->part, $call->stream, $call->lines);
    }
}
