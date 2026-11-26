<?php

declare(strict_types=1);

namespace App\Projects\Commands\IssueProjectInvitation;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Policies\ConnectionsPolicy;
use App\Projects\Values\IssuedInvitation;
use App\Support\Command;

/**
 * The owner issues a one-time install line for a new project, or to join an environment of a connected one; the command
 * carries the digest of the ticket, never the ticket. Issued again for the same install attempt, it replaces the
 * pending line, so there are never two live lines.
 *
 * @extends Command<IssuedInvitation>
 */
#[Authorize(ConnectionsPolicy::class, AccessType::Create)]
final readonly class IssueProjectInvitationCommand extends Command
{
    public function __construct(
        public string $ticketDigest,
        public string $issuanceKey,
        public string|null $projectId,
        public string|null $environmentId = null,
        public string|null $attemptReference = null,
        public int|null $seenVersion = null,
    ) {}
}
