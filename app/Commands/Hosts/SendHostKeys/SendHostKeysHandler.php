<?php

declare(strict_types=1);

namespace App\Commands\Hosts\SendHostKeys;

use App\Contracts\Bus\CommandHandler;
use App\Enums\Hosts\HostOrderType;
use App\Support\Hosts\HostOrderPlacement;

/**
 * Makes the guarded key write of a running process, refused to a replaced worker.
 */
final readonly class SendHostKeysHandler implements CommandHandler
{
    public function __construct(private HostOrderPlacement $placement) {}

    public function handle(SendHostKeysCommand $command): string
    {
        return $this->placement->forProcess(
            $command->processId,
            $command->source,
            HostOrderType::WriteKeys,
            [
                'bytes' => base64_encode($command->bytes),
                'if_rows' => $command->rows->payload(),
                'if_input_generation' => $command->inputGeneration,
                'as_user' => false,
            ],
            HostOrderPlacement::KEY_SECONDS,
        )->getKey();
    }
}
