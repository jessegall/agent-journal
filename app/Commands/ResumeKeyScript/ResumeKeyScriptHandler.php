<?php

declare(strict_types=1);

namespace App\Commands\ResumeKeyScript;

use App\Contracts\Bus\CommandHandler;
use App\Enums\RecoveryAction;
use App\Exceptions\DriverRequestRefused;
use App\Support\DriverRequestRecovery;

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
