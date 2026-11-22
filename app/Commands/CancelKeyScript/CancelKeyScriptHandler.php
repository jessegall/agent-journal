<?php

declare(strict_types=1);

namespace App\Commands\CancelKeyScript;

use App\Contracts\CommandHandler;
use App\Enums\RecoveryAction;
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
