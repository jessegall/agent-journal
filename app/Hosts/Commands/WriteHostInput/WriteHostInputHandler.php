<?php

declare(strict_types=1);

namespace App\Hosts\Commands\WriteHostInput;

use App\Bus\Contracts\CommandHandler;
use App\Hosts\Protocol\HostInstructions;
use App\Hosts\Protocol\Payloads\HostStdinWritePayload;

/**
 * Makes the stdin write of a running pipe process, refused to a replaced worker and to a terminal process.
 */
final readonly class WriteHostInputHandler implements CommandHandler
{
    public function __construct(private HostInstructions $instructions) {}

    public function handle(WriteHostInputCommand $command): string
    {
        return $this->instructions->writeStdin(
            $command->processId,
            $command->source,
            HostStdinWritePayload::from(['bytes' => base64_encode($command->bytes)]),
        )->getKey();
    }
}
