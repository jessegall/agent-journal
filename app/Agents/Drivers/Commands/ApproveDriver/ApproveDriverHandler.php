<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Commands\ApproveDriver;

use App\Agents\Drivers\Contracts\DriverCatalogue;
use App\Bus\Contracts\CommandHandler;
use App\Exceptions\DriverUnknown;
use App\Models\Drivers\DriverApproval;

final readonly class ApproveDriverHandler implements CommandHandler
{
    public function __construct(private DriverCatalogue $drivers) {}

    /**
     * @throws DriverUnknown when no package registered a driver under the key
     */
    public function handle(ApproveDriverCommand $command): void
    {
        $this->drivers->forKey($command->key);
        DriverApproval::create($command->key)->approveBuilds($command->buildPins);
    }
}
