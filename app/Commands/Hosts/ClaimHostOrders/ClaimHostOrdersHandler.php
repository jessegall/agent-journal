<?php

declare(strict_types=1);

namespace App\Commands\Hosts\ClaimHostOrders;

use App\Commands\Hosts\AllowHostImages\AllowHostImagesCommand;
use App\Commands\Hosts\RequestHostProtection\RequestHostProtectionCommand;
use App\Contracts\Bus\CommandHandler;
use App\Contracts\Bus\JournalCommands;
use App\Contracts\Time\ServerClock;
use App\Enums\Accounts\CommandEntry;
use App\Enums\Hosts\HostOrderType;
use App\Models\Hosts\HostOrder;
use App\Models\Projects\Host;
use App\Support\AgentImage;
use App\Support\Hosts\HostOrderPlacement;
use App\Values\ClaimedHostOrder;
use App\Values\HostOrderClaim;
use Illuminate\Contracts\Config\Repository;

/**
 * Marks the host's claimable orders claimed and hands each over signed; a host that speaks another protocol is told
 * to update.
 */
final readonly class ClaimHostOrdersHandler implements CommandHandler
{
    private const string TRUSTED_ENTRY = 'host images';

    public function __construct(
        private HostOrderPlacement $placement,
        private ServerClock $clock,
        private Repository $config,
        private AgentImage $agentImage,
        private JournalCommands $commands,
    ) {}

    public function handle(ClaimHostOrdersCommand $command): HostOrderClaim
    {
        $host = $this->placement->orderingHost($command->hostId);
        $this->allowAgentImageOn($host);

        if ($host->arrangement->isContained()) {
            $protection = new RequestHostProtectionCommand($host->id);
            $this->commands->runAsJournal(CommandEntry::HostControl, self::TRUSTED_ENTRY, $protection);
        }

        $now = $this->clock->now();
        $claimed = [];

        foreach (HostOrder::claimable($host, $now, $command->limit) as $order) {
            $order->claim($now);
            $claimed[] = ClaimedHostOrder::of($order, $host->signOrder($order));
        }

        $retakeable = HostOrder::secondsUntilRetakeable($host, $now);

        $idleWindow = $this->config->integer('agents.idle_window_seconds');

        return new HostOrderClaim($claimed, $now->utc()->format('Y-m-d\\TH:i:s.v\\Z'), $retakeable, $idleWindow);
    }

    /**
     * A contained host is ordered to allow the agent image whenever the images it last allowed are other ones, as
     * after its restart or a new agent image.
     */
    private function allowAgentImageOn(Host $host): void
    {
        $images = [$this->agentImage->reference];

        $isStale = $host->arrangement->isContained()
            && $host->carriesOut(HostOrderType::AllowImages)
            && ! $host->allowsImages($images);

        if ($isStale) {
            $allow = new AllowHostImagesCommand($host->id, $images);
            $this->commands->runAsJournal(CommandEntry::HostControl, self::TRUSTED_ENTRY, $allow);
        }
    }
}
