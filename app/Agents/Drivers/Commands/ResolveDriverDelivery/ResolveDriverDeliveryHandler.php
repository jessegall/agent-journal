<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Commands\ResolveDriverDelivery;

use App\Agents\DriverRequestRecovery;
use App\Agents\Drivers\Enums\RecoveryAction;
use App\Bus\Contracts\CommandHandler;
use App\Exceptions\DriverRequestRefused;

final readonly class ResolveDriverDeliveryHandler implements CommandHandler
{
    public function __construct(private DriverRequestRecovery $recovery) {}

    public function handle(ResolveDriverDeliveryCommand $command): int
    {
        $request = $this->recovery->lockedAt($command->requestId, $command->expectedRowVersion);

        if (! $request->canResolve()) {
            throw DriverRequestRefused::notResolvable($request->id);
        }

        if ($command->isApplied) {
            $request->resolveAsApplied();

            return $this->recovery->record($request, RecoveryAction::ResolvedApplied, $command->reason);
        }

        $request->resolveAsNotApplied();

        return $this->recovery->record($request, RecoveryAction::ResolvedNotApplied, $command->reason);
    }
}
