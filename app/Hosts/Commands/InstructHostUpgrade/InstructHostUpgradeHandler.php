<?php

declare(strict_types=1);

namespace App\Hosts\Commands\InstructHostUpgrade;

use App\Bus\Contracts\CommandHandler;
use App\Connections\PublishedReleases;
use App\Files\Contracts\Files;
use App\Hosts\DriverInstallList;
use App\Hosts\Exceptions\HostUpgradeRefused;
use App\Hosts\Protocol\HostInstructions;
use App\Hosts\Protocol\Payloads\HostUpgradePlanPayload;
use App\Models\Hosts\HostProcess;
use App\Models\Projects\Host;
use App\Values\HostInstructionSource;

/**
 * Refuses while a process runs on the host, then makes its upgrade instruction, with the signed manifest and the drivers to
 * seal, and answers the instruction's id.
 */
final readonly class InstructHostUpgradeHandler implements CommandHandler
{
    public function __construct(
        private HostInstructions $instructions,
        private PublishedReleases $releases,
        private Files $files,
        private DriverInstallList $drivers,
    ) {}

    public function handle(InstructHostUpgradeCommand $command): string
    {
        $host = Host::findLocked($command->hostId);

        if (HostProcess::findLiveOn($host) !== []) {
            throw HostUpgradeRefused::forLiveProcess($host->id);
        }

        $instruction = $this->instructions->upgrade($host->id, HostInstructionSource::fromJournal(), HostUpgradePlanPayload::from([
            'version' => $this->releases->current()->version,
            'manifest' => $this->files->readNamed($this->releases->currentManifest()),
            'signature' => base64_encode($this->files->readNamed($this->releases->currentSignature())),
            'drivers' => $this->drivers->drivers()->toJson(),
        ]));

        $host->instructionUpgrade($instruction->id);

        return $instruction->getKey();
    }
}
