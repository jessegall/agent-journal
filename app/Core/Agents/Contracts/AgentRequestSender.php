<?php

declare(strict_types=1);

namespace App\Core\Agents\Contracts;

use App\Core\Agents\Exceptions\AgentRequestFailed;
use App\Core\Agents\Support\AgentReply;

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
