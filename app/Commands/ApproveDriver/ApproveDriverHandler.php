<?php

declare(strict_types=1);

namespace App\Commands\ApproveDriver;

use App\Contracts\CommandHandler;
use App\Contracts\DriverCatalogue;
use App\Exceptions\DriverUnknown;
use App\Models\DriverApproval;

final readonly class ApproveDriverHandler implements CommandHandler
{
    public function __construct(private DriverCatalogue $drivers) {}

    /**
     * @throws DriverUnknown when no package registered a driver under the key
     */
    public function handle(ApproveDriverCommand $command): void
    {
        $this->drivers->forKey($command->key);
        DriverApproval::forKey($command->key)->approveBuilds($command->buildPins);
    }
}
