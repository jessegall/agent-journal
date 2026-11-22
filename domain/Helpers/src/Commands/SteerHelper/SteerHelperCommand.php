<?php

declare(strict_types=1);

namespace Domain\Helpers\Commands\SteerHelper;

use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use Domain\Helpers\Policies\HelperPolicy;
use Domain\Helpers\Values\SteerReceipt;
use Spatie\LaravelData\Attributes\Validation\Required;

/**
 * Adds steering to the named helper's live job without launching, choosing a model or changing its purpose; with no
 * live job the steering is kept with the command that would carry it.
 *
 * @extends Command<SteerReceipt>
 */
#[Authorize(HelperPolicy::class, AccessType::Edit)]
final readonly class SteerHelperCommand extends Command
{
    public function __construct(
        #[Required]
        public string $identityId,
        #[Required]
        public string $text,
    ) {}
}
