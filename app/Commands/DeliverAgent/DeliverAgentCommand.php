<?php

declare(strict_types=1);

namespace App\Commands\DeliverAgent;

use App\Attributes\Authorize;
use App\Contracts\AgentStackCommand;
use App\Contracts\MessagePart;
use App\Data\MessagePartData;
use App\Enums\AccessType;
use App\Policies\AgentPolicy;
use App\Support\Command;
use App\Values\DriverReceipt;
use App\Values\StackTarget;

/**
 * Delivers content to an agent's runtime, in order behind its earlier requests.
 *
 * @extends Command<DriverReceipt>
 */
#[Authorize(AgentPolicy::class, AccessType::Edit)]
final readonly class DeliverAgentCommand extends Command implements AgentStackCommand
{
    /**
     * @param  list<MessagePart>  $parts
     */
    public function __construct(
        public string $agentId,
        public string $sessionId,
        public string $idempotencyKey,
        public array $parts,
    ) {}

    /**
     * The delivery of one text.
     */
    public static function text(string $agentId, string $sessionId, string $idempotencyKey, string $text): self
    {
        return new self($agentId, $sessionId, $idempotencyKey, [MessagePartData::forText($text)]);
    }

    /**
     * Every text the parts carry, as the delivery budget counts them.
     */
    public function textBytes(): int
    {
        return array_sum(array_map(fn (MessagePart $part): int => strlen($part->text()), $this->parts));
    }

    public function target(): StackTarget
    {
        return new StackTarget($this->agentId, $this->sessionId);
    }
}
