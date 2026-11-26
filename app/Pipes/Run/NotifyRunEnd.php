<?php

declare(strict_types=1);

namespace App\Pipes\Run;

use App\Bus\Contracts\Pipe;
use App\Support\Run\ChannelRunEnded;
use App\Support\Run\SupervisedRun;
use App\Values\CommandReport;

/**
 * Reports the root status over the channel last, spooled before the local report; the report keeps the end of the
 * output and the exit status.
 */
final readonly class NotifyRunEnd implements Pipe
{
    /**
     * The most output printed; every byte is stored on the server.
     */
    private const int PREVIEW_CHARACTER_LIMIT = 4_000;

    public function handle(ChannelRunEnded $run): SupervisedRun
    {
        $events = $run->channel->events;
        $events->runFinished($run->outcome->status->code);
        $events->flush();
        $preview = mb_substr($run->outcome->output, -self::PREVIEW_CHARACTER_LIMIT);

        return new SupervisedRun(
            $run->channel->admission->runId,
            CommandReport::ending($run->outcome->status->code)->output($preview),
        );
    }
}
