<?php

declare(strict_types=1);

namespace App\Connections\Values;

/**
 * What issuing an install line answers: the invitation and when it expires, in ISO 8601. The ticket is never part of
 * it.
 */
final readonly class IssuedInvitation
{
    public function __construct(public string $invitationId, public string $expiresAt) {}
}
