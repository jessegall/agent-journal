<?php

declare(strict_types=1);

namespace App\Support\Inputs\Values;

final readonly class HookIdentity
{
    public function __construct(
        public string $agentId,
        public string $sessionId,
        public string $hookId,
        public string $inputDigest,
    ) {}
}
