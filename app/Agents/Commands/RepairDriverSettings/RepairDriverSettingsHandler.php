<?php

declare(strict_types=1);

namespace App\Agents\Commands\RepairDriverSettings;

use App\Agents\DriverRequestLedger;
use App\Agents\Drivers\Enums\DriverOperation;
use App\Agents\Drivers\Enums\RecoveryAction;
use App\Bus\Contracts\CommandHandler;
use App\Exceptions\DriverRequestRefused;
use App\Values\DriverRequestPayload;

final readonly class RepairDriverSettingsHandler implements CommandHandler
{
    public function __construct(private DriverRequestLedger $recovery) {}

    public function handle(RepairDriverSettingsCommand $command): int
    {
        $request = $this->recovery->lockedAt($command->requestId, $command->expectedRowVersion);

        if (! $request->canRepair()) {
            throw DriverRequestRefused::notRepairable($request->id);
        }

        $request->repairWith($request->operation === DriverOperation::ChangeModel
            ? DriverRequestPayload::model($command->replacementText)
            : DriverRequestPayload::effort($command->replacementText));

        return $this->recovery->record($request, RecoveryAction::Repaired, $command->reason);
    }
}
