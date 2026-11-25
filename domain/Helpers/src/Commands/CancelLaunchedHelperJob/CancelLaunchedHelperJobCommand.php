<?php

declare(strict_types=1);

namespace Domain\Helpers\Commands\CancelLaunchedHelperJob;

use App\Attributes\Authorize;
use App\Enums\Agents\AccessType;
use App\Support\Command;
use Domain\Helpers\Policies\HelperPolicy;
use Spatie\LaravelData\Attributes\Validation\Required;

/**
 * Cancels an open helper job whose launch Core cancelled. Run by the journal after the cancellation committed.
 *
 * @extends Command<null>
 */
#[Authorize(HelperPolicy::class, AccessType::Edit)]
final readonly class CancelLaunchedHelperJobCommand extends Command
{
    public function __construct(
        #[Required]
        public string $jobId,
    ) {}
}
