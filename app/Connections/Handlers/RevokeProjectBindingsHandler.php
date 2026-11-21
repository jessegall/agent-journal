<?php

declare(strict_types=1);

namespace App\Connections\Handlers;

use App\Connections\Commands\RevokeProjectBindings;
use App\Connections\Enums\BindingReadiness;
use App\Connections\Models\ProjectBinding;
use App\Connections\Support\BindingRevocation;
use App\Connections\Values\BindingOutcome;
use App\Connections\Values\RevokedBindings;
use App\Contracts\CommandHandler;

/**
 * Revokes each chosen binding in one transaction, the way one revoke does, and answers each one's outcome; a binding
 * revoked already is named so and left as it is.
 */
final readonly class RevokeProjectBindingsHandler implements CommandHandler
{
    public function __construct(private BindingRevocation $revocation) {}

    public function handle(RevokeProjectBindings $command): RevokedBindings
    {
        $outcomes = [];

        foreach ($command->bindingIds as $bindingId) {
            $binding = ProjectBinding::lockById($bindingId);

            if ($binding->readiness === BindingReadiness::Revoked) {
                $outcomes[] = new BindingOutcome($bindingId, 'Already revoked');

                continue;
            }

            $this->revocation->revoke($binding, $command->dispatchedBy()->actorId());
            $outcomes[] = new BindingOutcome($bindingId, 'Revoked');
        }

        return new RevokedBindings($outcomes);
    }
}
