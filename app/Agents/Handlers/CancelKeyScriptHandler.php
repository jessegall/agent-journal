<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Agents\Commands\CancelKeyScript;
use App\Agents\Enums\RecoveryAction;
use App\Agents\Exceptions\DriverRequestRefused;
use App\Agents\Support\DriverRequestRecovery;
use App\Contracts\CommandHandler;

final readonly class CancelKeyScriptHandler implements CommandHandler
{
    public function __construct(private DriverRequestRecovery $recovery) {}

    public function handle(CancelKeyScript $command): int
    {
        $request = $this->recovery->lockedAt($command->requestId, $command->expectedRowVersion);

        if (! $request->isStoppedKeyScript()) {
            throw DriverRequestRefused::noStoppedScript($request->id);
        }

        $request->cancel();

        return $this->recovery->record($request, RecoveryAction::ScriptCancelled, $command->reason);
    }
}
