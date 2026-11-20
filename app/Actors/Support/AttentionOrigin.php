<?php

declare(strict_types=1);

namespace App\Actors\Support;

/**
 * An attention request and its source, such as a receipt, hook, navigation operation or event dispatch.
 * Its type and id derive a stable wake key for each actor.
 */
final readonly class AttentionOrigin
{
    public const string MESSAGE = 'message';

    public const string SEATING = 'seating';

    public const string AGENT_MESSAGE = 'agent_message';

    public const string NAVIGATION = 'navigation';

    public const string STATE_EVENT = 'state_event';

    public function __construct(
        public string $type,
        public string $id,
        public string $sourceId,
    ) {}

    public static function message(string $messageId, string $receiptId): self
    {
        return new self(self::MESSAGE, $messageId, $receiptId);
    }

    /**
     * The states' messages kept for an agent that went idle on the hook that sent them.
     */
    public static function agentMessages(string $hookId): self
    {
        return new self(self::AGENT_MESSAGE, $hookId, $hookId);
    }

    /**
     * A navigation request in one of its rounds: each round wakes the answerer once. The host's raise that opened it
     * has no bus receipt; its operation key stands in for one.
     */
    public static function navigation(string $requestId, int $round, string $raiseKey): self
    {
        return new self(self::NAVIGATION, "{$requestId}:{$round}", $raiseKey);
    }

    public static function stateEvent(string $dispatchId): self
    {
        return new self(self::STATE_EVENT, $dispatchId, $dispatchId);
    }

    public function keyFor(ActorIdentity $actor): string
    {
        return hash('sha256', "attention:{$this->type}:{$this->id}:{$actor->type->value}:{$actor->id}");
    }
}
