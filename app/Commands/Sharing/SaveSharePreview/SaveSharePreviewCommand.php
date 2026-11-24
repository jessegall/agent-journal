<?php

declare(strict_types=1);

namespace App\Commands\Sharing\SaveSharePreview;

use App\Attributes\Authorize;
use App\Enums\AccessType;
use App\Policies\SharingPolicy;
use App\Support\Command;
use App\Support\SavedSharePreview;

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
