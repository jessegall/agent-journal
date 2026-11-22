<?php

declare(strict_types=1);

namespace App\Commands\IssueProjectInvitation;

use App\Contracts\Bus\CommandHandler;
use App\Enums\ConnectionAuditType;
use App\Exceptions\InstallLinesUnavailable;
use App\Models\ConnectionAudit;
use App\Models\Environment;
use App\Models\InstallAttempt;
use App\Models\Project;
use App\Models\ProjectInvitation;
use App\Support\InstallLineAvailability;
use App\Values\IssuedInvitation;

/**
 * Refuses unless this server may issue install lines, then, holding the install attempt's row: moves the attempt to
 * its next version, revokes its line still pending and records the new one, in one transaction. A spent or cancelled
 * attempt answers what came of it and issues nothing.
 */
final readonly class IssueProjectInvitationHandler implements CommandHandler
{
    public function __construct(private InstallLineAvailability $availability) {}

    public function handle(IssueProjectInvitationCommand $command): IssuedInvitation
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

        $invitation = ProjectInvitation::create($attempt, $command->ticketDigest);
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
    private function attemptOf(IssueProjectInvitationCommand $command, string $owner): InstallAttempt
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
