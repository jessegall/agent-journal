<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Commands\ResolveDriverDelivery\ResolveDriverDeliveryCommand as ResolveDriverDelivery;
use App\Contracts\CommandBus;
use App\Exceptions\ConsoleOwnerMissing;
use App\Support\ConsoleOwner;
use Illuminate\Console\Command;

/**
 * The owner says, from evidence, whether an uncertain delivery arrived.
 */
final class ResolveDriverDeliveryCommand extends Command
{
    protected $signature = 'agents:request-resolve {request : The driver request} {--row-version= : The row version you read} {--reason= : Why} {--applied : It arrived; leave it out when it did not}';

    protected $description = 'Say whether an uncertain delivery arrived';

    /**
     * @throws ConsoleOwnerMissing
     */
    public function handle(ConsoleOwner $owner, CommandBus $commands): int
    {
        $owner->actAsOwner();

        try {
            $rowVersion = $commands->run(new ResolveDriverDelivery(
                (string) $this->argument('request'),
                (int) $this->option('row-version'),
                (bool) $this->option('applied'),
                (string) $this->option('reason'),
            ));
        } finally {
            $owner->finish();
        }

        $this->line("Resolved. Its row version is now {$rowVersion}.");

        return self::SUCCESS;
    }
}
