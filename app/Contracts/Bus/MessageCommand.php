<?php

declare(strict_types=1);

namespace App\Contracts\Bus;

/**
 * A command that acts on one message the caller names by its id, such as dismissing it or releasing its claim.
 *
 * @template TResult
 *
 * @extends Command<TResult>
 */
interface MessageCommand extends Command
{
    public string $messageId { get; }
}
