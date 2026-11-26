<?php

declare(strict_types=1);

namespace App\Hosts\Commands\RemoveHostProcess;

use App\Bus\Contracts\CommandHandler;
use App\Hosts\Enums\HostOrderType;
use App\Hosts\HostOrderPlacement;
use App\Models\Hosts\HostProcess;
use App\Values\HostOrderSource;

final readonly class RemoveHostProcessHandler implements CommandHandler
{
    public function __construct(private HostOrderPlacement $placement) {}

    public function handle(RemoveHostProcessCommand $command): string
    {
        $process = HostProcess::findLocked($command->processId);

        return $this->placement->forHost(
            $process->host_id,
            HostOrderSource::fromJournal(),
            HostOrderType::Remove,
            ['container' => $process->containerName(), 'network' => '', 'session' => ''],
        )->getKey();
    }
}
