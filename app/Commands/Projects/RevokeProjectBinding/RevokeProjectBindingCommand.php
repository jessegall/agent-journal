<?php

declare(strict_types=1);

namespace App\Commands\Projects\RevokeProjectBinding;

use App\Attributes\Authorize;
use App\Enums\Agents\AccessType;
use App\Policies\ConnectionsPolicy;
use App\Support\Command;
use App\Values\BindingOutcome;

/**
 * The owner revokes one connected folder: its authority generation rises and its host is revoked, so the host's next
 * signed call is refused. Other bindings of the project and of the machine keep working. Revoking it again answers
 * the same revocation and changes nothing.
 *
 * @extends Command<BindingOutcome>
 */
#[Authorize(ConnectionsPolicy::class, AccessType::Edit)]
final readonly class RevokeProjectBindingCommand extends Command
{
    public function __construct(public string $bindingId) {}
}
