<?php

declare(strict_types=1);

namespace Domain\Tasks\Api;

use App\Attributes\Api\Endpoint;
use Spatie\LaravelData\Attributes\Validation\Present;
use App\Contracts\Domains\ApiPayload;
use App\Processes\Enums\ApiEffect;
use App\Support\NumberedPage;
use Domain\Tasks\Data\AssignedTaskListData;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * Lists the tasks assigned to the caller, searched, by state, one page at a time.
 *
 * @implements ApiPayload<AssignedTaskListData>
 */
#[MapName(SnakeCaseMapper::class)]
#[Endpoint('tasks/assigned', 'POST', AssignedTaskListData::class, ApiEffect::Read)]
final class ListAssignedTasksPayload extends Data implements ApiPayload
{
    /**
     * @param  list<string>  $states
     */
    public function __construct(
        #[Max(200)]
        public readonly string|null $search = null,
        #[Present]
        public readonly array $states = [],
        #[Min(1)]
        public readonly int $page = 1,
        #[Min(1), Max(NumberedPage::LARGEST_SIZE)]
        public readonly int $perPage = 20,
    ) {}
}
