<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Bus\ConsoleOwner;
use App\Bus\Contracts\CommandBus;
use App\Exceptions\ConsoleOwnerMissing;
use App\Projects\Commands\RevokeProjectBinding\RevokeProjectBindingCommand as RevokeProjectBinding;
use Illuminate\Console\Command;

/**
 * Revokes one connected folder as the journal's owner, the same as its Disconnect on the Connections page: its binding
 * and its host, such as a folder a scenario recording connected for one run.
 */
final class RevokeBindingCommand extends Command
{
    protected $signature = 'connections:revoke {binding : The binding id of the connected folder}';

    protected $description = 'Revoke one connected folder and its host as the owner';

    /**
     * @throws ConsoleOwnerMissing
     */
    public function handle(ConsoleOwner $owner, CommandBus $commands): int
    {
        $owner->actAsOwner();
        $commands->run(new RevokeProjectBinding($this->bindingId()));
        $this->line("The connected folder {$this->bindingId()} is revoked.");

        return self::SUCCESS;
    }

    /**
     * The binding argument, which the signature makes a required single value.
     */
    private function bindingId(): string
    {
        return $this->argument('binding');
    }
}
