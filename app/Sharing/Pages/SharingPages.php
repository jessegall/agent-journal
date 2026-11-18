<?php

declare(strict_types=1);

namespace App\Sharing\Pages;

use App\Sharing\Http\Controllers\SharePreviewController;
use App\Sharing\Readers\SharePreviewReader;
use App\Sharing\Support\SharingOwnerCheck;
use App\Ui\Contracts\ProvidesPages;
use App\Ui\Declarations\ActionRoute;
use App\Ui\Declarations\DomainUi;
use App\Ui\Declarations\Page;
use App\Ui\Enums\Icon;

/**
 * The pages Core's Sharing declares, for the owner alone: the preview of sharing one record, at /sharing.
 */
final class SharingPages implements ProvidesPages
{
    public function pages(): array
    {
        return [
            Page::make('share-preview', 'Share', Icon::Docs, SharePreviewReader::class, 'SharePreview.vue')
                ->at('{reference}')
                ->visibleWhen(SharingOwnerCheck::class)
                ->actions(ActionRoute::post('{reference}/previews', SharePreviewController::class, 'save-share-preview')),
        ];
    }

    /**
     * Sharing's pages under its own key, sharing, as checked with the domains' declarations.
     */
    public function declarations(): DomainUi
    {
        return DomainUi::of($this, 'Sharing', 'App\\Sharing', dirname(__DIR__).'/Resources/js');
    }
}
