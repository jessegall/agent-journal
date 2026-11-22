<?php

declare(strict_types=1);

namespace Domain\Plans\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\CodedRefusal;
use App\Contracts\CommandRefusal;
use App\Enums\RefusalCode;
use RuntimeException;
use Symfony\Component\HttpFoundation\Response;

/**
 * An edit made against a revision or a state of the plan that is no longer its latest; the newer plan stays.
 */
final class PlanRevisionChanged extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function for(int $number, int $expected, int $current): self
    {
        return new self(
            sprintf(
                'Plan %s is at revision %s, not %s; read it again with plans_read and change that revision.',
                $number,
                $current,
                $expected,
            ),
        );
    }

    public static function inState(int $number, string $state): self
    {
        return new self("Plan {$number} changed since you read it: it is now {$state}; read it again to decide.");
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
