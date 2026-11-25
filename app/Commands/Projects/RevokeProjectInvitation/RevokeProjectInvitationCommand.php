<?php

declare(strict_types=1);

namespace App\Commands\Projects\RevokeProjectInvitation;

use App\Attributes\Authorize;
use App\Enums\Agents\AccessType;
use App\Policies\ConnectionsPolicy;
use App\Support\Command;

/**
 * The owner revokes an install line that was not redeemed yet, which cancels its install attempt at the version the
 * owner saw; the line loses its authority at once.
 *
 * @extends Command<null>
 */
#[Authorize(ConnectionsPolicy::class, AccessType::Edit)]
final readonly class RevokeProjectInvitationCommand extends Command
{
    public function __construct(public string $invitationId, public int|null $seenVersion = null) {}
}
