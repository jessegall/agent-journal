<?php

declare(strict_types=1);

namespace App\Agents\Console;

use App\Actors\Exceptions\ConsoleOwnerMissing;
use App\Agents\Commands\ReassignAgentRuntime;
use App\Bus\Contracts\CommandBus;
use App\Bus\Support\ConsoleOwner;
use Illuminate\Console\Command;

/**
 * The owner moves a lost runtime to a new process once the old one is proven stopped.
 */
final class ReassignAgentRuntimeCommand extends Command
{
    protected $signature = 'agents:runtime-reassign {agent : The agent} {session : Its session}'
        .' {--generation= : The process generation you read} {--host= : The host to move it to, its own by default}'
        .' {--proof= : How you know the old process stopped} {--reason= : Why}';

    protected $description = 'Move a lost agent runtime to a new process once the old one is proven stopped';

    /**
     * @throws ConsoleOwnerMissing
     */
    public function handle(ConsoleOwner $owner, CommandBus $commands): int
    {
        $owner->actAsOwner();
        $host = $this->option('host');

        try {
            $generation = $commands->run(new ReassignAgentRuntime(
                (string) $this->argument('agent'),
                (string) $this->argument('session'),
                (int) $this->option('generation'),
                is_string($host) ? $host : null,
                (string) $this->option('proof'),
                (string) $this->option('reason'),
            ));
        } finally {
            $owner->finish();
        }

        $this->line("Reassigned: the runtime starts again as process generation {$generation}.");

        return self::SUCCESS;
    }
}
