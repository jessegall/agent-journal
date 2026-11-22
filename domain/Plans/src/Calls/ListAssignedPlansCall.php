<?php

declare(strict_types=1);

namespace Domain\Plans\Calls;

use App\Attributes\Endpoint;
use App\Attributes\PresentList;
use App\Contracts\Domains\JournalCall;
use App\Enums\CallEffect;
use App\Support\NumberedPage;
use Domain\Plans\Data\AssignedPlanListData;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * Lists the plans assigned to the caller, searched, by state, one page at a time.
 *
 * @implements JournalCall<AssignedPlanListData>
 */
#[MapName(SnakeCaseMapper::class)]
#[Endpoint('plans/assigned', 'POST', AssignedPlanListData::class, CallEffect::Read)]
final class ListAssignedPlansCall extends Data implements JournalCall
{
    /**
     * @param  list<string>  $states
     */
    public function __construct(
        #[Max(200)]
        public string|null $search = null,
        #[PresentList]
        public array $states = [],
        #[Min(1)]
        public int $page = 1,
        #[Min(1), Max(NumberedPage::LARGEST_SIZE)]
        public int $perPage = 20,
    ) {}
}
