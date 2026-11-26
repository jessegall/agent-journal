<?php

declare(strict_types=1);

namespace Domain\Plans\Exceptions;

use App\Bus\Contracts\CommandRefusal;
use App\Concerns\RendersRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Engine\Enums\RefusalCode;
use RuntimeException;
use Symfony\Component\HttpFoundation\Response;

/**
 * The suggestion to apply, or the change to undo, is no longer kept: it expired or was used.
 */
final class PlanGraphChangeMissing extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function suggestion(): self
    {
        return new self('There is no suggestion to apply any more; ask for one again.');
    }

    public static function undo(): self
    {
        return new self('There is no applied suggestion to undo any more.');
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
