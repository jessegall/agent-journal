<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Agents\Contracts\CurrentSession;
use App\Agents\Enums\AgentRole;
use App\Bus\Contracts\CallerSession;
use Illuminate\Container\Attributes\Scoped;
use Illuminate\Contracts\Container\Container;

/**
 * The session of the signed agent call this request carries, read from its agent context.
 */
#[Scoped]
final readonly class RequestSession implements CallerSession, CurrentSession
{
    public function __construct(private Container $container) {}

    public function sessionId(): string
    {
        return $this->container->make(AgentContext::class)->sessionId;
    }

    public function isMainAgent(): bool
    {
        return $this->container->make(AgentContext::class)->role === AgentRole::MainAgent->value;
    }
}
