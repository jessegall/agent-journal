<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Exceptions\CommandNotRegistered;

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
     */
    public function run(Command $command): mixed;
}
