<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Contracts\Bus\Command;

/**
 * Runs a command on the bus under a request key of its own, or the given one to send the same request again, and
 * forgets the key afterwards, as the web's middleware does after each request.
 */
trait RunsKeyedCommands
{
    /**
     * @template TResult
     *
     * @param  Command<TResult>  $command
     * @return TResult
     */
    protected function runOnBus(Command $command, string|null $key = null): mixed
    {
        return $this->journal->run($command, $key);
    }
}
