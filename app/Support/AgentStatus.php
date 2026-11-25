<?php

declare(strict_types=1);

namespace App\Support;

use App\Enums\Sessions\SessionActivityStatus;

/**
 * One agent's status as the bar, the picker, the conversation and the session dialog all show it, decided from its evidence
 * in a fixed order: retirement, then an accepted stop or unresolved delivery, then a fresh blocking hold of the current
 * process, then start progress and fresh activity. Session existence alone proves neither idle nor working; a
 * refused or failed command stays beside the current session until a newer one replaces it or the viewer dismisses it.
 * Whether the host confirmed the session's process exists is told apart from what the process does.
 */
final readonly class AgentStatus
{
    /**
     * @param  list<StatusAction>  $actions
     */
    public function __construct(
        public SessionActivityStatus $sessionState,
        public string $label,
        public string|null $reason,
        public string|null $remedy,
        public StatusOperation|null $operation,
        public string|null $commandOutcome,
        public int|null $observationAgeSeconds,
        public array $actions,
        public bool $isProcessConfirmed = false,
    ) {}
}
