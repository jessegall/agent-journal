<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\Bus\CommandRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Enums\Engine\RefusalCode;
use InvalidArgumentException;
use Symfony\Component\HttpFoundation\Response;

/**
 * A request key that is not an opaque id of letters, digits and dashes of at most 128 characters.
 */
final class RequestKeyInvalid extends InvalidArgumentException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function for(string $key): self
    {
        $shown = mb_strimwidth($key, 0, 40, '...');

        return new self(
            "A request_key is a UUID or ULID of at most 128 letters, digits and dashes; {$shown} is not one.",
        );
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::InvalidInput;
    }

    protected function status(): int
    {
        return Response::HTTP_UNPROCESSABLE_ENTITY;
    }
}
