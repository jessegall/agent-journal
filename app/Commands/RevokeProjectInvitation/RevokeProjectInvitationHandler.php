<?php

declare(strict_types=1);

namespace App\Commands\RevokeProjectInvitation;

use App\Contracts\CommandHandler;
use App\Enums\ConnectionAuditType;
use App\Models\ConnectionAudit;
use App\Models\ProjectInvitation;

/**
 * Revokes a pending install line and cancels its install attempt, holding the attempt's row; a line already redeemed,
 * expired or revoked is refused by name, and an attempt that moved on since the owner saw it is refused.
 */
final readonly class RevokeProjectInvitationHandler implements CommandHandler
{
    public function handle(RevokeProjectInvitationCommand $command): void
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
