<?php

declare(strict_types=1);

namespace App\Pages;

use App\Contracts\Drivers\NativePartProvider;
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
use App\Declarations\DomainClient;
use App\Declarations\NavigationItem;
use App\Declarations\Page;
use App\Enums\Agents\ChildRole;
use App\Enums\Connections\BindingReadiness;
use App\Enums\Connections\CommandRunStatus;
use App\Enums\Connections\ConnectionAuditActor;
use App\Enums\Connections\ConnectionAuditType;
use App\Enums\Connections\FileWindowStatus;
use App\Enums\Navigation\Icon;
use App\Enums\Projects\DeviceGrantStatus;
use App\Enums\Projects\InstallAttemptStatus;
use App\Enums\Projects\InvitationMode;
use App\Enums\Projects\ProjectWindowStatus;
use App\Enums\Web\WindowPlace;
use App\Http\Pages\Resolvers\ConnectProjectWindowResolver;
use App\Http\Pages\Resolvers\DeviceApprovalWindowResolver;
use App\Http\Pages\Resolvers\FileWindowResolver;
use App\Http\Pages\Resolvers\ProjectWindowResolver;
use App\Support\ConnectionsOwnerCheck;

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
