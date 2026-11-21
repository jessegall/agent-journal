<?php

declare(strict_types=1);

namespace Domain\Helpers\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use Domain\Helpers\Policies\HelperPolicy;
use Domain\Helpers\Values\HelperReceipt;
use Domain\Helpers\Values\HelperWork;
use Spatie\LaravelData\Attributes\Validation\Required;

/**
 * Gives new work to one of the caller's helpers of a profile, the best one that may take it or a new one, on the
 * model it names or the profile's default, and launches it.
 *
 * @extends Command<HelperReceipt>
 */
#[Authorize(HelperPolicy::class, AccessType::Create)]
final readonly class StartHelper extends Command
{
    public function __construct(
        #[Required]
        public string $requestId,
        #[Required]
        public string $profileKey,
        #[Required]
        public string $model,
        public string|null $driverKey,
        public HelperWork $work,
    ) {}
}
