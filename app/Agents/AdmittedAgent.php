<?php

declare(strict_types=1);

namespace App\Agents;

use App\Access\Contracts\AuthoritySource;
use App\Support\AgentContext;

/**
 * An agent call that passed its credential, its signature and its profile pin: the context it acts in and the profile
 * its start was pinned to, loaded once for the request.
 */
final readonly class AdmittedAgent
{
    public function __construct(public AgentContext $context, public AuthoritySource $authority) {}
}
