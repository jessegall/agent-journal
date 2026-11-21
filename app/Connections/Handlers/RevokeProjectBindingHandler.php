<?php

declare(strict_types=1);

namespace App\Connections\Handlers;

use App\Connections\Commands\RevokeProjectBinding;
use App\Connections\Models\ProjectBinding;
use App\Connections\Support\BindingRevocation;
use App\Contracts\CommandHandler;

/**
 * Revokes the binding, its host and its device grants and ends its running command streams in one transaction,
 * and audits who did it.
 */
final readonly class RevokeProjectBindingHandler implements CommandHandler
{
    public function __construct(private BindingRevocation $revocation) {}

    public function handle(RevokeProjectBinding $command): void
    {
        $this->revocation->revoke(ProjectBinding::lockById($command->bindingId), $command->dispatchedBy()->actorId());
    }
}
