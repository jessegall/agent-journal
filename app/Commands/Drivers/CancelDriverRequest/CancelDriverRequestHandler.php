<?php

declare(strict_types=1);

namespace App\Commands\Drivers\CancelDriverRequest;

use App\Contracts\Bus\CommandHandler;
use App\Enums\RecoveryAction;
use App\Exceptions\DriverRequestRefused;
use App\Models\Agents\AgentRuntime;
use App\Support\DriverRequestEndings;
use App\Support\DriverRequestRecovery;

final readonly class CancelDriverRequestHandler implements CommandHandler
{
    public function __construct(private DriverRequestRecovery $recovery, private DriverRequestEndings $endings) {}

    public function handle(CancelDriverRequestCommand $command): int
    {
        $request = $this->recovery->lockedAt($command->requestId, $command->expectedRowVersion);

        if (! $request->canCancel()) {
            throw DriverRequestRefused::notCancellable($request->id, $request->progress->value);
        }

        $this->endings->cancel($request);

        if ($request->changesASetting()) {
            AgentRuntime::query()->lockForUpdate()->findOrFail(
                $request->agent_runtime_id,
            )->recomputeRequestedSettings();
        }

        return $this->recovery->record($request, RecoveryAction::Cancelled, $command->reason);
    }
}
