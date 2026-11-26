<?php

declare(strict_types=1);

namespace Domain\Helpers\Commands\CancelStartedHelperJob;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Support\Command;
use Domain\Helpers\Policies\HelperPolicy;
use Spatie\LaravelData\Attributes\Validation\Required;

/**
 * Cancels an open helper job whose start Core cancelled. Run by the journal after the cancellation committed.
 *
 * @extends Command<null>
 */
#[Authorize(HelperPolicy::class, AccessType::Edit)]
final readonly class CancelStartedHelperJobCommand extends Command
{
    public function __construct(
        #[Required]
        public string $jobId,
    ) {}
}
