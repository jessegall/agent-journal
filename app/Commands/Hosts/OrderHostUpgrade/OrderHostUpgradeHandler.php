<?php

declare(strict_types=1);

namespace App\Commands\Hosts\OrderHostUpgrade;

use App\Contracts\Bus\CommandHandler;
use App\Contracts\Files\Files;
use App\Enums\Hosts\HostOrderType;
use App\Exceptions\HostUpgradeRefused;
use App\Models\Hosts\HostProcess;
use App\Models\Projects\Host;
use App\Support\DriverInstallList;
use App\Support\Hosts\HostOrderPlacement;
use App\Support\PublishedReleases;
use App\Values\HostOrderSource;

/**
 * Refuses while a process runs on the host, then makes its upgrade order, with the signed manifest and the drivers to
 * seal, and answers the order's id.
 */
final readonly class OrderHostUpgradeHandler implements CommandHandler
{
    public function __construct(
        private HostOrderPlacement $placement,
        private PublishedReleases $releases,
        private Files $files,
        private DriverInstallList $drivers,
    ) {}

    public function handle(OrderHostUpgradeCommand $command): string
    {
        $host = Host::findLocked($command->hostId);

        if (HostProcess::findLiveOn($host) !== []) {
            throw HostUpgradeRefused::forLiveProcess($host->id);
        }

        $order = $this->placement->forHost($host->id, HostOrderSource::fromJournal(), HostOrderType::Upgrade, [
            'version' => $this->releases->current()->version,
            'manifest' => $this->files->readNamed($this->releases->currentManifest()),
            'signature' => base64_encode($this->files->readNamed($this->releases->currentSignature())),
            'drivers' => $this->drivers->drivers()->toJson(),
        ]);

        $host->orderUpgrade($order->id);

        return $order->id;
    }
}
