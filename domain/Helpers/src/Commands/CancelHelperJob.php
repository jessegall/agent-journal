<?php

declare(strict_types=1);

namespace Domain\Helpers\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\Operation;
use App\Bus\Contracts\AuthorizedCommand;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use Domain\Helpers\Enums\HelperAbility;
use Domain\Helpers\Handlers\CancelHelperJobHandler;
use Domain\Helpers\Models\HelperJob;
use Domain\Helpers\Policies\HelperPolicy;
use Spatie\LaravelData\Attributes\Validation\Required;

/**
 * Cancels the parent's own open helper job: a running attempt is stopped through Core, the helper's workspace stays
 * and the job is marked cancelled.
 *
 * @extends Command<string>
 */
#[HandledBy(CancelHelperJobHandler::class)]
#[Authorize(HelperPolicy::class, HelperAbility::Dispatch)]
#[Operation('cancel_helper_job', ResourceAreaType::JournalWork, AccessType::Edit)]
final readonly class CancelHelperJob extends Command implements AuthorizedCommand
{
    public function __construct(
        #[Required]
        public string $jobId,
        #[Required]
        public string $idempotencyKey,
    ) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return HelperJob::class;
    }
}
