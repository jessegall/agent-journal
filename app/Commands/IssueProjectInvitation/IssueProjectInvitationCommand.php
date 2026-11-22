<?php

declare(strict_types=1);

namespace App\Commands\IssueProjectInvitation;

use App\Attributes\Authorize;
use App\Enums\AccessType;
use App\Policies\ConnectionsPolicy;
use App\Support\Command;
use App\Values\IssuedInvitation;

/**
 * The owner issues a one-time install line for a new project, or to join an environment of a connected one. The command carries the
 * digest of the line's ticket, never the ticket. The line belongs to the owner's install attempt under the issuance
 * key, opened by the first issue; issued again, under the key or by the attempt's reference and the version the owner
 * saw, it replaces the attempt's pending line, so a reply lost on the way never leaves two live lines.
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
