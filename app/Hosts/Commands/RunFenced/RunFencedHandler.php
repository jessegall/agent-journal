<?php

declare(strict_types=1);

namespace App\Hosts\Commands\RunFenced;

use App\Bus\Contracts\CommandHandler;
use App\Hosts\Protocol\HostInstructions;
use App\Hosts\Protocol\Payloads\HostFencedPlanPayload;
use App\Hosts\Values\FencedRun;
use App\Values\HostInstructionSource;

/**
 * Makes the run_fenced instruction of the host and answers its id.
 */
final readonly class RunFencedHandler implements CommandHandler
{
    public function __construct(private HostInstructions $instructions) {}

    public function handle(RunFencedCommand $command): string
    {
        $plan = HostFencedPlanPayload::from([
            'fence' => $command->fence,
            'waiting' => $command->waiting,
            'budget_ms' => $command->budgetMs,
            'runs' => array_map(fn (FencedRun $run) => $run->plan(), $command->runs),
        ]);

        return $this->instructions->runFenced($command->hostId, HostInstructionSource::fromJournal(), $plan)->getKey();
    }
}
