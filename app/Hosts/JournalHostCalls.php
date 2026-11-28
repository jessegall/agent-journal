<?php

declare(strict_types=1);

namespace App\Hosts;

use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use App\Bus\Exceptions\CommittedFactListenerFailed;
use App\Hosts\Commands\ClaimHostInstructions\ClaimHostInstructionsCommand;
use App\Hosts\Commands\NotifyHostHeartbeat\NotifyHostHeartbeatCommand;
use App\Hosts\Commands\NotifyHostInstruction\NotifyHostInstructionCommand;
use App\Hosts\Commands\NotifyHostInventory\NotifyHostInventoryCommand;
use App\Hosts\Commands\NotifyHostOutput\NotifyHostOutputCommand;
use App\Hosts\Commands\NotifyHostProcess\NotifyHostProcessCommand;
use App\Hosts\Commands\PullHostPrivateValue\PullHostPrivateValueCommand;
use App\Hosts\Protocol\HostCalls;
use App\Hosts\Protocol\Payloads\HostAnswerPayload;
use App\Hosts\Protocol\Payloads\HostClaimedInstructionsPayload;
use App\Hosts\Protocol\Payloads\HostHeartbeatPayload;
use App\Hosts\Protocol\Payloads\HostInventoryPayload;
use App\Hosts\Protocol\Payloads\HostOutputPayload;
use App\Hosts\Protocol\Payloads\HostPrivateValuePayload;
use App\Hosts\Protocol\Payloads\HostProcessReportPayload;
use App\Hosts\Protocol\Payloads\HostProjectReadReportPayload;
use App\Hosts\Values\HostContext;
use App\Projects\Commands\NotifyProjectRead\NotifyProjectReadCommand;
use App\Projects\Values\ProjectFileText;
use App\Support\Command;
use Illuminate\Contracts\Debug\ExceptionHandler;

/**
 * The journal's answer to each call of host protocol 1: the call's validated body, run as the journal's command for it.
 */
final readonly class JournalHostCalls implements HostCalls
{
    public function __construct(
        private CommandBus $commands,
        private HostWake $wake,
        private HostClaimSlots $slots,
        private ExceptionHandler $failures,
    ) {}

    /**
     * A claim that finds nothing waits for a wake, and a newer claim of the same host takes the place of an older one.
     */
    #[Dispatches(ClaimHostInstructionsCommand::class)]
    public function claimInstruction(HostContext $host, int $limit, int $wait): HostClaimedInstructionsPayload
    {
        $deposesAnother = $this->slots->isTaken($host->hostId);
        $slot = $this->slots->take($host->hostId);

        if ($deposesAnother) {
            $this->wake->wakeHost($host->hostId);
        }

        try {
            $claim = new ClaimHostInstructionsCommand($host->hostId, $limit);
            $claimed = $this->commands->run($claim);
            $waitSeconds = $claimed->waitSeconds($wait);

            $isWoken = $claimed->isEmpty() && $waitSeconds > 0 && $this->wake->waitForHost($host->hostId, $waitSeconds);

            // A claim the host's newer one took the slot from answers what it had and passes the wake on to it.
            if ($isWoken && ! $this->slots->isHeldBy($host->hostId, $slot)) {
                $this->wake->wakeHost($host->hostId);
            } elseif ($isWoken) {
                $claimed = $this->commands->run($claim);
            }

            return $claimed->reply();
        } finally {
            $this->slots->release($host->hostId, $slot);
        }
    }

    #[Dispatches(NotifyHostInstructionCommand::class)]
    public function answerInstruction(HostContext $host, string $instruction, HostAnswerPayload $body): void
    {
        $this->report(new NotifyHostInstructionCommand($host->hostId, $instruction, $body->toJson()));
    }

    #[Dispatches(PullHostPrivateValueCommand::class)]
    public function pullPrivateValue(HostContext $host, string $submission): HostPrivateValuePayload
    {
        $value = $this->commands->run(new PullHostPrivateValueCommand($host->hostId, $submission));

        return HostPrivateValuePayload::from(['value' => $value]);
    }

    #[Dispatches(NotifyHostOutputCommand::class)]
    public function notifyProcessOutput(HostContext $host, string $process, HostOutputPayload $body): void
    {
        $this->report(new NotifyHostOutputCommand($host->hostId, $process, $body));
    }

    #[Dispatches(NotifyHostProcessCommand::class)]
    public function notifyProcessReport(HostContext $host, string $process, HostProcessReportPayload $body): void
    {
        $this->report(new NotifyHostProcessCommand($host->hostId, $process, $body));
    }

    /**
     * A host sends its inventory as it starts, so a claim still open from before is of a process that is gone.
     */
    #[Dispatches(NotifyHostInventoryCommand::class)]
    public function notifyInventory(HostContext $host, HostInventoryPayload $body): void
    {
        $this->slots->endEarlierClaims($host->hostId);
        $this->report(new NotifyHostInventoryCommand($host->hostId, $body));
    }

    #[Dispatches(NotifyHostHeartbeatCommand::class)]
    public function notifyHeartbeat(HostContext $host, HostHeartbeatPayload $body): void
    {
        $heartbeat = new NotifyHostHeartbeatCommand($host->hostId, $body->liveProcesses, $body->answeredThrough);
        $this->report($heartbeat);
    }

    #[Dispatches(NotifyProjectReadCommand::class)]
    public function notifyProjectRead(HostContext $host, string $read, HostProjectReadReportPayload $body): void
    {
        $this->report(new NotifyProjectReadCommand(
            $host->hostId,
            $read,
            $body->entries,
            $this->fileText($body),
            $body->isTruncated,
            $body->failure,
        ));
    }

    /**
     * Runs a report of the host's. A listener that failed on a fact the report committed is the journal's failure,
     * reported apart: the report stands, so the host is answered as heard and never sends it again ahead of every
     * later report.
     *
     * @param  Command<mixed>  $report
     */
    private function report(Command $report): void
    {
        try {
            $this->commands->run($report);
        } catch (CommittedFactListenerFailed $failed) {
            $this->failures->report($failed);
        }
    }

    /**
     * The file's text with its digest and size, or null when the answer holds no text; an empty file's text is ''.
     */
    private function fileText(HostProjectReadReportPayload $body): ProjectFileText|null
    {
        if ($body->text === null || $body->digest === null || $body->size === null) {
            return null;
        }

        return new ProjectFileText($body->text, $body->digest, $body->size);
    }
}
