<?php

declare(strict_types=1);

namespace App\AgentRequests\Support;

/**
 * The journal's answer to a signed call that succeeded: its decoded JSON body.
 */
final readonly class AgentReply
{
    /**
     * @param  array<string, mixed>  $body
     */
    public function __construct(public array $body) {}
}
