<?php

declare(strict_types=1);

namespace Domain\Helpers\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use Domain\Helpers\Policies\HelperPolicy;
use Spatie\LaravelData\Attributes\Validation\Required;

/**
 * Holds an open helper job for repair once its helper failed its final checks the same way three times, and tells
 * the parent. Run by the journal after the hold committed.
 *
 * @extends Command<null>
 */
#[Authorize(HelperPolicy::class, AccessType::Edit)]
final readonly class HoldHelperJob extends Command
{
    public function __construct(
        #[Required]
        public string $jobId,
        #[Required]
        public string $reference,
    ) {}
}
