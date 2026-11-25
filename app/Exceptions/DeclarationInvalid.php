<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\Bus\CommandRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Enums\Engine\RefusalCode;
use RuntimeException;
use Throwable;

/**
 * A declaration file was refused before anything was stored; the message names each field that is wrong.
 */
final class DeclarationInvalid extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    /**
     * @param  list<string>  $fields  one line per field: its path and what is wrong with it
     */
    private function __construct(string $message, public readonly array $fields, Throwable|null $previous = null)
    {
        parent::__construct($message, previous: $previous);
    }

    /**
     * @param  list<string>  $fields
     */
    public static function fields(array $fields): self
    {
        return new self('The declarations are refused: '.implode('; ', $fields), $fields);
    }

    public static function notJson(Throwable $cause): self
    {
        return new self("The declarations are not JSON: {$cause->getMessage()}", ['declarations'], $cause);
    }

    protected function status(): int
    {
        return 422;
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::InvalidInput;
    }
}
