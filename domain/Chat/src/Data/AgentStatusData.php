<?php

declare(strict_types=1);

namespace Domain\Chat\Data;

use App\Agents\Enums\SessionState;
use App\Agents\Support\AgentStatus;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * An agent's status as the bar, the picker, the chat and the session dialog show it: the state, its words, why a
 * start was refused and its one next step, the operation it follows, a refused command beside the current session,
 * how old the host's last report is and what the viewer may do now.
 *
 * @method static static from(array<string, mixed> $status)
 */
#[TypeScript]
final class AgentStatusData extends Data
{
    /**
     * @param  list<StatusActionData>  $actions
     */
    public function __construct(
        public readonly SessionState $sessionState,
        public readonly string $label,
        public readonly string|null $reason,
        public readonly string|null $remedy,
        public readonly StatusOperationData|null $operation,
        public readonly string|null $commandOutcome,
        public readonly int|null $observationAgeSeconds,
        #[DataCollectionOf(StatusActionData::class)]
        public readonly array $actions,
        // Whether the host confirmed the session's process exists, whatever it does now.
        public readonly bool $isProcessConfirmed,
    ) {}

    public static function fromAgentStatus(AgentStatus $status): self
    {
        return self::from([
            'sessionState' => $status->sessionState,
            'label' => $status->label,
            'reason' => $status->reason,
            'remedy' => $status->remedy,
            'operation' => $status->operation,
            'commandOutcome' => $status->commandOutcome,
            'observationAgeSeconds' => $status->observationAgeSeconds,
            'actions' => $status->actions,
            'isProcessConfirmed' => $status->isProcessConfirmed,
        ]);
    }
}
