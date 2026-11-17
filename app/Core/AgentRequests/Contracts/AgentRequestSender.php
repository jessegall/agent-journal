<?php

declare(strict_types=1);

namespace App\Core\AgentRequests\Contracts;

use App\Core\AgentRequests\Exceptions\AgentRequestFailed;
use App\Core\AgentRequests\Support\AgentReply;

/**
 * Sends a signed call from a launched program to the journal as the agent of its launch, for an owner's console
 * client. Who calls comes from the launch token alone.
 */
interface AgentRequestSender
{
    /**
     * @param  array<string, mixed>  $body
     *
     * @throws AgentRequestFailed
     */
    public function send(string $path, array $body): AgentReply;
}
