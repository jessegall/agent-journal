<?php

declare(strict_types=1);

namespace App\Bus\Contracts;

use App\Bus\Exceptions\CommandNotRegistered;
use App\Bus\Exceptions\CommittedFactListenerFailed;

/**
 * Runs a command through the middleware and its handler, and gives back the handler's result.
 */
interface CommandBus
{
    /**
     * @template TResult
     *
     * @param  Command<TResult>  $command
     * @return TResult
     *
     * @throws CommandNotRegistered
     * @throws CommandRefusal
     * @throws CommittedFactListenerFailed once the command committed and a listener of one of its facts failed
     */
    public function run(Command $command): mixed;
}
