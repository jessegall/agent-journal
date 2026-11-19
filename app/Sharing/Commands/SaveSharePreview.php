<?php

declare(strict_types=1);

namespace App\Sharing\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Sharing\Handlers\SaveSharePreviewHandler;
use App\Sharing\Support\SavedSharePreview;

/**
 * The owner previews sharing a root with some of its linked records, under a gateway configuration or, without one,
 * the default; the saved preview lasts ten minutes.
 *
 * @implements Command<SavedSharePreview>
 */
#[HandledBy(SaveSharePreviewHandler::class)]
final readonly class SaveSharePreview implements Command
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
