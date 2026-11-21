<?php

declare(strict_types=1);

namespace App\Connections\Handlers;

use App\Agents\Support\InstallLineAvailability;
use App\Connections\Commands\IssueProjectInvitation;
use App\Connections\Enums\ConnectionAuditType;
use App\Connections\Exceptions\InstallLinesUnavailable;
use App\Connections\Models\ConnectionAudit;
use App\Connections\Models\Project;
use App\Connections\Models\ProjectInvitation;
use App\Connections\Values\IssuedInvitation;
use App\Contracts\CommandHandler;

/**
 * Refuses unless this server may issue install lines, revokes the line still pending under the same issuance key and
 * records the new one, in one transaction.
 */
final readonly class IssueProjectInvitationHandler implements CommandHandler
{
    public function __construct(private InstallLineAvailability $availability) {}

    public function handle(IssueProjectInvitation $command): IssuedInvitation
    {
        if (! $this->availability->canIssue()) {
            throw InstallLinesUnavailable::now();
        }

        $issuer = $command->dispatchedBy()->actorId();
        $replaced = ProjectInvitation::lockPendingUnder($command->issuanceKey);

        foreach ($replaced as $pending) {
            $pending->revoke();
        }

        $invitation = $this->issue($command, $issuer);
        $type = $replaced === [] ? ConnectionAuditType::Issued : ConnectionAuditType::Replaced;
        ConnectionAudit::ofInvitation($type, $issuer, $invitation);

        return new IssuedInvitation($invitation->id, $invitation->expires_at->toIso8601String());
    }

    private function issue(IssueProjectInvitation $command, string $issuer): ProjectInvitation
    {
        if ($command->projectId === null) {
            return ProjectInvitation::issueForNewProject($command->ticketDigest, $issuer, $command->issuanceKey);
        }

        $project = Project::forId($command->projectId);

        return ProjectInvitation::issueToJoin($project, $command->ticketDigest, $issuer, $command->issuanceKey);
    }
}
