<?php

declare(strict_types=1);

namespace App\AgentRequests\Exceptions;

use Throwable;

/**
 * The journal answered, but the answer does not read as the call's declared answer. The message names the call and
 * the field, never the token, the signature or the body.
 */
final class AnswerUnreadable extends CallFailed
{
    /**
     * @param  class-string  $call
     */
    public static function at(string $call, string $field, Throwable|null $previous = null): self
    {
        return new self("The answer to {$call} could not be read at {$field}.", 0, $previous);
    }
}
