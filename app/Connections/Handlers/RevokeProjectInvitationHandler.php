<?php

declare(strict_types=1);

namespace App\Connections\Handlers;

use App\Connections\Commands\RevokeProjectInvitation;
use App\Connections\Enums\ConnectionAuditType;
use App\Connections\Models\ConnectionAudit;
use App\Connections\Models\ProjectInvitation;
use App\Contracts\CommandHandler;

/**
 * Revokes a pending install line and cancels its install attempt, holding the attempt's row; a line already redeemed,
 * expired or revoked is refused by name, and an attempt that moved on since the owner saw it is refused.
 */
final readonly class RevokeProjectInvitationHandler implements CommandHandler
{
    public function handle(RevokeProjectInvitation $command): void
    {
        $invitation = ProjectInvitation::lockPending($command->invitationId);
        $invitation->lockAttempt()->cancel($command->seenVersion);
        $invitation->revoke();

        ConnectionAudit::ofInvitation(
            ConnectionAuditType::InvitationRevoked,
            $command->dispatchedBy()->actorId(),
            $invitation,
        );
    }
}
