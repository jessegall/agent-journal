<?php

declare(strict_types=1);

namespace App\Hosts\Commands\SendHostKeys;

use App\Bus\Contracts\CommandHandler;
use App\Hosts\HostInstructionPlacement;
use App\Hosts\Protocol\HostInstructions;
use App\Hosts\Protocol\Payloads\HostKeyWritePayload;

/**
 * Makes the guarded key write of a running process, refused to a replaced worker.
 */
final readonly class SendHostKeysHandler implements CommandHandler
{
    public function __construct(private HostInstructions $instructions) {}

    public function handle(SendHostKeysCommand $command): string
    {
        return $this->instructions->writeKeys(
            $command->processId,
            $command->source,
            HostKeyWritePayload::from([
                'bytes' => base64_encode($command->bytes),
                'if_rows' => $command->rows->guard(),
                'if_input_generation' => $command->inputGeneration,
                'as_user' => false,
            ]),
            HostInstructionPlacement::KEY_SECONDS,
        )->getKey();
    }
}
