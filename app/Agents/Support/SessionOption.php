<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Agents\Values\SelectedDriver;
use App\Agents\Values\StackTarget;

/**
 * A running agent session someone may talk to: the session, its agent's display name and the stack it targets, the
 * program and model it was started with, the actual model (not reported by current adapters), and the native
 * conversation it is in with how many conversation visits it made.
 */
final readonly class SessionOption
{
    public function __construct(
        public string $sessionId,
        public string $agentName,
        public StackTarget $target,
        public SelectedDriver $selection,
        public string $actualModel,
        public string|null $conversationNativeId,
        public int $visitCount,
    ) {}
}
