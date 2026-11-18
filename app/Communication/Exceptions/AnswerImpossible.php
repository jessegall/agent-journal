<?php

declare(strict_types=1);

namespace App\Communication\Exceptions;

use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * An ask whose sender cannot receive the answer or whose recipient cannot send one.
 */
final class AnswerImpossible extends RuntimeException implements CommandRefusal
{
    public static function forAsk(): self
    {
        return new self('This message cannot ask for an answer: the recipient cannot reply, or you cannot receive the reply.');
    }
}
