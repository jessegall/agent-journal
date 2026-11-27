<?php

declare(strict_types=1);

namespace App\Hosts\Commands\ClaimHostInstructions;

use App\Accounts\Enums\CommandEntry;
use App\Bus\Contracts\CommandHandler;
use App\Bus\Contracts\JournalCommands;
use App\Hosts\Commands\AllowHostImages\AllowHostImagesCommand;
use App\Hosts\Commands\RequestHostProtection\RequestHostProtectionCommand;
use App\Hosts\HostInstructionPlacement;
use App\Hosts\Protocol\HostInstructionType;
use App\Hosts\Values\HostInstructionClaim;
use App\Models\Hosts\HostInstruction;
use App\Models\Projects\Host;
use App\Support\AgentImage;
use App\Time\Contracts\ServerClock;
use Illuminate\Container\Attributes\Config;

/**
 * Marks the host's claimable instructions claimed and hands each over signed; a host that speaks another protocol is told
 * to update.
 */
final readonly class ClaimHostInstructionsHandler implements CommandHandler
{
    private const string TRUSTED_ENTRY = 'host images';

    public function __construct(
        private HostInstructionPlacement $placement,
        private ServerClock $clock,
        #[Config('agents.idle_window_seconds')]
        private int $idleWindowSeconds,
        private AgentImage $agentImage,
        private JournalCommands $commands,
    ) {}

    public function handle(ClaimHostInstructionsCommand $command): HostInstructionClaim
    {
        $host = $this->placement->orderingHost($command->hostId);
        $this->allowAgentImageOn($host);

        if ($host->arrangement->isContained()) {
            $protection = new RequestHostProtectionCommand($host->id);
            $this->commands->runAsJournal(CommandEntry::HostControl, self::TRUSTED_ENTRY, $protection);
        }

        $now = $this->clock->now();
        $claimed = [];

        foreach (HostInstruction::claimable($host, $now, $command->limit) as $instruction) {
            $instruction->claim($now);
            $claimed[] = $instruction->claimedInstruction($host->signInstruction($instruction));
        }

        $retakeable = HostInstruction::secondsUntilRetakeable($host, $now);

        return new HostInstructionClaim(
            $claimed,
            $now->utc()->format('Y-m-d\\TH:i:s.v\\Z'),
            $retakeable,
            $this->idleWindowSeconds,
        );
    }

    /**
     * A contained host is ordered to allow the agent image whenever the images it last allowed are other ones, as
     * after its restart or a new agent image.
     */
    private function allowAgentImageOn(Host $host): void
    {
        $images = [$this->agentImage->reference];

        $isStale = $host->arrangement->isContained()
            && $host->carriesOut(HostInstructionType::AllowImages)
            && ! $host->allowsImages($images);

        if ($isStale) {
            $allow = new AllowHostImagesCommand($host->id, $images);
            $this->commands->runAsJournal(CommandEntry::HostControl, self::TRUSTED_ENTRY, $allow);
        }
    }
}
