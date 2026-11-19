<?php

declare(strict_types=1);

namespace App\Processes\Pipes\Run;

use App\AgentRequests\Values\CommandReport;
use App\Pipelines\Contracts\Pipe;
use App\Processes\Calls\ProcessCalls;
use App\Processes\Execution\ChannelRunEvents;
use App\Processes\Execution\Supervisor;
use App\Processes\Values\Run\FetchedAdmission;
use App\Processes\Values\Run\SupervisedRun;

/**
 * Runs the plan under the supervisor and reports every event over the signed channel; the report keeps the end of
 * the output and the exit status.
 */
final readonly class SuperviseRun implements Pipe
{
    /**
     * The most output printed; every byte is stored on the server.
     */
    private const int PREVIEW_CHARACTERS = 4_000;

    public function __construct(private ProcessCalls $processes, private Supervisor $supervisor) {}

    public function handle(FetchedAdmission $admission): SupervisedRun
    {
        $events = new ChannelRunEvents(
            $this->processes,
            $admission->runId,
            $admission->eventKey,
            $admission->spoolFolder(),
        );
        $outcome = $this->supervisor->run($events, $admission->plan(), $admission->context());
        $events->flush();
        $preview = mb_substr($outcome->output, -self::PREVIEW_CHARACTERS);

        return new SupervisedRun($admission->runId, CommandReport::ending($outcome->status)->output($preview));
    }
}
