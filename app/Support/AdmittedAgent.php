<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\AuthoritySource;

/**
 * An agent call that passed its credential, its signature and its profile pin: the context it acts in and the profile
 * its start was pinned to, loaded once for the request.
 */
final readonly class AdmittedAgent
{
    public function __construct(public AgentContext $context, public AuthoritySource $authority) {}
}
