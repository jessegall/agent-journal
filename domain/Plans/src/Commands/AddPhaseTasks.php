<?php

declare(strict_types=1);

namespace Domain\Plans\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use Domain\Plans\Policies\PlanPolicy;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;

/**
 * Puts tasks, named by id, at the end of a phase in the order given.
 *
 * @extends Command<null>
 */
#[Authorize(PlanPolicy::class, AccessType::Create)]
final readonly class AddPhaseTasks extends Command
{
    public const int MAX_TASKS = 100;

    /**
     * @param  list<string>  $taskIds
     */
    public function __construct(
        public string $phaseId,
        public int $expectedRevision,
        #[Min(1)]
        #[Max(self::MAX_TASKS)]
        public array $taskIds,
    ) {}
}
