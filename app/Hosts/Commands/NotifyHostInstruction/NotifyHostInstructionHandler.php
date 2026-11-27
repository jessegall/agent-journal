<?php

declare(strict_types=1);

namespace App\Hosts\Commands\NotifyHostInstruction;

use App\Bus\Contracts\CommandHandler;
use App\Exceptions\HostProtocolRefused;
use App\Hosts\HostCallReader;
use App\Hosts\Protocol\HostAnswerStatus;
use App\Hosts\Protocol\Payloads\HostAnswerPayload;
use App\Models\Hosts\HostInstruction;
use App\Time\Contracts\ServerClock;

/**
 * Stores the host's answer on its instruction; an answer to another host's instruction is refused.
 */
final readonly class NotifyHostInstructionHandler implements CommandHandler
{
    public function __construct(private ServerClock $clock, private HostCallReader $reader) {}

    public function handle(NotifyHostInstructionCommand $command): void
    {
        $instruction = HostInstruction::findLocked($command->instructionId);

        if ($instruction->host_id !== $command->hostId) {
            throw HostProtocolRefused::foreignInstruction($command->hostId, $instruction->id);
        }

        $answer = HostAnswerPayload::from(json_decode($command->answer, true, flags: JSON_THROW_ON_ERROR));

        // A done answer carries the instruction's reply as its facts, read as strictly as the answer itself.
        if ($answer->status === HostAnswerStatus::Done) {
            $reply = json_encode($answer->facts, JSON_THROW_ON_ERROR);
            $this->reader->read($reply, $instruction->type->replyPayload(), "reply to {$instruction->type->value}");
        }

        $instruction->answer($answer, $this->clock->now());
    }
}
