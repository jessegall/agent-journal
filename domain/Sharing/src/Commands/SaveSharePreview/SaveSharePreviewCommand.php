<?php

declare(strict_types=1);

namespace Domain\Sharing\Commands\SaveSharePreview;

use App\Attributes\Commands\Authorize;
use App\Enums\Agents\AccessType;
use Domain\Sharing\Policies\SharingPolicy;
use App\Support\Command;
use Domain\Sharing\Support\SavedSharePreview;

/**
 * The owner previews sharing a root with some of its linked records, under a gateway configuration or, without one,
 * the default; the saved preview lasts ten minutes.
 *
 * @extends Command<SavedSharePreview>
 */
#[Authorize(SharingPolicy::class, AccessType::Create)]
final readonly class SaveSharePreviewCommand extends Command
{
    /**
     * @param  list<string>  $selectedIds
     */
    public function __construct(
        public string $rootType,
        public string $rootId,
        public array $selectedIds,
        public string|null $gatewayConfigurationId = null,
    ) {}
}
