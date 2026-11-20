<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Agents\Commands\ResumeKeyScript;
use App\Agents\Enums\RecoveryAction;
use App\Agents\Exceptions\DriverRequestRefused;
use App\Agents\Support\DriverRequestRecovery;
use App\Contracts\CommandHandler;

final readonly class ResumeKeyScriptHandler implements CommandHandler
{
    public function __construct(private DriverRequestRecovery $recovery) {}

    public function handle(ResumeKeyScript $command): int
    {
        $request = $this->recovery->lockedAt($command->requestId, $command->expectedRowVersion);

        if (! $request->canResumeScript()) {
            throw DriverRequestRefused::noStoppedScript($request->id);
        }

        $request->retry();

        return $this->recovery->record($request, RecoveryAction::ScriptResumed, $command->reason);
    }
}
