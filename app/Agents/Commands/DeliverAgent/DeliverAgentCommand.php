<?php

declare(strict_types=1);

namespace App\Agents\Commands\DeliverAgent;

use App\Agents\Drivers\Contracts\MessagePart;
use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Bus\Contracts\AgentStackCommand;
use App\Messages\Data\MessageTextData;
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
        return new self($agentId, $sessionId, $idempotencyKey, [new MessageTextData($text)]);
    }

    /**
     * Every text the parts carry, as the delivery budget counts them.
     */
    public function textBytes(): int
    {
        return array_sum(array_map(fn (MessagePart $part) => $part->textBytes(), $this->parts));
    }

    public function target(): StackTarget
    {
        return new StackTarget($this->agentId, $this->sessionId);
    }
}
