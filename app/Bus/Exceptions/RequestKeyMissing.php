<?php

declare(strict_types=1);

namespace App\Bus\Exceptions;

use App\Bus\Contracts\CodedRefusal;
use App\Bus\Enums\RefusalCode;
use App\Bus\Exceptions\Concerns\RendersRefusal;
use App\Contracts\CommandRefusal;
use InvalidArgumentException;
use Symfony\Component\HttpFoundation\Response;

/**
 * A command that runs only under a request key was sent without one.
 */
final class RequestKeyMissing extends InvalidArgumentException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    /**
     * @param  class-string  $command
     */
    public static function for(string $command): self
    {
        $name = class_basename($command);

        return new self(
            "{$name} runs only under a request key: send a new UUID or ULID as the Idempotency-Key header, or as "
                .'request_key.',
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
