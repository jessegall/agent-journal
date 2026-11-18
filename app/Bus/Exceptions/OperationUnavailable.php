<?php

declare(strict_types=1);

namespace App\Bus\Exceptions;

use App\Bus\Contracts\CodedRefusal;
use App\Bus\Enums\RefusalCode;
use App\Bus\Exceptions\Concerns\RendersRefusal;
use App\Contracts\CommandRefusal;
use RuntimeException;
use Symfony\Component\HttpFoundation\Response;

/**
 * No write of the calling session under this request key: never made, rolled back, pruned or another session's.
 */
final class OperationUnavailable extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function for(string $key): self
    {
        return new self("No write of this session has the request_key {$key}; one that was rolled back left none and may be sent again.");
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
