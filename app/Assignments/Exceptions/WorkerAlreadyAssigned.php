<?php

declare(strict_types=1);

namespace App\Assignments\Exceptions;

use App\Bus\Contracts\CodedRefusal;
use App\Bus\Enums\RefusalCode;
use App\Bus\Exceptions\Concerns\RendersRefusal;
use App\Contracts\CommandRefusal;
use RuntimeException;
use Symfony\Component\HttpFoundation\Response;

/**
 * A worker already holds another unit of work, so no second unit is given to it; the dispatcher chooses another.
 */
final class WorkerAlreadyAssigned extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function holding(string $rootType): self
    {
        return new self("Worker already assigned: it holds another {$rootType} as its unit of work.");
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::Conflict;
    }

    protected function status(): int
    {
        return Response::HTTP_CONFLICT;
    }
}
