<?php

declare(strict_types=1);

namespace App\Support;

use App\Values\SelectedDriver;
use App\Values\StackTarget;

/**
 * A running agent session someone may talk to: the session, its agent's display name and the stack it targets, the
 * driver and model it was started with, the actual model (not reported by current adapters), and the native
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
