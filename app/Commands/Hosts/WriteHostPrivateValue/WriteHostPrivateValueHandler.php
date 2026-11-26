<?php

declare(strict_types=1);

namespace App\Commands\Hosts\WriteHostPrivateValue;

use App\Contracts\Bus\CommandHandler;
use App\Enums\Hosts\HostOrderType;
use App\Support\Hosts\HostOrderPlacement;
use App\Support\PrivateValues;

final readonly class WriteHostPrivateValueHandler implements CommandHandler
{
    public function __construct(private HostOrderPlacement $placement, private PrivateValues $values) {}

    public function handle(WriteHostPrivateValueCommand $command): string
    {
        $order = $this->placement->forProcess($command->processId, $command->source, HostOrderType::WritePrivate, [
            'submission' => $command->submissionId,
        ]);

        $this->values->bindTo($command->submissionId, $order->host_id);

        return $order->getKey();
    }
}
