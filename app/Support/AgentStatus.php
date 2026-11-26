<?php

declare(strict_types=1);

namespace App\Support;

use App\Sessions\Enums\SessionActivityStatus;

/**
 * One agent's status as every screen shows it, decided from its evidence in order: retirement, an accepted stop or
 * unresolved delivery, a blocking hold of the current process, then start progress and activity. A refused or failed
 * command stays beside the session until replaced or dismissed.
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
