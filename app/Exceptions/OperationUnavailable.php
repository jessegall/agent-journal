<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\Bus\CommandRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Enums\Engine\RefusalCode;
use App\Exceptions\Concerns\ThrowsLater;
use RuntimeException;
use Symfony\Component\HttpFoundation\Response;

/**
 * No write of the caller under this request key: never made, rolled back, pruned or another caller's.
 */
final class OperationUnavailable extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    /**
     * @use ThrowsLater<OperationUnavailable>
     */
    use ThrowsLater;

    public static function for(string $key): self
    {
        return new self(
            sprintf(
                'No write of this session has the request_key %s; one that was rolled back left none and may be sent again.',
                $key,
            ),
        );
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::RecordUnavailable;
    }

    protected function status(): int
    {
        return Response::HTTP_NOT_FOUND;
    }
}
