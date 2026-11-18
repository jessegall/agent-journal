<?php

declare(strict_types=1);

namespace App\AgentRequests\Contracts;

use App\AgentRequests\Support\AgentClientSettings;

/**
 * Where a launched program finds the journal's address and its launch token; the relay, hooks and CLI all ask here.
 */
interface LaunchCredentialSource
{
    public function forThisLaunch(): AgentClientSettings;
}
