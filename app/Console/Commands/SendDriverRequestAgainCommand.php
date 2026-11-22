<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Commands\SendDriverRequestAgain\SendDriverRequestAgainCommand as SendDriverRequestAgain;
use App\Contracts\Bus\CommandBus;
use App\Exceptions\ConsoleOwnerMissing;
use App\Support\ConsoleOwner;
use Illuminate\Console\Command;

/**
 * The owner sends an uncertain delivery again as a new request, confirming it may arrive twice.
 */
final class SendDriverRequestAgainCommand extends Command
{
    protected $signature = 'agents:request-send-again {request : The uncertain delivery} {--confirm-duplicate : It may arrive twice} {--reason= : Why}';

    protected $description = 'Send an uncertain delivery again as a possible duplicate';

    /**
     * @throws ConsoleOwnerMissing
     */
    public function handle(ConsoleOwner $owner, CommandBus $commands): int
    {
        $owner->actAsOwner();

        try {
            $requestId = $commands->run(new SendDriverRequestAgain(
                (string) $this->argument('request'),
                (bool) $this->option('confirm-duplicate'),
                (string) $this->option('reason'),
            ));
        } finally {
            $owner->finish();
        }

        $this->line("Sent again as request {$requestId}; it may arrive twice.");

        return self::SUCCESS;
    }
}
