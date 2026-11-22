<?php

declare(strict_types=1);

namespace Domain\Helpers\Commands\SendHelper;

use App\Attributes\Authorize;
use App\Enums\AccessType;
use App\Support\Command;
use Domain\Helpers\Policies\HelperPolicy;
use Domain\Helpers\Values\HelperReceipt;
use Domain\Helpers\Values\HelperWork;
use Spatie\LaravelData\Attributes\Validation\Required;

/**
 * Gives new work to the one helper identity the caller names and launches it; the work is never redirected to
 * another helper.
 *
 * @extends Command<HelperReceipt>
 */
#[Authorize(HelperPolicy::class, AccessType::Create)]
final readonly class SendHelperCommand extends Command
{
    public function __construct(
        #[Required]
        public string $requestId,
        #[Required]
        public string $identityId,
        #[Required]
        public string $profileKey,
        #[Required]
        public string $model,
        public string|null $driverKey,
        public HelperWork $work,
    ) {}
}
