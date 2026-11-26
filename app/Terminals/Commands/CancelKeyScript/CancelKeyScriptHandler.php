<?php

declare(strict_types=1);

namespace App\Terminals\Commands\CancelKeyScript;

use App\Agents\DriverRequestEndings;
use App\Agents\DriverRequestRecovery;
use App\Agents\Drivers\Enums\RecoveryAction;
use App\Bus\Contracts\CommandHandler;
use App\Exceptions\DriverRequestRefused;

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
