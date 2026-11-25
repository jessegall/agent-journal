<?php

declare(strict_types=1);

namespace Domain\Sharing;

use App\Contracts\Authorization\PolicyProvider;
use App\Contracts\Bus\CommandProvider;
use App\Contracts\Drivers\NativePartProvider;
use App\Enums\Agents\AccessType;
use App\Support\Command;
use App\Support\Domain;
use App\Support\Exports;
use App\Support\FolderClasses;
use App\Values\PolicyDefinition;
use Domain\Sharing\Policies\ShareRequestPolicy;
use Domain\Sharing\Policies\SharingPolicy;
use App\Contracts\Navigation\PageProvider;
use App\Contracts\Records\TypeProvider;
use Domain\Sharing\Data\GatewayConfigurePartData;
use Domain\Sharing\Data\GatewayRevisionData;
use Domain\Sharing\Data\RootShareData;
use Domain\Sharing\Data\SavedSharePreviewData;
use Domain\Sharing\Data\ShareAuditData;
use Domain\Sharing\Data\ShareAuditEntryData;
use Domain\Sharing\Data\ShareCandidateData;
use Domain\Sharing\Data\ShareControlsPartData;
use Domain\Sharing\Data\ShareFiltersData;
use Domain\Sharing\Data\ShareLinkData;
use Domain\Sharing\Data\ShareMemberData;
use Domain\Sharing\Data\SharePreviewData;
use Domain\Sharing\Data\ShareProposalStatusData;
use Domain\Sharing\Data\ShareRowData;
use Domain\Sharing\Data\ShareRuntimeData;
use App\Declarations\ActionRoute;
use App\Declarations\Page;
use App\Enums\Navigation\Icon;
use Domain\Sharing\Enums\GatewayEndpointState;
use Domain\Sharing\Enums\GatewayOperationType;
use Domain\Sharing\Enums\GatewayOutcome;
use Domain\Sharing\Enums\ShareAuditActor;
use Domain\Sharing\Enums\ShareAuditType;
use App\Enums\Sharing\ShareRelationType;
use Domain\Sharing\Enums\ShareState;
use Domain\Sharing\Http\Controllers\ApproveShareRequestController;
use Domain\Sharing\Http\Controllers\ConfigureShareGatewayController;
use Domain\Sharing\Http\Controllers\CreateShareController;
use Domain\Sharing\Http\Controllers\DisableShareGatewayController;
use Domain\Sharing\Http\Controllers\MakeShareGatewayDefaultController;
use Domain\Sharing\Http\Controllers\RefreshShareScopeController;
use Domain\Sharing\Http\Controllers\RetryShareController;
use Domain\Sharing\Http\Controllers\RevealShareLinkController;
use Domain\Sharing\Http\Controllers\RevokeShareController;
use Domain\Sharing\Http\Controllers\SharePreviewController;
use Domain\Sharing\Http\Pages\Resolvers\GatewaySettingsResolver;
use Domain\Sharing\Http\Pages\Resolvers\ShareDetailResolver;
use Domain\Sharing\Http\Pages\Resolvers\ShareListResolver;
use Domain\Sharing\Http\Pages\Resolvers\SharePreviewResolver;
use Domain\Sharing\Support\SharingOwnerCheck;

/**
 * Public sharing: an owner shares records through a gateway as read-only links. Its pages, for the owner alone, are
 * the list of shares and proposals, one share with its reveal, retry and revoke, the gateway settings with configure,
 * default and disable, and the preview of sharing one record, which confirms, approves or refreshes.
 */
final class SharingDomain extends Domain implements
    CommandProvider,
    NativePartProvider,
    PageProvider,
    PolicyProvider,
    TypeProvider
{
    public function description(): string
    {
        return 'Public read-only links to records an owner shares through a gateway, with their previews, approvals '
            .'and audit.';
    }

    /**
     * @return list<class-string<Domain>>
     */
    public function requires(): array
    {
        return [];
    }

    public function exports(): Exports
    {
        return Exports::make()->build();
    }

    public function commands(): array
    {
        return FolderClasses::in(__DIR__.'/Commands/*', Command::class);
    }

    public function policies(): array
    {
        return [
            new PolicyDefinition(SharingPolicy::class, [AccessType::Create, AccessType::Edit]),
            new PolicyDefinition(ShareRequestPolicy::class, [AccessType::Create]),
        ];
    }

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
}
