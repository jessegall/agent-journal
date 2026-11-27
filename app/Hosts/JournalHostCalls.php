<?php

declare(strict_types=1);

namespace App\Hosts;

use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use App\Hosts\Commands\ClaimHostOrders\ClaimHostOrdersCommand;
use App\Hosts\Commands\NotifyHostHeartbeat\NotifyHostHeartbeatCommand;
use App\Hosts\Commands\NotifyHostInventory\NotifyHostInventoryCommand;
use App\Hosts\Commands\NotifyHostOrder\NotifyHostOrderCommand;
use App\Hosts\Commands\NotifyHostOutput\NotifyHostOutputCommand;
use App\Hosts\Commands\NotifyHostProcess\NotifyHostProcessCommand;
use App\Hosts\Commands\PullHostPrivateValue\PullHostPrivateValueCommand;
use App\Hosts\Protocol\Data\HostAnswerData;
use App\Hosts\Protocol\Data\HostClaimedOrdersData;
use App\Hosts\Protocol\Data\HostHeartbeatData;
use App\Hosts\Protocol\Data\HostInventoryData;
use App\Hosts\Protocol\Data\HostOutputData;
use App\Hosts\Protocol\Data\HostPrivateValueData;
use App\Hosts\Protocol\Data\HostProcessReportData;
use App\Hosts\Protocol\Data\HostProjectReadReportData;
use App\Hosts\Protocol\HostCalls;
use App\Hosts\Values\HostContext;
use App\Projects\Commands\NotifyProjectRead\NotifyProjectReadCommand;
use App\Projects\Values\ProjectFileText;

/**
 * The journal's answer to each call of host protocol 1: the call's validated body, run as the journal's command for it.
 */
final readonly class JournalHostCalls implements HostCalls
{
    public function __construct(private CommandBus $commands, private HostWake $wake, private HostClaimSlots $slots) {}

    /**
     * A claim that finds nothing waits for a wake, and a newer claim of the same host takes the place of an older one.
     */
    #[Dispatches(ClaimHostOrdersCommand::class)]
    public function claimOrders(HostContext $host, int $limit, int $wait): HostClaimedOrdersData
    {
        $deposesAnother = $this->slots->isTaken($host->hostId);
        $slot = $this->slots->take($host->hostId);

        if ($deposesAnother) {
            $this->wake->wakeHost($host->hostId);
        }

        try {
            $claim = new ClaimHostOrdersCommand($host->hostId, $limit);
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

    #[Dispatches(NotifyHostOrderCommand::class)]
    public function answerOrder(HostContext $host, string $order, HostAnswerData $body): void
    {
        $this->commands->run(new NotifyHostOrderCommand($host->hostId, $order, $body->toJson()));
    }

    #[Dispatches(PullHostPrivateValueCommand::class)]
    public function pullPrivateValue(HostContext $host, string $submission): HostPrivateValueData
    {
        $value = $this->commands->run(new PullHostPrivateValueCommand($host->hostId, $submission));

        return HostPrivateValueData::from(['value' => $value]);
    }

    #[Dispatches(NotifyHostOutputCommand::class)]
    public function notifyProcessOutput(HostContext $host, string $process, HostOutputData $body): void
    {
        $this->commands->run(new NotifyHostOutputCommand($host->hostId, $process, $body));
    }

    #[Dispatches(NotifyHostProcessCommand::class)]
    public function notifyProcessReport(HostContext $host, string $process, HostProcessReportData $body): void
    {
        $this->commands->run(new NotifyHostProcessCommand($host->hostId, $process, $body));
    }

    /**
     * A host sends its inventory as it starts, so a claim still open from before is of a process that is gone.
     */
    #[Dispatches(NotifyHostInventoryCommand::class)]
    public function notifyInventory(HostContext $host, HostInventoryData $body): void
    {
        $this->slots->endEarlierClaims($host->hostId);
        $this->commands->run(new NotifyHostInventoryCommand($host->hostId, $body));
    }

    #[Dispatches(NotifyHostHeartbeatCommand::class)]
    public function notifyHeartbeat(HostContext $host, HostHeartbeatData $body): void
    {
        $heartbeat = new NotifyHostHeartbeatCommand($host->hostId, $body->liveProcesses, $body->answeredThrough);
        $this->commands->run($heartbeat);
    }

    #[Dispatches(NotifyProjectReadCommand::class)]
    public function notifyProjectRead(HostContext $host, string $read, HostProjectReadReportData $body): void
    {
        $this->commands->run(new NotifyProjectReadCommand(
            $host->hostId,
            $read,
            $body->entries,
            $this->fileText($body),
            $body->isTruncated,
            $body->failure,
        ));
    }

    /**
     * The file's text with its digest and size, or null when the answer holds no text; an empty file's text is ''.
     */
    private function fileText(HostProjectReadReportData $body): ProjectFileText|null
    {
        if ($body->text === null || $body->digest === null || $body->size === null) {
            return null;
        }

        return new ProjectFileText($body->text, $body->digest, $body->size);
    }
}
