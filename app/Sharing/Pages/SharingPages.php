<?php

declare(strict_types=1);

namespace App\Sharing\Pages;

use App\Sharing\Http\Controllers\ApproveShareRequestController;
use App\Sharing\Http\Controllers\ConfigureShareGatewayController;
use App\Sharing\Http\Controllers\CreateShareController;
use App\Sharing\Http\Controllers\DisableShareGatewayController;
use App\Sharing\Http\Controllers\MakeShareGatewayDefaultController;
use App\Sharing\Http\Controllers\RefreshShareScopeController;
use App\Sharing\Http\Controllers\RetryShareController;
use App\Sharing\Http\Controllers\RevealShareLinkController;
use App\Sharing\Http\Controllers\RevokeShareController;
use App\Sharing\Http\Controllers\SharePreviewController;
use App\Sharing\Resolvers\GatewaySettingsResolver;
use App\Sharing\Resolvers\ShareDetailResolver;
use App\Sharing\Resolvers\ShareListResolver;
use App\Sharing\Resolvers\SharePreviewResolver;
use App\Sharing\Support\SharingOwnerCheck;
use App\Ui\Contracts\PageProvider;
use App\Ui\Declarations\ActionRoute;
use App\Ui\Declarations\DomainUi;
use App\Ui\Declarations\Page;
use App\Ui\Enums\Icon;

/**
 * The pages Core's Sharing declares, for the owner alone, under /sharing: the list of shares and proposals, one share
 * with its reveal, retry and revoke, the gateway settings with configure, default and disable, and the preview of
 * sharing one record, which confirms, approves or refreshes.
 */
final class SharingPages implements PageProvider
{
    public function pages(): array
    {
        return [
            Page::make('shares', 'Shares', Icon::Docs, ShareListResolver::class, 'SharesWindow.vue')
                ->at('')
                ->visibleWhen(SharingOwnerCheck::class),
            Page::make('share', 'Share', Icon::Docs, ShareDetailResolver::class, 'ShareWindow.vue')
                ->at('shares/{share}')
                ->visibleWhen(SharingOwnerCheck::class)
                ->actions(
                    ActionRoute::post('shares/{share}/link', RevealShareLinkController::class, 'reveal-share-link'),
                    ActionRoute::post('shares/{share}/retry', RetryShareController::class, 'retry-share'),
                    ActionRoute::delete('shares/{share}', RevokeShareController::class, 'revoke-share'),
                ),
            Page::make(
                'gateways',
                'Share gateways',
                Icon::Docs,
                GatewaySettingsResolver::class,
                'GatewaySettingsWindow.vue',
            )
                ->at('gateways')
                ->visibleWhen(SharingOwnerCheck::class)
                ->actions(
                    ActionRoute::post('gateways', ConfigureShareGatewayController::class, 'configure-share-gateway'),
                    ActionRoute::post(
                        'gateways/{configuration}/default',
                        MakeShareGatewayDefaultController::class,
                        'make-share-gateway-default',
                    ),
                    ActionRoute::delete(
                        'gateways/{configuration}',
                        DisableShareGatewayController::class,
                        'disable-share-gateway',
                    ),
                ),
            Page::make('share-preview', 'Share', Icon::Docs, SharePreviewResolver::class, 'SharePreview.vue')
                ->at('{reference}')
                ->visibleWhen(SharingOwnerCheck::class)
                ->actions(
                    ActionRoute::post('{reference}/previews', SharePreviewController::class, 'save-share-preview'),
                    ActionRoute::post('{reference}/shares', CreateShareController::class, 'create-share'),
                    ActionRoute::post(
                        'shares/{share}/approval',
                        ApproveShareRequestController::class,
                        'approve-share-request',
                    ),
                    ActionRoute::post(
                        'shares/{share}/scope',
                        RefreshShareScopeController::class,
                        'refresh-share-scope',
                    ),
                ),
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
