<?php

declare(strict_types=1);

namespace App\Commands\Hosts\RemoveHostProcess;

use App\Contracts\Bus\CommandHandler;
use App\Enums\Hosts\HostOrderType;
use App\Models\Hosts\HostProcess;
use App\Support\Hosts\HostOrderPlacement;
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
