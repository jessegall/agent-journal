<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Agents\Commands\HoldAgentStack\HoldAgentStackCommand as HoldAgentStack;
use App\Bus\ConsoleOwner;
use App\Bus\Contracts\CommandBus;
use App\Exceptions\ConsoleOwnerMissing;
use App\Values\StackTarget;
use Illuminate\Console\Command;

/**
 * The owner keeps an agent's stack of one session and its hook calls past their retention, to investigate it.
 */
final class HoldAgentStackCommand extends Command
{
    protected $signature = 'agents:stack-hold {agent : The agent whose stack to keep} {session : The session of the stack}';

    protected $description = 'Keep an agent stack and its hook calls past their retention';

    /**
     * @throws ConsoleOwnerMissing
     */
    public function handle(ConsoleOwner $owner, CommandBus $commands): int
    {
        $owner->actAsOwner();

        try {
            $commands->run(new HoldAgentStack(
                new StackTarget((string) $this->argument('agent'), (string) $this->argument('session')),
            ));
        } finally {
            $owner->finish();
        }

        $this->line('Held. The stack and its hook calls are kept past their retention.');

        return self::SUCCESS;
    }
}
