<?php

declare(strict_types=1);

namespace Domain\Helpers\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use Domain\Helpers\Handlers\SteerHelperHandler;
use Domain\Helpers\Policies\HelperPolicy;
use Domain\Helpers\Support\SteerReceipt;
use Spatie\LaravelData\Attributes\Validation\Required;

/**
 * Adds steering to the named helper's live job without launching, choosing a model or changing its purpose; with no
 * live job the steering is kept with the command that would carry it.
 *
 * @extends Command<SteerReceipt>
 */
#[HandledBy(SteerHelperHandler::class)]
#[Authorize(HelperPolicy::class, AccessType::Edit)]
final readonly class SteerHelper extends Command
{
    public function __construct(
        #[Required]
        public string $identityId,
        #[Required]
        public string $text,
    ) {}
}
