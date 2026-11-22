<?php

declare(strict_types=1);

namespace App\Agents\Commands\CancelKeyScript;

use App\Agents\Enums\RecoveryAction;
use App\Agents\Exceptions\DriverRequestRefused;
use App\Agents\Support\DriverRequestEndings;
use App\Agents\Support\DriverRequestRecovery;
use App\Contracts\CommandHandler;

final readonly class CancelKeyScriptHandler implements CommandHandler
{
    public function __construct(private DriverRequestRecovery $recovery, private DriverRequestEndings $endings) {}

    public function handle(CancelKeyScriptCommand $command): int
    {
        $request = $this->recovery->lockedAt($command->requestId, $command->expectedRowVersion);

        if (! $request->isStoppedKeyScript()) {
            throw DriverRequestRefused::noStoppedScript($request->id);
        }

        $this->endings->cancel($request);

        return $this->recovery->record($request, RecoveryAction::ScriptCancelled, $command->reason);
    }
}
