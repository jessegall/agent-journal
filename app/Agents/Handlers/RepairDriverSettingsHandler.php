<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Agents\Commands\RepairDriverSettings;
use App\Agents\Enums\DriverOperation;
use App\Agents\Enums\RecoveryAction;
use App\Agents\Exceptions\DriverRequestRefused;
use App\Agents\Models\AgentRuntime;
use App\Agents\Support\DriverRequestRecovery;
use App\Agents\Values\DriverRequestPayload;
use App\Contracts\CommandHandler;

final readonly class RepairDriverSettingsHandler implements CommandHandler
{
    public function __construct(private DriverRequestRecovery $recovery) {}

    public function handle(RepairDriverSettings $command): int
    {
        $request = $this->recovery->lockedAt($command->requestId, $command->expectedRowVersion);

        if (! $request->canRepair()) {
            throw DriverRequestRefused::notRepairable($request->id);
        }

        $request->repairWith($request->operation === DriverOperation::ChangeModel
            ? DriverRequestPayload::model($command->value)
            : DriverRequestPayload::effort($command->value));
        AgentRuntime::query()->lockForUpdate()->findOrFail($request->agent_runtime_id)->recomputeRequestedSettings();

        return $this->recovery->record($request, RecoveryAction::Repaired, $command->reason);
    }
}
