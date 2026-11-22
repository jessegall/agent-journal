<?php

declare(strict_types=1);

namespace Domain\Helpers\Commands\CancelHelperJob;

use App\Attributes\Authorize;
use App\Enums\AccessType;
use App\Support\Command;
use Domain\Helpers\Policies\HelperPolicy;
use Spatie\LaravelData\Attributes\Validation\Required;

/**
 * Cancels the parent's own open helper job: a running attempt is stopped through Core, the helper's workspace stays
 * and the job is marked cancelled.
 *
 * @extends Command<string>
 */
#[Authorize(HelperPolicy::class, AccessType::Edit)]
final readonly class CancelHelperJobCommand extends Command
{
    public function __construct(
        #[Required]
        public string $jobId,
        #[Required]
        public string $idempotencyKey,
    ) {}
}
