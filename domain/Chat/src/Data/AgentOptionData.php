<?php

declare(strict_types=1);

namespace Domain\Chat\Data;

use App\Agents\Enums\AgentAction;
use App\Agents\Enums\AgentPresence;
use App\Agents\Enums\DriverSwitchStage;
use App\Agents\Support\AgentOption;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * An agent Home lists, live or idle, with the actions it offers now.
 *
 * @method static static from(array<string, mixed> $agent)
 */
#[TypeScript]
final class AgentOptionData extends Data
{
    /**
     * @param  list<AgentAction>  $actions
     * @param  list<ResumableConversationData>  $conversations
     */
    public function __construct(
        public readonly string $id,
        public readonly string $name,
        public readonly string $profileKey,
        public readonly bool $retired,
        public readonly AgentPresence $presence,
        public readonly string $presenceLabel,
        public readonly string|null $sessionId,
        public readonly int $sessionGeneration,
        public readonly bool $hasTerminal,
        public readonly string|null $switchId,
        public readonly DriverSwitchStage|null $switchStage,
        // How the switch's stage reads on screen, and whether it is over; none without a switch.
        public readonly string|null $switchStageLabel,
        public readonly bool $isSwitchOver,
        public readonly array $actions,
        #[DataCollectionOf(ResumableConversationData::class)]
        public readonly array $conversations,
        // Why the host could not start the agent's session, such as a program that cannot start in a container.
        public readonly string|null $startRefusal,
    ) {}

    public static function fromAgentOption(AgentOption $agent): self
    {
        return self::from([
            'id' => $agent->agentId,
            'name' => $agent->name,
            'profileKey' => $agent->profileKey,
            'retired' => $agent->retired,
            'presence' => $agent->presence,
            'presenceLabel' => $agent->presence->label(),
            'sessionId' => $agent->sessionId,
            'sessionGeneration' => $agent->sessionGeneration,
            'hasTerminal' => $agent->hasTerminal,
            'switchId' => $agent->switchId,
            'switchStage' => $agent->switchStage,
            'switchStageLabel' => $agent->switchStage?->label(),
            'isSwitchOver' => $agent->switchStage?->isFinal() ?? true,
            'actions' => $agent->actions,
            'conversations' => $agent->conversations,
            'startRefusal' => $agent->startRefusal,
        ]);
    }
}
