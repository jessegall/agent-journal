<?php

declare(strict_types=1);

namespace App\Connections\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Connections\Policies\ConnectionsPolicy;
use App\Operations\Enums\AccessType;

/**
 * The owner revokes an install line that was not redeemed yet, which cancels its install attempt at the version the
 * owner saw; the line loses its authority at once.
 *
 * @extends Command<null>
 */
#[Authorize(ConnectionsPolicy::class, AccessType::Edit)]
final readonly class RevokeProjectInvitation extends Command
{
    public function __construct(public string $invitationId, public int|null $seenVersion = null) {}
}
