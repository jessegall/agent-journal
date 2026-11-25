<?php

declare(strict_types=1);

namespace App\Commands\Projects\RevokeProjectInvitation;

use App\Contracts\Bus\CommandHandler;
use App\Enums\ConnectionAuditType;
use App\Models\Projects\ConnectionAudit;
use App\Models\Projects\InstallAttempt;
use App\Models\Projects\ProjectInvitation;

/**
 * Revokes a pending install line and cancels its install attempt, holding the attempt's row; a line already redeemed,
 * expired or revoked is refused by name, and an attempt that moved on since the owner saw it is refused.
 */
final readonly class RevokeProjectInvitationHandler implements CommandHandler
{
    public function handle(RevokeProjectInvitationCommand $command): void
    {
        $invitation = ProjectInvitation::lockPending($command->invitationId);
        $attemptId = $invitation->attemptId();
        InstallAttempt::lockById($attemptId)->cancel($command->seenVersion);
        $invitation->revoke();

        ConnectionAudit::createForInvitation(
            ConnectionAuditType::InvitationRevoked,
            $command->dispatchedBy()->actorId(),
            $invitation,
        );
    }
}
