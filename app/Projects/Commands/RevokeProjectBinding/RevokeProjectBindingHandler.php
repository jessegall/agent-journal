<?php

declare(strict_types=1);

namespace App\Projects\Commands\RevokeProjectBinding;

use App\Bus\Contracts\CommandHandler;
use App\Models\Projects\ProjectBinding;
use App\Projects\BindingRevocation;
use App\Projects\Values\BindingOutcome;

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
            ProjectBinding::findLockedById($command->bindingId),
            $command->dispatchedBy()->actorId(),
        );
    }
}
