<?php

declare(strict_types=1);

namespace App\Connections\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Connections\Policies\ConnectionsPolicy;
use App\Connections\Values\BindingOutcome;
use App\Operations\Enums\AccessType;

/**
 * The owner revokes one connected folder: its authority generation rises and its host is revoked, so the host's next
 * signed call is refused. Other bindings of the project and of the machine keep working. Revoking it again answers
 * the same revocation and changes nothing.
 *
 * @extends Command<BindingOutcome>
 */
#[Authorize(ConnectionsPolicy::class, AccessType::Edit)]
final readonly class RevokeProjectBinding extends Command
{
    public function __construct(public string $bindingId) {}
}
