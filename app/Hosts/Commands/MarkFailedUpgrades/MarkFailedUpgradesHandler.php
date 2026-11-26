<?php

declare(strict_types=1);

namespace App\Hosts\Commands\MarkFailedUpgrades;

use App\Bus\Contracts\CommandHandler;
use App\Models\Projects\Host;
use App\Time\Contracts\ServerClock;

final readonly class MarkFailedUpgradesHandler implements CommandHandler
{
    /**
     * How long after its done answer a host may take to name its new release in an inventory.
     */
    public const int SILENCE_SECONDS = 180;

    public function __construct(private ServerClock $clock) {}

    public function handle(MarkFailedUpgradesCommand $command): void
    {
        $answeredBefore = $this->clock->now()->subSeconds(self::SILENCE_SECONDS);

        foreach (Host::findUpgradesAnsweredDoneBefore($answeredBefore) as $host) {
            $host->failUpgrade("The host answered its upgrade but named no release {$host->upgrade_release} within "
                .self::SILENCE_SECONDS.' seconds.');
        }
    }
}
