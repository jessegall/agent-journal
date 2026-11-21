<?php

declare(strict_types=1);

namespace App\Connections\Values;

/**
 * What issuing an install line answers: the invitation, when it expires, in ISO 8601, and the install attempt it
 * belongs to by its public reference and the version it is at now. The ticket is never part of it.
 */
final readonly class IssuedInvitation
{
    public function __construct(
        public string $invitationId,
        public string $expiresAt,
        public string $attemptReference,
        public int $attemptVersion,
    ) {}
}
