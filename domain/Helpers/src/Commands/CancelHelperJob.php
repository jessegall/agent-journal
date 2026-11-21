<?php

declare(strict_types=1);

namespace Domain\Helpers\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use Domain\Helpers\Policies\HelperPolicy;
use Spatie\LaravelData\Attributes\Validation\Required;

/**
 * Cancels the parent's own open helper job: a running attempt is stopped through Core, the helper's workspace stays
 * and the job is marked cancelled.
 *
 * @extends Command<string>
 */
#[Authorize(HelperPolicy::class, AccessType::Edit)]
final readonly class CancelHelperJob extends Command
{
    public function __construct(
        #[Required]
        public string $jobId,
        #[Required]
        public string $idempotencyKey,
    ) {}
}
