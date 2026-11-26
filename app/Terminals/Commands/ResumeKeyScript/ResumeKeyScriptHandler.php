<?php

declare(strict_types=1);

namespace App\Terminals\Commands\ResumeKeyScript;

use App\Agents\DriverRequestRecovery;
use App\Agents\Drivers\Enums\RecoveryAction;
use App\Bus\Contracts\CommandHandler;
use App\Exceptions\DriverRequestRefused;

final readonly class ResumeKeyScriptHandler implements CommandHandler
{
    public function __construct(private DriverRequestRecovery $recovery) {}

    public function handle(ResumeKeyScriptCommand $command): int
    {
        $request = $this->recovery->lockedAt($command->requestId, $command->expectedRowVersion);

        if (! $request->canResumeScript()) {
            throw DriverRequestRefused::noStoppedScript($request->id);
        }

        $request->retry();

        return $this->recovery->record($request, RecoveryAction::ScriptResumed, $command->reason);
    }
}
