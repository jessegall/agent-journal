<?php

declare(strict_types=1);

namespace Domain\Helpers\Commands;

use App\Bus\Attributes\Operation;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Bus\Support\Command;
use Domain\Helpers\Enums\HelperAbility;
use Domain\Helpers\Handlers\SendHelperHandler;
use Domain\Helpers\Models\HelperJob;
use Domain\Helpers\Policies\HelperPolicy;
use Domain\Helpers\Support\HelperReceipt;
use Domain\Helpers\Support\HelperWork;
use Spatie\LaravelData\Attributes\Validation\Required;

/**
 * Gives new work to the one helper identity the caller names and launches it; the work is never redirected to
 * another helper.
 *
 * @extends Command<HelperReceipt>
 */
#[HandledBy(SendHelperHandler::class)]
#[Authorize(HelperPolicy::class, HelperAbility::Dispatch)]
#[Operation('send_helper', ResourceAreaType::JournalWork, AccessType::Create)]
final readonly class SendHelper extends Command implements HasAuthorizationSubject
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
        public string|null $programKey,
        public HelperWork $work,
    ) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return HelperJob::class;
    }
}
