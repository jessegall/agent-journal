<?php

declare(strict_types=1);

namespace App\Pages;

use App\Contracts\Drivers\NativePartProvider;
use App\Contracts\Navigation\PageProvider;
use App\Contracts\Records\TypeProvider;
use App\Data\Sharing\GatewayConfigurePartData;
use App\Data\Sharing\GatewayRevisionData;
use App\Data\Sharing\RootShareData;
use App\Data\Sharing\SavedSharePreviewData;
use App\Data\Sharing\ShareAuditData;
use App\Data\Sharing\ShareAuditEntryData;
use App\Data\Sharing\ShareCandidateData;
use App\Data\Sharing\ShareControlsPartData;
use App\Data\Sharing\ShareFiltersData;
use App\Data\Sharing\ShareLinkData;
use App\Data\Sharing\ShareMemberData;
use App\Data\Sharing\SharePreviewData;
use App\Data\Sharing\ShareProposalStatusData;
use App\Data\Sharing\ShareRowData;
use App\Data\Sharing\ShareRuntimeData;
use App\Declarations\ActionRoute;
use App\Declarations\DomainUi;
use App\Declarations\Page;
use App\Enums\GatewayEndpointState;
use App\Enums\GatewayOperationType;
use App\Enums\GatewayOutcome;
use App\Enums\Icon;
use App\Enums\ShareAuditActor;
use App\Enums\ShareAuditType;
use App\Enums\ShareRelationType;
use App\Enums\ShareState;
use App\Http\Controllers\ApproveShareRequestController;
use App\Http\Controllers\ConfigureShareGatewayController;
use App\Http\Controllers\CreateShareController;
use App\Http\Controllers\DisableShareGatewayController;
use App\Http\Controllers\MakeShareGatewayDefaultController;
use App\Http\Controllers\RefreshShareScopeController;
use App\Http\Controllers\RetryShareController;
use App\Http\Controllers\RevealShareLinkController;
use App\Http\Controllers\RevokeShareController;
use App\Http\Controllers\SharePreviewController;
use App\Http\Pages\Resolvers\GatewaySettingsResolver;
use App\Http\Pages\Resolvers\ShareDetailResolver;
use App\Http\Pages\Resolvers\ShareListResolver;
use App\Http\Pages\Resolvers\SharePreviewResolver;
use App\Support\SharingOwnerCheck;

/**
 * The pages Core's Sharing declares, for the owner alone, under /sharing: the list of shares and proposals, one share
 * with its reveal, retry and revoke, the gateway settings with configure, default and disable, and the preview of
 * sharing one record, which confirms, approves or refreshes.
 */
final class SharingPages implements NativePartProvider, PageProvider, TypeProvider
{
    /**
     * The data classes and enums these pages own, generated in the sharing module.
     */
    public function types(): array
    {
        return [
            GatewayConfigurePartData::class,
            GatewayRevisionData::class,
            RootShareData::class,
            SavedSharePreviewData::class,
            ShareAuditData::class,
            ShareAuditEntryData::class,
            ShareCandidateData::class,
            ShareControlsPartData::class,
            ShareFiltersData::class,
            ShareLinkData::class,
            ShareMemberData::class,
            SharePreviewData::class,
            ShareProposalStatusData::class,
            ShareRowData::class,
            ShareRuntimeData::class,
            GatewayEndpointState::class,
            GatewayOperationType::class,
            GatewayOutcome::class,
            ShareAuditActor::class,
            ShareAuditType::class,
            ShareRelationType::class,
            ShareState::class,
        ];
    }

    /**
     * The native parts the share layouts mount: a share's direct controls, its gateway's runtime and its audit, and the
     * form that configures a gateway.
     *
     * @return list<string>
     */
    public function nativeParts(): array
    {
        return [
            'AuditSection.vue',
            'GatewayConfigureForm.vue',
            'RuntimeSection.vue',
            'ShareControls.vue',
        ];
    }

    public function pages(): array
    {
        return [
            Page::layout('shares', 'Shares', Icon::Docs, ShareListResolver::class)
                ->at('')
                ->visibleWhen(SharingOwnerCheck::class),
            Page::layout('share', 'Share', Icon::Docs, ShareDetailResolver::class)
                ->at('shares/{share}')
                ->visibleWhen(SharingOwnerCheck::class)
                ->actions(
                    ActionRoute::post('shares/{share}/link', RevealShareLinkController::class, 'reveal-share-link'),
                    ActionRoute::post('shares/{share}/retry', RetryShareController::class, 'retry-share'),
                    ActionRoute::delete('shares/{share}', RevokeShareController::class, 'revoke-share'),
                ),
            Page::layout('gateways', 'Share gateways', Icon::Docs, GatewaySettingsResolver::class)
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
        return DomainUi::ofCore($this, 'Sharing', 'sharing');
    }
}
