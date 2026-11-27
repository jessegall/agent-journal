<?php

declare(strict_types=1);

namespace App\Hosts\Commands\ReadHostFolderAnswer;

use App\Bus\Contracts\CommandHandler;
use App\Exceptions\HostProtocolRefused;
use App\Models\Hosts\HostInstruction;
use App\Values\HostFolderAnswer;

/**
 * Answers the state of the host's own folder instruction; an instruction of another host is refused.
 */
final readonly class ReadHostFolderAnswerHandler implements CommandHandler
{
    public function handle(ReadHostFolderAnswerCommand $command): HostFolderAnswer
    {
        $instruction = HostInstruction::query()->whereKey($command->instructionId)->firstOrFail();

        if ($instruction->host_id !== $command->hostId) {
            throw HostProtocolRefused::foreignInstruction($command->hostId, $command->instructionId);
        }

        return HostFolderAnswer::of($instruction);
    }
}
