<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Commands\ReleaseAgentHold\ReleaseAgentHoldCommand as ReleaseAgentHold;
use App\Contracts\CommandBus;
use App\Enums\HoldReason;
use App\Exceptions\ConsoleOwnerMissing;
use App\Support\ConsoleOwner;
use Illuminate\Console\Command;

/**
 * The owner releases the interrupt or the call for attention they read on an agent's runtime.
 */
final class ReleaseAgentHoldCommand extends Command
{
    protected $signature = 'agents:hold-release {agent : The agent} {session : Its session} {--hold= : The hold you read, such as interrupted} {--reason= : Why}';

    protected $description = 'Release an interrupt or a call for attention on an agent runtime';

    /**
     * @throws ConsoleOwnerMissing
     */
    public function handle(ConsoleOwner $owner, CommandBus $commands): int
    {
        $owner->actAsOwner();

        try {
            $commands->run(new ReleaseAgentHold(
                (string) $this->argument('agent'),
                (string) $this->argument('session'),
                HoldReason::from((string) $this->option('hold')),
                (string) $this->option('reason'),
            ));
        } finally {
            $owner->finish();
        }

        $this->line('Released.');

        return self::SUCCESS;
    }
}
