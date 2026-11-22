<?php

declare(strict_types=1);

namespace App\Commands\ResolveDriverDelivery;

use App\Contracts\Bus\CommandHandler;
use App\Enums\RecoveryAction;
use App\Exceptions\DriverRequestRefused;
use App\Support\DriverRequestRecovery;

final readonly class ResolveDriverDeliveryHandler implements CommandHandler
{
    public function __construct(private DriverRequestRecovery $recovery) {}

    public function handle(ResolveDriverDeliveryCommand $command): int
    {
        $request = $this->recovery->lockedAt($command->requestId, $command->expectedRowVersion);

        if (! $request->canResolve()) {
            throw DriverRequestRefused::notResolvable($request->id);
        }

        if ($command->applied) {
            $request->resolveAsApplied();

            return $this->recovery->record($request, RecoveryAction::ResolvedApplied, $command->reason);
        }

        $request->resolveAsNotApplied();

        return $this->recovery->record($request, RecoveryAction::ResolvedNotApplied, $command->reason);
    }
}
