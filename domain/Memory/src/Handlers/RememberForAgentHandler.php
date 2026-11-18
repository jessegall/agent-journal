<?php

declare(strict_types=1);

namespace Domain\Memory\Handlers;

use Domain\Memory\Commands\RememberForAgent;
use Domain\Memory\Models\Memory;

final readonly class RememberForAgentHandler
{
    public function handle(RememberForAgent $command): string
    {
        $memory = new Memory(['text' => $command->text, 'weight' => $command->weight]);
        $memory->saveFor($command->agentId);

        return $memory->id;
    }
}
