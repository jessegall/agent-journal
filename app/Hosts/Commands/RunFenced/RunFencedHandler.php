<?php

declare(strict_types=1);

namespace App\Hosts\Commands\RunFenced;

use App\Bus\Contracts\CommandHandler;
use App\Hosts\Enums\HostOrderType;
use App\Hosts\HostOrderPlacement;
use App\Hosts\Values\FencedRun;
use App\Values\HostOrderSource;

/**
 * Makes the run_fenced order of the host and answers its id.
 */
final readonly class RunFencedHandler implements CommandHandler
{
    public function __construct(private HostOrderPlacement $placement) {}

    public function handle(RunFencedCommand $command): string
    {
        $payload = [
            'fence' => $command->fence,
            'waiting' => $command->waiting,
            'budget_ms' => $command->budgetMs,
            'runs' => array_map(fn (FencedRun $run) => $run->payload(), $command->runs),
        ];

        return $this->placement->forHost(
            $command->hostId,
            HostOrderSource::fromJournal(),
            HostOrderType::RunFenced,
            $payload,
        )->getKey();
    }
}
