<?php

declare(strict_types=1);

namespace App\Hosts\Commands\OpenHostPrivateEntry;

use App\Bus\Contracts\CommandHandler;
use App\Hosts\Protocol\HostInstructions;
use App\Hosts\Protocol\Payloads\HostPrivateEntryPayload;

final readonly class OpenHostPrivateEntryHandler implements CommandHandler
{
    /**
     * How long a private entry stays open with no close: one forgotten, because its worker died or its instruction was
     * lost, ends by itself on the host and takes no value after it.
     */
    private const int DEADLINE_MS = 60_000;

    public function __construct(private HostInstructions $instructions) {}

    public function handle(OpenHostPrivateEntryCommand $command): string
    {
        return $this->instructions->openPrivate(
            $command->processId,
            $command->source,
            HostPrivateEntryPayload::from(['deadline_ms' => self::DEADLINE_MS]),
        )->getKey();
    }
}
