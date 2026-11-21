<?php

declare(strict_types=1);

namespace App\Connections\Handlers;

use App\Connections\Commands\RevokeProjectBinding;
use App\Connections\Enums\ConnectionAuditActor;
use App\Connections\Enums\ConnectionAuditType;
use App\Connections\Models\ConnectionAudit;
use App\Connections\Models\ProjectBinding;
use App\Contracts\CommandHandler;
use Carbon\CarbonImmutable;

/**
 * Revokes the binding and its host in one transaction, and audits who did it.
 */
final readonly class RevokeProjectBindingHandler implements CommandHandler
{
    public function handle(RevokeProjectBinding $command): void
    {
        $binding = ProjectBinding::lockById($command->bindingId);
        $binding->revoke();
        $binding->host->revokeAt(CarbonImmutable::now());
        ConnectionAudit::ofBinding(
            ConnectionAuditType::BindingRevoked,
            ConnectionAuditActor::User,
            $command->dispatchedBy()->actorId(),
            $binding,
        );
    }
}
