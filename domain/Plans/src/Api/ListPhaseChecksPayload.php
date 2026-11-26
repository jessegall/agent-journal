<?php

declare(strict_types=1);

namespace Domain\Plans\Api;

use App\Attributes\Api\Endpoint;
use App\Contracts\Domains\ApiPayload;
use App\Processes\Enums\ApiEffect;
use Domain\Plans\Api\Concerns\NamesPlanPhase;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * Reads the checks recorded on one phase of a plan.
 *
 * @implements ApiPayload<PhaseChecks>
 */
#[MapName(SnakeCaseMapper::class)]
#[Endpoint('plans/phases/checks', 'POST', PhaseChecks::class, ApiEffect::Read)]
final class ListPhaseChecksPayload extends Data implements ApiPayload
{
    use NamesPlanPhase;

    public function __construct(
        #[Min(1)]
        public int $plan,
        #[Min(1)]
        public int $phase,
    ) {}
}
