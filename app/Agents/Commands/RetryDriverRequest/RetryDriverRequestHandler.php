<?php

declare(strict_types=1);

namespace App\Agents\Commands\RetryDriverRequest;

use App\Agents\Enums\RecoveryAction;
use App\Agents\Exceptions\DriverRequestRefused;
use App\Agents\Support\DriverRequestRecovery;
use App\Contracts\CommandHandler;

final readonly class RetryDriverRequestHandler implements CommandHandler
{
    public function __construct(private DriverRequestRecovery $recovery) {}

    public function handle(RetryDriverRequestCommand $command): int
    {
        $request = $this->recovery->lockedAt($command->requestId, $command->expectedRowVersion);

        if (! $request->canRetry()) {
            throw DriverRequestRefused::notRetriable($request->id, $request->progress->value);
        }

        $request->retry();

        return $this->recovery->record($request, RecoveryAction::Retried, $command->reason);
    }
}
