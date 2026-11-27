<?php

declare(strict_types=1);

namespace App\Pages;

use App\Agents\Drivers\Contracts\NativePartProvider;
use App\Declarations\Page;
use App\Declarations\PageActions;
use App\Http\Controllers\Sharing\ApproveShareRequestController;
use App\Http\Controllers\Sharing\ConfigureShareGatewayController;
use App\Http\Controllers\Sharing\CreateShareController;
use App\Http\Controllers\Sharing\DisableShareGatewayController;
use App\Http\Controllers\Sharing\MakeShareGatewayDefaultController;
use App\Http\Controllers\Sharing\RefreshShareScopeController;
use App\Http\Controllers\Sharing\RetryShareController;
use App\Http\Controllers\Sharing\RevealShareLinkController;
use App\Http\Controllers\Sharing\RevokeShareController;
use App\Http\Controllers\Sharing\SharePreviewController;
use App\Http\Pages\Sharing\Resolvers\GatewaySettingsResolver;
use App\Http\Pages\Sharing\Resolvers\ShareDetailResolver;
use App\Http\Pages\Sharing\Resolvers\ShareListResolver;
use App\Http\Pages\Sharing\Resolvers\SharePreviewResolver;
use App\Navigation\Contracts\PageProvider;
use App\Navigation\Declarations\DomainClient;
use App\Navigation\Enums\Icon;
use App\Records\Contracts\TypeProvider;
use App\Records\Enums\ShareRelationType;
use App\Sharing\Data\GatewayConfigurePartData;
use App\Sharing\Data\GatewayRevisionData;
use App\Sharing\Data\RootShareData;
use App\Sharing\Data\SavedSharePreviewData;
use App\Sharing\Data\ShareAuditData;
use App\Sharing\Data\ShareAuditEntryData;
use App\Sharing\Data\ShareCandidateData;
use App\Sharing\Data\ShareControlsPartData;
use App\Sharing\Data\ShareFiltersData;
use App\Sharing\Data\ShareLinkData;
use App\Sharing\Data\ShareMemberData;
use App\Sharing\Data\SharePreviewData;
use App\Sharing\Data\ShareProposalStatusData;
use App\Sharing\Data\ShareRowData;
use App\Sharing\Data\ShareRuntimeData;
use App\Sharing\Enums\GatewayEndpointStatus;
use App\Sharing\Enums\GatewayOperationType;
use App\Sharing\Enums\GatewayOutcome;
use App\Sharing\Enums\ShareAuditActor;
use App\Sharing\Enums\ShareAuditType;
use App\Sharing\Enums\ShareStatus;
use App\Sharing\Support\SharingOwnerCheck;

/**
 * The pages Core's Sharing declares, for the owner alone, at /sharing: the list of shares and proposals, one share with
 * its reveal, retry and revoke, the gateway settings with configure, default and disable, and the preview of sharing
 * one record, which confirms, approves or refreshes.
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
            GatewayEndpointStatus::class,
            GatewayOperationType::class,
            GatewayOutcome::class,
            ShareAuditActor::class,
            ShareAuditType::class,
            ShareRelationType::class,
            ShareStatus::class,
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
                ->actions(fn (PageActions $actions) => $actions
                    ->post('shares/{share}/link', RevealShareLinkController::class, 'reveal-share-link')
                    ->post('shares/{share}/retry', RetryShareController::class, 'retry-share')
                    ->delete('shares/{share}', RevokeShareController::class, 'revoke-share')),
            Page::layout('gateways', 'Share gateways', Icon::Docs, GatewaySettingsResolver::class)
                ->at('gateways')
                ->visibleWhen(SharingOwnerCheck::class)
                ->actions(fn (PageActions $actions) => $actions
                    ->post('gateways', ConfigureShareGatewayController::class, 'configure-share-gateway')
                    ->post(
                        'gateways/{configuration}/default',
                        MakeShareGatewayDefaultController::class,
                        'make-share-gateway-default',
                    )
                    ->delete(
                        'gateways/{configuration}',
                        DisableShareGatewayController::class,
                        'disable-share-gateway',
                    )),
            Page::make('share-preview', 'Share', Icon::Docs, SharePreviewResolver::class, 'SharePreview.vue')
                ->at('{reference}')
                ->visibleWhen(SharingOwnerCheck::class)
                ->actions(fn (PageActions $actions) => $actions
                    ->post('{reference}/previews', SharePreviewController::class, 'save-share-preview')
                    ->post('{reference}/shares', CreateShareController::class, 'create-share')
                    ->post(
                        'shares/{share}/approval',
                        ApproveShareRequestController::class,
                        'approve-share-request',
                    )
                    ->post(
                        'shares/{share}/scope',
                        RefreshShareScopeController::class,
                        'refresh-share-scope',
                    )),
        ];
    }

    /**
     * The sharing pages under their own key, sharing, as checked with the domains' declarations.
     */
    public function declarations(): DomainClient
    {
        return DomainClient::ofCore($this, 'Sharing', 'sharing');
    }
}
