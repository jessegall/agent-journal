<?php

declare(strict_types=1);

namespace App\Connections\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Connections\Policies\ConnectionsPolicy;
use App\Connections\Values\IssuedInvitation;
use App\Operations\Enums\AccessType;

/**
 * The owner issues a one-time install line for a new project, or to join a connected one. The command carries the
 * digest of the line's ticket, never the ticket. Issued again under the same issuance key, it revokes the line still
 * pending under that key, so a reply lost on the way never leaves two live lines.
 *
 * @extends Command<IssuedInvitation>
 */
#[Authorize(ConnectionsPolicy::class, AccessType::Create)]
final readonly class IssueProjectInvitation extends Command
{
    public function __construct(
        public string $ticketDigest,
        public string $issuanceKey,
        public string|null $projectId,
    ) {}
}
