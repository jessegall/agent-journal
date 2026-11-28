<?php

declare(strict_types=1);

namespace App\Pages;

use App\Agents\Drivers\Contracts\NativePartProvider;
use App\Connections\ConnectionsOwnerCheck;
use App\Connections\Data\BindingListData;
use App\Connections\Data\BindingProviderData;
use App\Connections\Data\ConnectProjectWindowData;
use App\Connections\Data\DeviceApprovalData;
use App\Connections\Data\EnvironmentOptionData;
use App\Connections\Data\FileCommentData;
use App\Connections\Data\FilePaneData;
use App\Connections\Data\FileThreadData;
use App\Connections\Data\FileWindowData;
use App\Connections\Data\InstallAttemptListData;
use App\Connections\Data\InstallAttemptRowData;
use App\Connections\Data\JoinTargetData;
use App\Connections\Data\ProjectBindingRowData;
use App\Connections\Data\ProjectPaneData;
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
use App\Http\Pages\ConnectProjectPageBuilder;
use App\Http\Pages\DeviceApprovalPageBuilder;
use App\Http\Pages\FilePageBuilder;
use App\Http\Pages\ProjectPageBuilder;
use App\Http\Windows\FileWindowBuilder;
use App\Http\Windows\ProjectWindowBuilder;
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
            Page::build()
                ->key('connect')
                ->title('Connect a project')
                ->icon(Icon::Connections)
                ->pageType(ConnectProjectWindowData::class)
                ->pageBuilder(ConnectProjectPageBuilder::class)
                ->component('ConnectProjectWindow.vue')
                ->finish()
                ->at('')
                ->visibleWhen(ConnectionsOwnerCheck::class),
            Page::build()
                ->key('device')
                ->title('Approve a terminal')
                ->icon(Icon::Connections)
                ->pageType(DeviceApprovalData::class)
                ->pageBuilder(DeviceApprovalPageBuilder::class)
                ->component('DeviceApprovalWindow.vue')
                ->finish()
                ->at('devices/{code}')
                ->visibleWhen(ConnectionsOwnerCheck::class),
            Page::build()
                ->key('project')
                ->title('Project')
                ->icon(Icon::Project)
                ->pageType(ProjectWindowData::class)
                ->pageBuilder(ProjectPageBuilder::class)
                ->component('ProjectWindow.vue')
                ->withWindow(ProjectPaneData::class, ProjectWindowBuilder::class, 'ProjectPane.vue')
                ->finish()
                ->at('project')
                ->onHome(60)
                ->placedAs(WindowPlace::Tree)
                ->visibleWhen(ConnectionsOwnerCheck::class),
            Page::build()
                ->key('file')
                ->title('File')
                ->icon(Icon::File)
                ->pageType(FileWindowData::class)
                ->pageBuilder(FilePageBuilder::class)
                ->component('FileWindow.vue')
                ->withWindow(FilePaneData::class, FileWindowBuilder::class, 'FilePane.vue')
                ->finish()
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
            FilePaneData::class,
            ProjectPaneData::class,
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
