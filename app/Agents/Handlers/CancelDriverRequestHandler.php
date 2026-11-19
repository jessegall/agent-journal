<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Agents\Commands\CancelDriverRequest;
use App\Agents\Enums\RecoveryAction;
use App\Agents\Exceptions\DriverRequestRefused;
use App\Agents\Models\AgentRuntime;
use App\Agents\Support\DriverRequestRecovery;
use App\Contracts\CommandHandler;

final readonly class CancelDriverRequestHandler implements CommandHandler
{
    public function __construct(private DriverRequestRecovery $recovery) {}

    public function handle(CancelDriverRequest $command): int
    {
        $request = $this->recovery->lockedAt($command->requestId, $command->expectedRowVersion);

        if (! $request->canCancel()) {
            throw DriverRequestRefused::notCancellable($request->id, $request->progress->value);
        }

        $request->cancel();

        if ($request->changesASetting()) {
            AgentRuntime::query()->lockForUpdate()->findOrFail(
                $request->agent_runtime_id,
            )->recomputeRequestedSettings();
        }

        return $this->recovery->record($request, RecoveryAction::Cancelled, $command->reason);
    }
}
