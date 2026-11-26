<?php

declare(strict_types=1);

namespace App\Hosts\Commands\PullHostPrivateValue;

use App\Bus\Contracts\CommandHandler;
use App\Terminals\PrivateValues;

final readonly class PullHostPrivateValueHandler implements CommandHandler
{
    public function __construct(private PrivateValues $values) {}

    public function handle(PullHostPrivateValueCommand $command): string
    {
        return $this->values->pull($command->submissionId, $command->hostId);
    }
}
