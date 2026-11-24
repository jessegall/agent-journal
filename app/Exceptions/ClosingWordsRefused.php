<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Contracts\Bus\CommandRefusal;
use RuntimeException;

/**
 * Closing words that cannot be delivered, with the reason.
 */
final class ClosingWordsRefused extends RuntimeException implements CommandRefusal
{
    public static function noOffer(): self
    {
        return new self('No closing words wait to be delivered: they are offered only when you stop with them.');
    }

    public static function nothingRead(): self
    {
        return new self('You read no message yet, so there is no inbox to deliver your closing words into.');
    }
}
