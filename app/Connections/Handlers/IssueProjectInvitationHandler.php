<?php

declare(strict_types=1);

namespace App\Connections\Handlers;

use App\Agents\Support\InstallLineAvailability;
use App\Connections\Commands\IssueProjectInvitation;
use App\Connections\Enums\ConnectionAuditType;
use App\Connections\Exceptions\InstallLinesUnavailable;
use App\Connections\Models\ConnectionAudit;
use App\Connections\Models\Environment;
use App\Connections\Models\InstallAttempt;
use App\Connections\Models\Project;
use App\Connections\Models\ProjectInvitation;
use App\Connections\Values\IssuedInvitation;
use App\Contracts\CommandHandler;

/**
 * Refuses unless this server may issue install lines, then, holding the install attempt's row: moves the attempt to
 * its next version, revokes its line still pending and records the new one, in one transaction. A spent or cancelled
 * attempt answers what came of it and issues nothing.
 */
final readonly class IssueProjectInvitationHandler implements CommandHandler
{
    public function __construct(private InstallLineAvailability $availability) {}

    public function handle(IssueProjectInvitation $command): IssuedInvitation
    {
        if (! $this->availability->canIssue()) {
            throw InstallLinesUnavailable::now();
        }

        $owner = $command->dispatchedBy()->actorId();
        $attempt = $this->attemptOf($command, $owner);
        $isFirstLine = $attempt->version === 0;
        $attempt->replace($command->seenVersion);

        foreach (ProjectInvitation::lockPendingOf($attempt) as $pending) {
            $pending->revoke();
        }

        $invitation = ProjectInvitation::issueFor($attempt, $command->ticketDigest);
        $type = $isFirstLine ? ConnectionAuditType::Issued : ConnectionAuditType::Replaced;
        ConnectionAudit::ofInvitation($type, $owner, $invitation);

        return new IssuedInvitation(
            $invitation->id,
            $invitation->expires_at->toIso8601String(),
            $attempt->reference,
            $attempt->version,
        );
    }

    /**
     * The attempt the line is for, locked: the one its reference names, or the owner's attempt under the issuance
     * key, opened now for its target when there is none: a new project, or an environment of the project it joins.
     */
    private function attemptOf(IssueProjectInvitation $command, string $owner): InstallAttempt
    {
        if ($command->attemptReference !== null) {
            return InstallAttempt::lockOfOwner($owner, $command->attemptReference);
        }

        if ($command->projectId === null) {
            return InstallAttempt::openFor($owner, $command->issuanceKey, null);
        }

        $project = Project::forId($command->projectId);
        $joins = Environment::ofProjectById($project->id, (string) $command->environmentId);

        return InstallAttempt::openFor($owner, $command->issuanceKey, $joins);
    }
}
