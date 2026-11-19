<?php

declare(strict_types=1);

namespace App\Agents\Console;

use App\Actors\Exceptions\ConsoleOwnerMissing;
use App\Agents\Commands\RetryDriverRequest;
use App\Bus\Contracts\CommandBus;
use App\Bus\Support\ConsoleOwner;
use Illuminate\Console\Command;

/**
 * The owner sends a failed or unavailable driver request again, as a new attempt.
 */
final class RetryDriverRequestCommand extends Command
{
    protected $signature = 'agents:request-retry {request : The driver request} {--row-version= : The row version you read} {--reason= : Why}';

    protected $description = 'Send a failed or unavailable driver request again';

    /**
     * @throws ConsoleOwnerMissing
     */
    public function handle(ConsoleOwner $owner, CommandBus $commands): int
    {
        $owner->actAsOwner();

        try {
            $rowVersion = $commands->run(new RetryDriverRequest(
                (string) $this->argument('request'),
                (int) $this->option('row-version'),
                (string) $this->option('reason'),
            ));
        } finally {
            $owner->finish();
        }

        $this->line("Sent again. Its row version is now {$rowVersion}.");

        return self::SUCCESS;
    }
}
