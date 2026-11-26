<?php

declare(strict_types=1);

namespace App\Bus\Contracts;

use App\Exceptions\ConsoleOwnerMissing;

/**
 * Runs a command on the bus as the journal's configured owner, for a console command that changes what only the
 * owner may change.
 */
interface OwnerCommands
{
    /**
     * @template TResult
     *
     * @param  Command<TResult>  $command
     * @return TResult
     *
     * @throws ConsoleOwnerMissing
     */
    public function run(Command $command): mixed;
}
