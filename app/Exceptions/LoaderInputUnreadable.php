<?php

declare(strict_types=1);

namespace App\Exceptions;

use Illuminate\Http\Response;
use RuntimeException;
use Throwable;

/**
 * A loader call whose input header cannot be read: the browser sent something no page of the journal sends, so it is
 * answered as a bad request.
 */
final class LoaderInputUnreadable extends RuntimeException
{
    public static function tooLarge(int $mostBytes): self
    {
        return new self("A loader's input holds at most {$mostBytes} bytes.");
    }

    public static function notEncoded(): self
    {
        return new self("A loader's input is base64url UTF-8 JSON.");
    }

    public static function notACall(Throwable $cause): self
    {
        return new self(
            "A loader's input names a token of 1 to 64 letters, digits, dashes or underscores, and an input.",
            previous: $cause,
        );
    }

    public function render(): Response
    {
        return new Response($this->getMessage(), Response::HTTP_BAD_REQUEST);
    }
}
