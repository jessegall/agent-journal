<?php

declare(strict_types=1);

namespace App\Commands\RetryDriverRequest;

use App\Contracts\CommandHandler;
use App\Enums\RecoveryAction;
use App\Exceptions\DriverRequestRefused;
use App\Models\DriverRequest;
use App\Support\DriverRequestRecovery;

final readonly class RetryDriverRequestHandler implements CommandHandler
{
    public function __construct(private DriverRequestRecovery $recovery) {}

    public function handle(RetryDriverRequestCommand $command): int
    {
        $request = DriverRequest::query()->whereKey($command->requestId)->lockForUpdate()->firstOrFail();

        // A second tab retrying the same failure gets the attempt the first one made.
        if ($request->wasRetriedFrom($command->expectedRowVersion)) {
            return $request->row_version;
        }

        $request = $this->recovery->lockedAt($command->requestId, $command->expectedRowVersion);

        if (! $request->canRetry()) {
            throw DriverRequestRefused::notRetriable($request->id, $request->progress->value);
        }

        if (! $request->canRetrySafely()) {
            throw DriverRequestRefused::noEffectUnproven($request->id);
        }

        $request->retrySafely();

        return $this->recovery->record($request, RecoveryAction::Retried, $command->reason);
    }
}
