<?php

declare(strict_types=1);

namespace App\Pipes\Run;

use App\Calls\Processes\ProcessCalls;
use App\Contracts\Files;
use App\Contracts\Pipe;
use App\Support\Execution\ChannelRunEvents;
use App\Support\Execution\Supervisor;
use App\Support\Run\FetchedAdmission;
use App\Support\Run\SupervisedRun;
use App\Values\CommandReport;
use Psr\Log\LoggerInterface;

/**
 * Runs the plan under the supervisor and reports every event over the signed channel, the root status last, spooled
 * before the local report so a lost connection only delays it; the report keeps the end of the output and the exit
 * status.
 */
final readonly class SuperviseRun implements Pipe
{
    /**
     * The most output printed; every byte is stored on the server.
     */
    private const int PREVIEW_CHARACTER_LIMIT = 4_000;

    public function __construct(
        private ProcessCalls $processes,
        private Supervisor $supervisor,
        private Files $files,
        private LoggerInterface $logger,
    ) {}

    public function handle(FetchedAdmission $admission): SupervisedRun
    {
        $events = new ChannelRunEvents(
            $this->processes,
            $admission->runId,
            $admission->eventKey,
            $admission->spoolFolder(),
            $this->files,
            $this->logger,
        );

        $outcome = $this->supervisor->run($events, $admission->plan(), $admission->context());
        $events->runFinished($outcome->status);
        $events->flush();
        $preview = mb_substr($outcome->output, -self::PREVIEW_CHARACTER_LIMIT);

        return new SupervisedRun($admission->runId, CommandReport::ending($outcome->status)->output($preview));
    }
}
