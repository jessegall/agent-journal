<?php

declare(strict_types=1);

namespace App\Connections\Handlers;

use App\Connections\Commands\RevokeProjectBinding;
use App\Connections\Enums\ConnectionAuditActor;
use App\Connections\Enums\ConnectionAuditType;
use App\Connections\Models\ConnectionAudit;
use App\Connections\Models\DeviceGrant;
use App\Connections\Models\ProjectBinding;
use App\Connections\Models\ProjectCommandRun;
use App\Contracts\CommandHandler;
use Carbon\CarbonImmutable;

/**
 * Revokes the binding, its host and its device grants and ends its running command streams in one transaction,
 * and audits who did it.
 */
final readonly class RevokeProjectBindingHandler implements CommandHandler
{
    public function handle(RevokeProjectBinding $command): void
    {
        $binding = ProjectBinding::lockById($command->bindingId);
        $binding->revoke();
        $binding->host->revokeAt(CarbonImmutable::now());

        foreach (DeviceGrant::lockLiveOf($binding) as $grant) {
            $grant->revoke();
        }

        foreach (ProjectCommandRun::lockRunningOf($binding) as $run) {
            $run->cancel();
        }

        ConnectionAudit::ofBinding(
            ConnectionAuditType::BindingRevoked,
            ConnectionAuditActor::User,
            $command->dispatchedBy()->actorId(),
            $binding,
        );
    }
}
