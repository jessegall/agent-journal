<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use App\Models\Runs\ProcessRun;
use App\Processes\Api\OutputTail;
use App\Processes\Api\ReadOutputTailPayload;
use App\Processes\Commands\ReadOutputTail\ReadOutputTailCommand;

/**
 * Answers the last lines of a part's stream and records the bytes read as evidence read.
 */
final readonly class ReadOutputTailController
{
    #[Dispatches(ReadOutputTailCommand::class)]
    public function __invoke(ReadOutputTailPayload $call, ProcessRun $processRun, CommandBus $commands): OutputTail
    {
        return $commands->run(new ReadOutputTailCommand($processRun->id, $call->part, $call->stream, $call->lines));
    }
}
