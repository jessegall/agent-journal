<?php

declare(strict_types=1);

namespace App\Pages;

use App\Contracts\NativePartProvider;
use App\Contracts\NavigationProvider;
use App\Contracts\PageProvider;
use App\Contracts\SidebarGroupProvider;
use App\Contracts\TypeProvider;
use App\Data\CurrentUserData;
use App\Data\DeniedWindow;
use App\Data\FailedWindow;
use App\Data\HomeData;
use App\Data\HomeWindowData;
use App\Data\LayoutData;
use App\Data\LoginInput;
use App\Data\NavigationCountsData;
use App\Data\NavigationData;
use App\Data\NavigationGroupData;
use App\Data\NavigationItemData;
use App\Data\ReadyWindow;
use App\Data\RecoveryRefusalPartData;
use App\Data\RuntimeEntryData;
use App\Data\SharedData;
use App\Data\TerminalWindowData;
use App\Data\UnavailableWindow;
use App\Declarations\ActionRoute;
use App\Declarations\DomainUi;
use App\Declarations\NavigationItem;
use App\Declarations\Page;
use App\Declarations\SidebarGroup;
use App\Declarations\Slot;
use App\Enums\Icon;
use App\Enums\SlotContextType;
use App\Enums\WindowState;
use App\Http\Controllers\Agents\CheckCapacityController;
use App\Http\Controllers\Asks\ApproveMergeAskPageController;
use App\Http\Controllers\Drafts\DraftQuestionsController;
use App\Http\Controllers\Drafts\DraftRecordController;
use App\Http\Controllers\Profiles\StartReceiptController;
use App\Http\Controllers\Runtimes\CancelRuntimeRequestController;
use App\Http\Controllers\Runtimes\CancelScriptRuntimeRequestController;
use App\Http\Controllers\Runtimes\ReleaseRuntimeHoldController;
use App\Http\Controllers\Runtimes\ResolveRuntimeRequestController;
use App\Http\Controllers\Runtimes\ResumeScriptRuntimeRequestController;
use App\Http\Controllers\Runtimes\RetryRuntimeRequestController;
use App\Http\Controllers\Runtimes\SendRuntimeRequestAgainController;
use App\Http\Controllers\Terminal\CancelPrivateEntryController;
use App\Http\Controllers\Terminal\CancelTerminalTakeController;
use App\Http\Controllers\Terminal\CheckTerminalScreenController;
use App\Http\Controllers\Terminal\ChooseTerminalDraftController;
use App\Http\Controllers\Terminal\CloseTerminalController;
use App\Http\Controllers\Terminal\OpenPrivateEntryController;
use App\Http\Controllers\Terminal\OpenTerminalController;
use App\Http\Controllers\Terminal\ReleaseTerminalControlController;
use App\Http\Controllers\Terminal\RenewTerminalControlController;
use App\Http\Controllers\Terminal\RenewTerminalController;
use App\Http\Controllers\Terminal\SendTerminalInputController;
use App\Http\Controllers\Terminal\SubmitPrivateInputController;
use App\Http\Controllers\Terminal\TakeTerminalControlController;
use App\Http\Controllers\Terminal\TerminalControlReceiptController;
use App\Http\Controllers\Terminal\TerminalFrameController;
use App\Resolvers\AskDetailResolver;
use App\Resolvers\AskInboxResolver;
use App\Resolvers\HomeWindowResolver;
use App\Resolvers\RuntimeStatusResolver;
use App\Resolvers\TerminalWindowResolver;

/**
 * The pages Core's Web declares itself, served beside the domains' pages: Home, at /, and the runtime status, at
 * /web/runtimes, with the owner's recovery actions; Home, first in the sidebar; and the sidebar groups Work and Agents
 * that any domain may join.
 */
final class WebPages implements NativePartProvider, NavigationProvider, PageProvider, SidebarGroupProvider, TypeProvider
{
    /**
     * The data classes and enums these pages own, generated in the web module.
     */
    public function types(): array
    {
        return [
            CurrentUserData::class,
            DeniedWindow::class,
            FailedWindow::class,
            HomeData::class,
            HomeWindowData::class,
            LayoutData::class,
            LoginInput::class,
            NavigationCountsData::class,
            NavigationData::class,
            NavigationGroupData::class,
            NavigationItemData::class,
            ReadyWindow::class,
            RecoveryRefusalPartData::class,
            RuntimeEntryData::class,
            SharedData::class,
            TerminalWindowData::class,
            UnavailableWindow::class,
            WindowState::class,
            LoginPage::class,
        ];
    }

    /**
     * The native parts the runtime status mounts: each runtime's live controls and the refused recovery above them.
     *
     * @return list<string>
     */
    public function nativeParts(): array
    {
        return ['RuntimeCard.vue', 'RuntimeRefusal.vue'];
    }

    public function navigation(): array
    {
        return [NavigationItem::page('home', 'Home', Icon::Home)];
    }

    public function sidebarGroups(): array
    {
        return [SidebarGroup::make('work', 'Work'), SidebarGroup::make('agents', 'Agents')];
    }

