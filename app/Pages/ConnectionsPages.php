<?php

declare(strict_types=1);

namespace App\Pages;

use App\Agents\Drivers\Contracts\NativePartProvider;
use App\Agents\Enums\ChildRole;
use App\Connections\ConnectionsOwnerCheck;
use App\Connections\Data\BindingListData;
use App\Connections\Data\BindingProviderData;
use App\Connections\Data\ConnectProjectWindowData;
use App\Connections\Data\DeviceApprovalData;
use App\Connections\Data\EnvironmentOptionData;
use App\Connections\Data\FileCommentData;
use App\Connections\Data\FileThreadData;
use App\Connections\Data\FileWindowData;
use App\Connections\Data\InstallAttemptListData;
use App\Connections\Data\InstallAttemptRowData;
use App\Connections\Data\JoinTargetData;
use App\Connections\Data\ProjectBindingRowData;
use App\Connections\Data\ProjectTreeEntryData;
use App\Connections\Data\ProjectWindowData;
use App\Connections\Data\ReleaseOfferData;
use App\Connections\Data\ReleaseTargetData;
use App\Connections\Data\SupportRecordRowData;
use App\Connections\Data\TerminalSignInRowData;
use App\Connections\Enums\BindingReadiness;
use App\Connections\Enums\CommandRunStatus;
use App\Connections\Enums\ConnectionAuditActor;
use App\Connections\Enums\ConnectionAuditType;
use App\Connections\Enums\FileWindowStatus;
use App\Declarations\Page;
use App\Http\Pages\Resolvers\ConnectProjectWindowResolver;
use App\Http\Pages\Resolvers\DeviceApprovalWindowResolver;
use App\Http\Pages\Resolvers\FileWindowResolver;
use App\Http\Pages\Resolvers\ProjectWindowResolver;
use App\Navigation\Contracts\NavigationProvider;
use App\Navigation\Contracts\PageProvider;
use App\Navigation\Declarations\DomainClient;
use App\Navigation\Declarations\NavigationItem;
use App\Navigation\Enums\Icon;
use App\Projects\Enums\DeviceGrantStatus;
use App\Projects\Enums\InstallAttemptStatus;
use App\Projects\Enums\InvitationMode;
use App\Projects\Enums\ProjectWindowStatus;
use App\Records\Contracts\TypeProvider;
use App\Web\Enums\WindowPlace;

/**
 * The pages Core's Connections declares, for the owner alone, under /connections: the Connect a project window.
 */
final class ConnectionsPages implements NativePartProvider, NavigationProvider, PageProvider, TypeProvider
{
    /**
     * The Connected projects part Settings draws from the window's own data.
     *
     * @return list<string>
     */
    public function nativeParts(): array
    {
        return ['ConnectedProjectsPart.vue'];
    }

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
            CommandRunStatus::class,
            ConnectionAuditActor::class,
            ConnectionAuditType::class,
            DeviceGrantStatus::class,
            FileWindowStatus::class,
            InstallAttemptStatus::class,
            InvitationMode::class,
            ProjectWindowStatus::class,
        ];
    }

    /**
     * The Connections pages under their own key, connections, as checked with the domains' declarations.
     */
    public function declarations(): DomainClient
    {
        return DomainClient::ofCore($this, 'Connections', 'connections');
    }
}
