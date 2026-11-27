<?php

declare(strict_types=1);

namespace App\Hosts\Commands\WriteHostPrivateValue;

use App\Bus\Contracts\CommandHandler;
use App\Hosts\Protocol\HostInstructions;
use App\Hosts\Protocol\Payloads\HostPrivateWritePayload;
use App\Terminals\PrivateValues;

final readonly class WriteHostPrivateValueHandler implements CommandHandler
{
    public function __construct(private HostInstructions $instructions, private PrivateValues $values) {}

    public function handle(WriteHostPrivateValueCommand $command): string
    {
        $instruction = $this->instructions->writePrivate(
            $command->processId,
            $command->source,
            HostPrivateWritePayload::from(['submission' => $command->submissionId]),
        );

        $this->values->bindTo($command->submissionId, $instruction->host_id);

        return $instruction->getKey();
    }
}
