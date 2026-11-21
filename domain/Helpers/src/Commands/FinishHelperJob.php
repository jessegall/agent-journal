<?php

declare(strict_types=1);

namespace Domain\Helpers\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use Domain\Helpers\Handlers\FinishHelperJobHandler;
use Domain\Helpers\Policies\HelperPolicy;
use Spatie\LaravelData\Attributes\Validation\Required;

/**
 * Finishes an open helper job once Core certified its helper's stop, naming the stop attempt that proved it. Run by
 * the journal after the certification committed.
 *
 * @extends Command<null>
 */
#[HandledBy(FinishHelperJobHandler::class)]
#[Authorize(HelperPolicy::class, AccessType::Edit)]
final readonly class FinishHelperJob extends Command
{
    public function __construct(
        #[Required]
        public string $jobId,
        #[Required]
        public string $reference,
    ) {}
}
