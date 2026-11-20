<?php

declare(strict_types=1);

namespace App\Sharing\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Sharing\Handlers\SaveSharePreviewHandler;
use App\Sharing\Policies\SharingPolicy;
use App\Sharing\Support\SavedSharePreview;

/**
 * The owner previews sharing a root with some of its linked records, under a gateway configuration or, without one,
 * the default; the saved preview lasts ten minutes.
 *
 * @extends Command<SavedSharePreview>
 */
#[HandledBy(SaveSharePreviewHandler::class)]
#[Authorize(SharingPolicy::class, AccessType::Create)]
final readonly class SaveSharePreview extends Command
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
