<?php

declare(strict_types=1);

namespace App\Commands\Agents\RepairDriverSettings;

use App\Contracts\Bus\CommandHandler;
use App\Enums\Drivers\DriverOperation;
use App\Enums\Drivers\RecoveryAction;
use App\Exceptions\DriverRequestRefused;
use App\Models\Agents\AgentRuntime;
use App\Support\DriverRequestRecovery;
use App\Values\DriverRequestPayload;

final readonly class RepairDriverSettingsHandler implements CommandHandler
{
    public function __construct(private DriverRequestRecovery $recovery) {}

    public function handle(RepairDriverSettingsCommand $command): int
    {
        $request = $this->recovery->lockedAt($command->requestId, $command->expectedRowVersion);

        if (! $request->canRepair()) {
            throw DriverRequestRefused::notRepairable($request->id);
        }

        $request->repairWith($request->operation === DriverOperation::ChangeModel
            ? DriverRequestPayload::model($command->replacementText)
            : DriverRequestPayload::effort($command->replacementText));

        AgentRuntime::query()->lockForUpdate()->findOrFail($request->agent_runtime_id)->recomputeRequestedSettings();

        return $this->recovery->record($request, RecoveryAction::Repaired, $command->reason);
    }
}
