<?php

declare(strict_types=1);

namespace Domain\Helpers\Commands\SendHelper;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Projects\Contracts\ProjectCommand;
use App\Support\Command;
use App\Values\ProjectOwner;
use Domain\Helpers\Policies\HelperPolicy;
use Domain\Helpers\Values\HelperReceipt;
use Domain\Helpers\Values\HelperWork;
use Spatie\LaravelData\Attributes\Validation\Required;

/**
 * Gives new work in the project to the one helper identity the caller names there and starts it; the work is never
 * redirected to another helper.
 *
 * @extends Command<HelperReceipt>
 */
#[Authorize(HelperPolicy::class, AccessType::Create)]
final readonly class SendHelperCommand extends Command implements ProjectCommand
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
        public string $projectId,
    ) {}

    public function owner(): ProjectOwner
    {
        return ProjectOwner::ofProject($this->projectId);
    }
}