    public function pages(): array
    {
        return [
            Page::make('home', 'Home', Icon::Home, HomeWindowResolver::class, 'Home.vue')
                ->at('')
                ->slots(Slot::make('bar', SlotContextType::Nothing))
                ->actions(
                    ActionRoute::get('drafts/{noun}/questions', DraftQuestionsController::class, 'draft-questions'),
                    ActionRoute::get('drafts/{noun}/record', DraftRecordController::class, 'draft-record'),
                    ActionRoute::get('profiles/starts/{request}', StartReceiptController::class, 'start-receipt'),
                    ActionRoute::get('agents/{agent}/capacity', CheckCapacityController::class, 'capacity'),
                ),
            Page::make('asks', 'Asks', Icon::Chat, AskInboxResolver::class, 'Asks.vue')->at('asks'),
            Page::make('ask', 'Ask', Icon::Chat, AskDetailResolver::class, 'AskDetail.vue')
                ->at('asks/{ask}')
                ->actions(
                    ActionRoute::post('asks/{ask}/approve-merge', ApproveMergeAskPageController::class, 'approve-merge'),
                ),
            Page::layout('runtimes', 'Runtimes', Icon::Activity, RuntimeStatusResolver::class)
                ->at('runtimes')
                ->actions(
                    ActionRoute::post(
                        'runtimes/{session}/release-hold',
                        ReleaseRuntimeHoldController::class,
                        'release-runtime-hold',
                    ),
                    ActionRoute::post(
                        'runtimes/requests/{driver_request}/retry',
                        RetryRuntimeRequestController::class,
                        'retry-runtime-request',
                    ),
                    ActionRoute::post(
                        'runtimes/requests/{driver_request}/send-again',
                        SendRuntimeRequestAgainController::class,
                        'send-runtime-request-again',
                    ),
                    ActionRoute::post(
                        'runtimes/requests/{driver_request}/cancel',
                        CancelRuntimeRequestController::class,
                        'cancel-runtime-request',
                    ),
                    ActionRoute::post(
                        'runtimes/requests/{driver_request}/resolve',
                        ResolveRuntimeRequestController::class,
                        'resolve-runtime-request',
                    ),
                    ActionRoute::post(
                        'runtimes/requests/{driver_request}/resume-script',
                        ResumeScriptRuntimeRequestController::class,
                        'resume-runtime-script',
                    ),
                    ActionRoute::post(
                        'runtimes/requests/{driver_request}/cancel-script',
                        CancelScriptRuntimeRequestController::class,
                        'cancel-runtime-script',
                    ),
                ),
            Page::make('terminal', 'Terminal', Icon::Activity, TerminalWindowResolver::class, 'TerminalWindow.vue')
                ->at('agents/{agent}/terminal')
                ->actions(
                    ActionRoute::post(
                        'agents/{agent}/terminal/interests',
                        OpenTerminalController::class,
                        'open-terminal-interest',
                    ),
                    ActionRoute::post(
                        'agents/{agent}/terminal/interests/renew',
                        RenewTerminalController::class,
                        'renew-terminal-interest',
                    ),
                    ActionRoute::post(
                        'agents/{agent}/terminal/interests/close',
                        CloseTerminalController::class,
                        'close-terminal-interest',
                    ),
                    ActionRoute::get('agents/{agent}/terminal/frame', TerminalFrameController::class, 'terminal-frame'),
                    ActionRoute::post(
                        'agents/{agent}/terminal/control/take',
                        TakeTerminalControlController::class,
                        'take-terminal-control',
                    ),
                    ActionRoute::post(
                        'agents/{agent}/terminal/control/cancel',
                        CancelTerminalTakeController::class,
                        'cancel-terminal-take',
                    ),
                    ActionRoute::post(
                        'agents/{agent}/terminal/control/renew',
                        RenewTerminalControlController::class,
                        'renew-terminal-control',
                    ),
                    ActionRoute::post(
                        'agents/{agent}/terminal/control/release',
                        ReleaseTerminalControlController::class,
                        'release-terminal-control',
                    ),
                    ActionRoute::post(
                        'agents/{agent}/terminal/control/input',
                        SendTerminalInputController::class,
                        'send-terminal-input',
                    ),
                    ActionRoute::post(
                        'agents/{agent}/terminal/control/draft',
                        ChooseTerminalDraftController::class,
                        'choose-terminal-draft',
                    ),
                    ActionRoute::post(
                        'agents/{agent}/terminal/control/check',
                        CheckTerminalScreenController::class,
                        'check-terminal-screen',
                    ),
                    ActionRoute::post(
                        'agents/{agent}/terminal/private/open',
                        OpenPrivateEntryController::class,
                        'open-private-entry',
                    ),
                    ActionRoute::post(
                        'agents/{agent}/terminal/private/submit',
                        SubmitPrivateInputController::class,
                        'submit-private-input',
                    ),
                    ActionRoute::post(
                        'agents/{agent}/terminal/private/cancel',
                        CancelPrivateEntryController::class,
                        'cancel-private-entry',
                    ),
                    ActionRoute::get(
                        'agents/{agent}/terminal/control',
                        TerminalControlReceiptController::class,
                        'terminal-control',
                    ),
                ),
        ];
    }

    /**
     * Web's pages under its own key, web, as checked with the domains' declarations.
     */
    public function declarations(): DomainUi
    {
        return DomainUi::of($this, 'Web', 'App', dirname(__DIR__, 2).'/resources/js/web');
    }
}
