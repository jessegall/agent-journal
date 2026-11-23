<?php

declare(strict_types=1);

namespace App\Pages;

use App\Contracts\Navigation\NavigationProvider;
use App\Contracts\Navigation\PageProvider;
use App\Contracts\Records\TypeProvider;
use App\Data\Connections\BindingListData;
use App\Data\Connections\BindingProviderData;
use App\Data\Connections\ConnectProjectWindowData;
use App\Data\Connections\DeviceApprovalData;
use App\Data\Connections\EnvironmentOptionData;
use App\Data\Connections\FileCommentData;
use App\Data\Connections\FileThreadData;
use App\Data\Connections\FileWindowData;
use App\Data\Connections\InstallAttemptListData;
use App\Data\Connections\InstallAttemptRowData;
use App\Data\Connections\JoinTargetData;
use App\Data\Connections\ProjectBindingRowData;
use App\Data\Connections\ProjectTreeEntryData;
use App\Data\Connections\ProjectWindowData;
use App\Data\Connections\ReleaseOfferData;
use App\Data\Connections\ReleaseTargetData;
use App\Data\Connections\SupportRecordRowData;
use App\Data\Connections\TerminalSignInRowData;
use App\Declarations\DomainUi;
use App\Declarations\NavigationItem;
use App\Declarations\Page;
use App\Enums\BindingReadiness;
use App\Enums\ChildRole;
use App\Enums\CommandRunState;
use App\Enums\ConnectionAuditActor;
use App\Enums\ConnectionAuditType;
use App\Enums\DeliveryOutcome;
use App\Enums\DeviceGrantState;
use App\Enums\FileWindowState;
use App\Enums\Icon;
use App\Enums\InstallAttemptState;
use App\Enums\InvitationMode;
use App\Enums\ProjectWindowState;
use App\Enums\WindowPlace;
use App\Resolvers\ConnectProjectWindowResolver;
use App\Resolvers\DeviceApprovalWindowResolver;
use App\Resolvers\FileWindowResolver;
use App\Resolvers\ProjectWindowResolver;
use App\Support\ConnectionsOwnerCheck;

/**
 * The pages Core's Connections declares, for the owner alone, under /connections: the Connect a project window.
 */
final class ConnectionsPages implements NavigationProvider, PageProvider, TypeProvider
{
    public function pages(): array
    {
        return [
            Page::make(
                'connect',
                'Connect a project',
                Icon::Connections,
                ConnectProjectWindowResolver::class,
                'ConnectProjectWindow.vue',
            )
                ->at('')
                ->visibleWhen(ConnectionsOwnerCheck::class),
            Page::make(
                'device',
                'Approve a terminal',
                Icon::Connections,
                DeviceApprovalWindowResolver::class,
                'DeviceApprovalWindow.vue',
            )
                ->at('devices/{code}')
                ->visibleWhen(ConnectionsOwnerCheck::class),
            Page::make('project', 'Project', Icon::Project, ProjectWindowResolver::class, 'ProjectWindow.vue')
                ->at('project')
                ->onHome(60)
                ->placedAs(WindowPlace::Tree)
                ->visibleWhen(ConnectionsOwnerCheck::class),
            Page::make('file', 'File', Icon::File, FileWindowResolver::class, 'FileWindow.vue')
                ->at('file')
                ->onHome(61)
                ->placedAs(WindowPlace::Editor)
                ->visibleWhen(ConnectionsOwnerCheck::class),
        ];
    }

    /**
     * Connect a project is found in the command palette and from Settings; the sidebar draws only the design's pages.
     */
    public function navigation(): array
    {
        return [NavigationItem::page('connect', 'Connect a project', Icon::Connections, position: 50)->offSidebar()];
    }

    /**
     * The data classes and enums these pages own, generated in the connections module.
     */
    public function types(): array
    {
        return [
            BindingListData::class,
            BindingProviderData::class,
            ConnectProjectWindowData::class,
            DeviceApprovalData::class,
            EnvironmentOptionData::class,
            FileCommentData::class,
            FileThreadData::class,
            FileWindowData::class,
            InstallAttemptListData::class,
            InstallAttemptRowData::class,
            JoinTargetData::class,
            ProjectBindingRowData::class,
            ProjectTreeEntryData::class,
            ProjectWindowData::class,
            ReleaseOfferData::class,
            ReleaseTargetData::class,
            SupportRecordRowData::class,
            TerminalSignInRowData::class,
            BindingReadiness::class,
            ChildRole::class,
            CommandRunState::class,
            ConnectionAuditActor::class,
            ConnectionAuditType::class,
            DeliveryOutcome::class,
            DeviceGrantState::class,
            FileWindowState::class,
            InstallAttemptState::class,
            InvitationMode::class,
            ProjectWindowState::class,
        ];
    }

    /**
     * The Connections pages under their own key, connections, as checked with the domains' declarations.
     */
    public function declarations(): DomainUi
    {
        return DomainUi::ofCore($this, 'Connections', 'connections');
    }
}
