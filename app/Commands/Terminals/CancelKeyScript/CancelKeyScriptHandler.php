<?php

declare(strict_types=1);

namespace App\Commands\Terminals\CancelKeyScript;

use App\Contracts\Bus\CommandHandler;
use App\Enums\Drivers\RecoveryAction;
use App\Exceptions\DriverRequestRefused;
use App\Support\DriverRequestEndings;
use App\Support\DriverRequestRecovery;

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
