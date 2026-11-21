<?php

declare(strict_types=1);

namespace Domain\Documents\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use Domain\Documents\Models\Document;
use Domain\Documents\Policies\ReportPolicy;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Required;

/**
 * Settles a report with the reason it needs no more attention.
 *
 * @extends Command<null>
 */
#[Authorize(ReportPolicy::class, AccessType::Edit)]
final readonly class CloseReport extends Command
{
    public function __construct(
        public string $reportReference,
        #[Required, Max(Document::SETTLEMENT_REASON_CHARACTER_LIMIT)]
        public string $reason,
    ) {}
}
