<?php

declare(strict_types=1);

namespace App\Hosts\Commands\ClaimHostInstructions;

use App\Accounts\Enums\CommandEntry;
use App\Bus\Contracts\CommandHandler;
use App\Bus\Contracts\JournalCommands;
use App\Hosts\Commands\AllowHostImages\AllowHostImagesCommand;
use App\Hosts\Commands\BuildHostDriverImage\BuildHostDriverImageCommand;
use App\Hosts\Commands\RequestHostProtection\RequestHostProtectionCommand;
use App\Hosts\Commands\ReserveHostDriverImages\ReserveHostDriverImagesCommand;
use App\Hosts\Contracts\HostDriverImages;
use App\Hosts\HostInstructionPlacement;
use App\Hosts\Protocol\HostInstructionType;
use App\Hosts\Values\HostInstructionClaim;
use App\Models\Hosts\HostInstruction;
use App\Models\Projects\Host;
use App\Models\Projects\HostDriverImage;
use App\Time\Contracts\ServerClock;
use Illuminate\Container\Attributes\Config;

/**
 * Marks the host's claimable instructions claimed and hands each over signed, after a contained host's driver images
 * were reserved, built and allowed as far as they can be; a host that speaks another protocol is told to update.
 */
final readonly class ClaimHostInstructionsHandler implements CommandHandler
{
    private const string TRUSTED_ENTRY = 'host images';

    public function __construct(
        private HostInstructionPlacement $placement,
        private ServerClock $clock,
        #[Config('journal.agents.idle_window_seconds')]
        private int $idleWindowSeconds,
        private HostDriverImages $driverImages,
        private JournalCommands $commands,
    ) {}

    public function handle(ClaimHostInstructionsCommand $command): HostInstructionClaim
    {
        $host = $this->placement->orderingHost($command->hostId);
        $this->buildDriverImagesOn($host);
        $this->allowAgentImageOn($host);

        if ($host->arrangement->isContained()) {
            $protection = new RequestHostProtectionCommand($host->id);
            $this->commands->runAsJournal(CommandEntry::HostControl, self::TRUSTED_ENTRY, $protection);
        }

        $now = $this->clock->now();
        $claimed = [];

        foreach (HostInstruction::findClaimable($host, $now, $command->limit) as $instruction) {
            $instruction->claim($now);
            $claimed[] = $instruction->claimedInstruction($host->signInstruction($instruction));
        }

        $retakeable = HostInstruction::resolveSecondsUntilRetakeable($host, $now);

        return new HostInstructionClaim(
            $claimed,
            $now->utc()->format('Y-m-d\\TH:i:s.v\\Z'),
            $retakeable,
            $this->idleWindowSeconds,
        );
    }

    /**
     * A contained host that builds images keeps one driver image per deployed recipe, and each one not built yet is
     * sent its build; a host building or holding them is sent nothing again.
     */
    private function buildDriverImagesOn(Host $host): void
    {
        if (! $host->arrangement->isContained() || ! $host->carriesOut(HostInstructionType::BuildImage)) {
            return;
        }

        $reserve = new ReserveHostDriverImagesCommand($host->id);
        $this->commands->runAsJournal(CommandEntry::HostControl, self::TRUSTED_ENTRY, $reserve);

        foreach (HostDriverImage::findPendingOn($host->id) as $image) {
            $build = new BuildHostDriverImageCommand($host->id, $image->id);
            $this->commands->runAsJournal(CommandEntry::HostControl, self::TRUSTED_ENTRY, $build);
        }
    }

    /**
     * A contained host is ordered to allow the agent image and its built driver images whenever the images it last
     * allowed are other ones, as after its restart, a new agent image or a newly built driver image.
     */
    private function allowAgentImageOn(Host $host): void
    {
        $isStale = $host->arrangement->isContained()
            && $host->carriesOut(HostInstructionType::AllowImages)
            && $this->driverImages->needsAllowSet($host);

        if ($isStale) {
            $allow = new AllowHostImagesCommand($host->id, $this->driverImages->allowSetOf($host));
            $this->commands->runAsJournal(CommandEntry::HostControl, self::TRUSTED_ENTRY, $allow);
        }
    }
}
