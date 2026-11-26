<?php

declare(strict_types=1);

namespace App\Pipes\Run;

use App\Api\Processes\ProcessApi;
use App\Bus\Contracts\Pipe;
use App\Files\Contracts\Files;
use App\Support\Execution\ChannelRunEvents;
use App\Support\Run\FetchedAdmission;
use App\Support\Run\RunChannel;
use Psr\Log\LoggerInterface;

/**
 * Opens the signed channel every event of the run goes over, spooled so a lost connection only delays it.
 */
final readonly class OpenRunChannel implements Pipe
{
    public function __construct(private ProcessApi $processes, private Files $files, private LoggerInterface $logger) {}

    public function handle(FetchedAdmission $admission): RunChannel
    {
        return new RunChannel($admission, new ChannelRunEvents(
            $this->processes,
            $admission->runId,
            $admission->eventKey,
            $admission->spoolFolder(),
            $this->files,
            $this->logger,
        ));
    }
}
