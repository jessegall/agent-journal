<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Commands\CancelDriverRequest;

use App\Agents\DriverRequestEndings;
use App\Agents\DriverRequestRecovery;
use App\Agents\Drivers\Enums\RecoveryAction;
use App\Bus\Contracts\CommandHandler;
use App\Exceptions\DriverRequestRefused;

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

        return $this->recovery->record($request, RecoveryAction::Cancelled, $command->reason);
    }
}
