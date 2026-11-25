<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Api\Processes\OutputTail;
use App\Api\Processes\ReadOutputTailPayload;
use App\Attributes\Bus\Dispatches;
use App\Commands\Runs\ReadOutputTail\ReadOutputTailCommand;
use App\Contracts\Bus\CommandBus;
use App\Models\Runs\ProcessRun;

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
