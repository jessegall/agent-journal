<?php

declare(strict_types=1);

namespace App\Support;

/**
 * An agent's proposal to share a root, which the share holds until the owner approves it or it expires: the requester
 * is kept for attribution only, never as authority.
 */
final readonly class ShareProposal
{
    public function __construct(public ActorIdentity $requester) {}
}
