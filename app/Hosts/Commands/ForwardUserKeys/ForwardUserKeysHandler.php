<?php

declare(strict_types=1);

namespace App\Hosts\Commands\ForwardUserKeys;

use App\Bus\Contracts\CommandHandler;
use App\Hosts\HostInstructionPlacement;
use App\Hosts\Protocol\HostInstructions;
use App\Hosts\Protocol\Payloads\HostKeyWritePayload;
use App\Models\Hosts\HostProcess;

/**
 * Makes the user's key write of a running terminal process and raises its input generation, so the journal's next
 * guarded write carries the generation the host now holds.
 */
final readonly class ForwardUserKeysHandler implements CommandHandler
{
    public function __construct(private HostInstructions $instructions) {}

    public function handle(ForwardUserKeysCommand $command): string
    {
        $instruction = $this->instructions->writeKeys(
            $command->processId,
            $command->source,
            HostKeyWritePayload::from([
                'bytes' => base64_encode($command->bytes),
                'if_rows' => null,
                'if_input_generation' => null,
                'as_user' => true,
            ]),
            HostInstructionPlacement::KEY_SECONDS,
        );

        HostProcess::findLocked($command->processId)->raiseInputGeneration();

        return $instruction->getKey();
    }
}
