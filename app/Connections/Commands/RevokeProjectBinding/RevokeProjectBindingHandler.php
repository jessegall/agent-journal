<?php

declare(strict_types=1);

namespace App\Connections\Commands\RevokeProjectBinding;

use App\Connections\Models\ProjectBinding;
use App\Connections\Support\BindingRevocation;
use App\Connections\Values\BindingOutcome;
use App\Contracts\CommandHandler;

/**
 * Revokes the binding, its host and its device grants and ends its running command streams in one transaction,
 * and audits who did it, once; a binding revoked already answers the time it was revoked.
 */
final readonly class RevokeProjectBindingHandler implements CommandHandler
{
    public function __construct(private BindingRevocation $revocation) {}

    public function handle(RevokeProjectBindingCommand $command): BindingOutcome
    {
        return $this->revocation->revoke(
            ProjectBinding::lockById($command->bindingId),
            $command->dispatchedBy()->actorId(),
        );
    }
}
