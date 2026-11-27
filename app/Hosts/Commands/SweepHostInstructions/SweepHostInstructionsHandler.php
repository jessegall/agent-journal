<?php

declare(strict_types=1);

namespace App\Hosts\Commands\SweepHostInstructions;

use App\Bus\Contracts\CommandHandler;
use App\Models\Hosts\HostInstruction;
use App\Time\Contracts\ServerClock;

/**
 * Refuses the instructions that expired unclaimed or unanswered, and prunes answered ones after an hour.
 */
final readonly class SweepHostInstructionsHandler implements CommandHandler
{
    /**
     * How long an answered instruction is kept, for a worker that takes a process over to read where it stood.
     */
    public const int RETENTION_SECONDS = 3600;

    /**
     * The most instructions one sweep expires.
     */
    public const int SWEEP_LIMIT = 500;

    public function __construct(private ServerClock $clock) {}

    public function handle(SweepHostInstructionsCommand $command): void
    {
        $now = $this->clock->now();

        foreach (HostInstruction::findExpiredAt($now, self::SWEEP_LIMIT) as $instruction) {
            $instruction->expire($now);
        }

        HostInstruction::query()->answeredBefore($now->subSeconds(self::RETENTION_SECONDS))->delete();
    }
}
