<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Agents\Commands\ResolveDriverDelivery;
use App\Agents\Enums\RecoveryAction;
use App\Agents\Exceptions\DriverRequestRefused;
use App\Agents\Support\DriverRequestRecovery;
use App\Contracts\CommandHandler;

final readonly class ResolveDriverDeliveryHandler implements CommandHandler
{
    public function __construct(private DriverRequestRecovery $recovery) {}

    public function handle(ResolveDriverDelivery $command): int
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
