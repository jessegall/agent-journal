<?php

declare(strict_types=1);

namespace Domain\Plans\Calls;

use App\Attributes\Endpoint;
use App\Contracts\JournalCall;
use App\Enums\CallEffect;
use Domain\Plans\Calls\Concerns\NamesPlanPhase;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * Reads the checks recorded on one phase of a plan.
 *
 * @implements JournalCall<PhaseChecks>
 */
#[MapName(SnakeCaseMapper::class)]
#[Endpoint('plans/phases/checks', 'POST', PhaseChecks::class, CallEffect::Read)]
final class ListPhaseChecksCall extends Data implements JournalCall
{
    use NamesPlanPhase;

    public function __construct(
        #[Min(1)]
        public int $plan,
        #[Min(1)]
        public int $phase,
    ) {}
}
