<?php

declare(strict_types=1);

namespace App\Contracts;

use Closure;

/**
 * What a command's own code asks of the facts its transaction collects: run the required work now, hold an
 * operation's facts until it returns, and send a fact with no row to raise on through the ordered stream.
 */
interface CommandFacts
{
    /**
     * Runs the required listeners of every fact collected so far, before the code goes on to read what they wrote.
     */
    public function applyRequired(): void;

    /**
     * @template TResult
     *
     * @param  Closure(): TResult  $work
     * @return TResult
     */
    public function holdUntilReturn(Closure $work): mixed;

    public function publishAfterCommit(Event $event): void;
}
