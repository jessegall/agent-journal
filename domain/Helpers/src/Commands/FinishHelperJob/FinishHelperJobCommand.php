<?php

declare(strict_types=1);

namespace Domain\Helpers\Commands\FinishHelperJob;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Support\Command;
use Domain\Helpers\Policies\HelperPolicy;
use Spatie\LaravelData\Attributes\Validation\Required;

/**
 * Finishes an open helper job once Core certified its helper's stop, naming the stop attempt that proved it. Run by
 * the journal after the certification committed.
 *
 * @extends Command<null>
 */
#[Authorize(HelperPolicy::class, AccessType::Edit)]
final readonly class FinishHelperJobCommand extends Command
{
    public function __construct(
        #[Required]
        public string $jobId,
        #[Required]
        public string $reference,
    ) {}
}
