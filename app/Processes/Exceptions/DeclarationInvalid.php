<?php

declare(strict_types=1);

namespace App\Processes\Exceptions;

use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * A declaration file was refused before anything was stored; the message names each field that is wrong.
 */
final class DeclarationInvalid extends RuntimeException implements CommandRefusal
{
    /**
     * @param  list<string>  $fields  one line per field: its path and what is wrong with it
     */
    private function __construct(string $message, public readonly array $fields)
    {
        parent::__construct($message);
    }

    /**
     * @param  list<string>  $fields
     */
    public static function fields(array $fields): self
    {
        return new self('The declarations are refused: '.implode('; ', $fields), $fields);
    }

    public static function notJson(string $reason): self
    {
        return new self("The declarations are not JSON: {$reason}", ['declarations']);
    }
}
