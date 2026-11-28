<?php

declare(strict_types=1);

namespace Domain\Chat\Data;

use App\Agents\Drivers\Enums\DriverSwitchStage;
use App\Agents\Enums\AgentAction;
use App\Agents\Enums\AgentPresence;
use App\Support\HomeAgent;
use Domain\Chat\Support\AgentChatSummary;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * An agent Home lists, live or idle, with the actions it offers now and its chat with the viewer as the chat list shows
 * it.
 *
 * @method static static from(array<string, mixed>|HomeAgent $agent, AgentChatSummary ...$activity)
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
        public readonly bool $isRetired,
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
        // Why the host could not start the agent's session, such as a driver that cannot start in a container.
        public readonly string|null $startRefusal,
        // What the agent is doing now, the words for it and what may be done, decided from all its evidence at once.
        public readonly AgentStatusData $status,
        // The driver the live session runs, which a switch names as its source; none without a session.
        public readonly string|null $sessionDriver,
        public readonly string|null $sessionDriverLabel,
        // The model and effort the live session runs on; none without a session.
        public readonly string|null $sessionModel,
        public readonly string|null $sessionEffort,
        // Whether the current runtime waits at a driver menu only its user can answer, such as folder trust or
        // first-run setup; the notice it raises names this session and generation.
        public readonly bool $needsAttention,
        // A main agent coordinates the journal's work; any number of agents may be one.
        public readonly bool $isMain,
        // The viewer's unread messages in its chat, and when that chat last moved; none while it holds nothing.
        public readonly int $unreadCount,
        public readonly string|null $lastActiveAt,
        // Whether a question of it waits for the viewer's answer.
        public readonly bool $waitsOnYou,
    ) {}

    public static function fromAgentOption(HomeAgent $agent, AgentChatSummary $activity): self
    {
        return self::from([
            'id' => $agent->agentId,
            'name' => $agent->name,
            'profileKey' => $agent->profileKey,
            'isRetired' => $agent->isRetired,
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
            'status' => $agent->status,
            'sessionDriver' => $agent->sessionDriver,
            'sessionDriverLabel' => $agent->sessionDriverLabel,
            'sessionModel' => $agent->sessionModel,
            'sessionEffort' => $agent->sessionEffort,
            'needsAttention' => $agent->hold->needsAttentionInDriver(),
            'isMain' => $activity->isMain,
            'unreadCount' => $activity->unreadCount,
            'lastActiveAt' => $activity->lastActiveAt?->toIso8601String(),
            'waitsOnYou' => $activity->waitsOnYou,
        ]);
    }
}
