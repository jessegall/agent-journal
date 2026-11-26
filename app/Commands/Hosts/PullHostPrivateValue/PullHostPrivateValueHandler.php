<?php

declare(strict_types=1);

namespace App\Commands\Hosts\PullHostPrivateValue;

use App\Contracts\Bus\CommandHandler;
use App\Support\PrivateValues;

final readonly class PullHostPrivateValueHandler implements CommandHandler
{
    public function __construct(private PrivateValues $values) {}

    public function handle(PullHostPrivateValueCommand $command): string
    {
        return $this->values->pull($command->submissionId, $command->hostId);
    }
}
