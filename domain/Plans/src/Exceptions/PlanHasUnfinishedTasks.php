<?php

declare(strict_types=1);

namespace Domain\Plans\Exceptions;

use App\Bus\Contracts\CodedRefusal;
use App\Bus\Enums\RefusalCode;
use App\Bus\Exceptions\Concerns\RendersRefusal;
use App\Contracts\CommandRefusal;
use RuntimeException;
use Symfony\Component\HttpFoundation\Response;

/**
 * A finish of a plan that is not started, or whose tasks still need work.
 */
final class PlanHasUnfinishedTasks extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function for(int $number, int $unfinished): self
    {
        return new self("Plan {$number} still has {$unfinished} unfinished tasks; finish or cancel them first.");
    }

    public static function notStarted(int $number, string $state): self
    {
        return new self("Plan {$number} is {$state}; only a started plan is finished.");
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::StateBlocked;
    }

    protected function status(): int
    {
        return Response::HTTP_CONFLICT;
    }
}
