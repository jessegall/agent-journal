<?php

declare(strict_types=1);

namespace App\Commands\Projects\RevokeProjectBindings;

use App\Contracts\Bus\CommandHandler;
use App\Models\Projects\ProjectBinding;
use App\Support\BindingRevocation;
use App\Values\RevokedBindings;

/**
 * Revokes each chosen binding in one transaction, the way one revoke does, and answers each one's outcome; a binding
 * revoked already is named so and left as it is.
 */
final readonly class RevokeProjectBindingsHandler implements CommandHandler
{
    public function __construct(private BindingRevocation $revocation) {}

    public function handle(RevokeProjectBindingsCommand $command): RevokedBindings
    {
        $outcomes = [];

        foreach ($command->ids as $bindingId) {
            $outcomes[] = $this->revocation->revoke(
                ProjectBinding::findLockedById($bindingId),
                $command->dispatchedBy()->actorId(),
            );
        }

        return new RevokedBindings($outcomes);
    }
}
