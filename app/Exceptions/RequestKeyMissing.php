<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\Bus\CommandRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Enums\RefusalCode;
use App\Support\CommandName;
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
        $name = CommandName::of($command);

        return new self(
            sprintf(
                '%s runs only under a request key: send a new UUID or ULID as the Idempotency-Key header, or as request_key.',
                $name,
            ),
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
