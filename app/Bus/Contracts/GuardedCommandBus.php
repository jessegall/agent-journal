<?php

declare(strict_types=1);

namespace App\Bus\Contracts;

use App\Bus\Enums\CommandOriginStatus;
use Closure;

/**
 * Runs an application command only if its origin remains eligible under the command transaction's locks.
 */
interface GuardedCommandBus
{
    /**
     * @param  Command<mixed>  $command
     * @param  Closure(): CommandOriginStatus  $check
     */
    public function runGuarded(Command $command, Closure $check): CommandOriginStatus;
}
