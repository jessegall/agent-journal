<?php

declare(strict_types=1);

namespace App\Commands\Hosts\MarkFailedUpgrades;

use App\Contracts\Bus\CommandHandler;
use App\Contracts\Time\ServerClock;
use App\Models\Projects\Host;

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
