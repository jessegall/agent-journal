<?php

declare(strict_types=1);

namespace App\Pages;

use App\Contracts\Drivers\NativePartProvider;
use App\Contracts\Navigation\NavigationProvider;
use App\Contracts\Navigation\PageProvider;
use App\Contracts\Records\TypeProvider;
use App\Data\Accounts\LoginInput;
use App\Data\Activity\ActivityEventData;
use App\Data\Activity\ActivityWindowData;
use App\Data\Navigation\NavigationCountsData;
use App\Data\Navigation\NavigationData;
use App\Data\Navigation\NavigationGroupData;
use App\Data\Navigation\NavigationItemData;
use App\Data\Pages\CurrentUserData;
use App\Data\Pages\DeniedWindow;
use App\Data\Pages\FailedWindow;
use App\Data\Pages\HomeData;
use App\Data\Pages\HomeWindowData;
use App\Data\Pages\LayoutData;
use App\Data\Pages\ReadyWindow;
use App\Data\Pages\UnavailableWindow;
use App\Data\Processes\RecoveryRefusalPartData;
use App\Data\Processes\RuntimeEntryData;
use App\Data\Sharing\SharedData;
use App\Data\Terminals\TerminalWindowData;
use App\Declarations\ActionRoute;
use App\Declarations\DomainUi;
use App\Declarations\NavigationItem;
use App\Declarations\Page;
use App\Declarations\Slot;
use App\Enums\Navigation\Icon;
use App\Enums\Profiles\SlotContextType;
use App\Enums\Web\WindowPlace;
use App\Enums\Web\WindowStatus;
use App\Http\Controllers\Agents\CheckCapacityController;
use App\Http\Controllers\Agents\StartPreviewController;
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
use App\Http\Pages\Resolvers\ActivityWindowResolver;
use App\Http\Pages\Resolvers\AskDetailResolver;
use App\Http\Pages\Resolvers\AskInboxResolver;
use App\Http\Pages\Resolvers\HomeWindowResolver;
use App\Http\Pages\Resolvers\RuntimeStatusResolver;
use App\Http\Pages\Resolvers\TerminalWindowResolver;
use App\Support\ActivityOwnerCheck;

/**
 * The pages Core's Web declares itself, served beside the domains' pages: Home, at /, and the runtime status, at
 * /web/runtimes, with the owner's recovery actions; Home, first in the sidebar; and the sidebar groups Work and Agents
 * that any domain may join.
 */
final class WebPages implements NativePartProvider, NavigationProvider, PageProvider, TypeProvider
{
    /**
     * The data classes and enums these pages own, generated in the web module.
     */
    public function types(): array
    {
        return [
            ActivityEventData::class,
            ActivityWindowData::class,
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
            WindowStatus::class,
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
        return [
            'RuntimeCard.vue',
            'RuntimeRefusal.vue',
        ];
    }

    public function navigation(): array
    {
        return [NavigationItem::page('home', 'Home', Icon::Home)];
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
                    ActionRoute::get('agents/{agent}/start-preview', StartPreviewController::class, 'start-preview'),
                ),
            Page::make('asks', 'Asks', Icon::Speech, AskInboxResolver::class, 'Asks.vue')->at('asks')->onHome(26),
            Page::make('ask', 'Ask', Icon::Speech, AskDetailResolver::class, 'AskDetail.vue')->at('asks/{ask}'),
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
            Page::make('activity', 'Activity', Icon::Activity, ActivityWindowResolver::class, 'ActivityPanel.vue')
                ->at('activity')
                ->onHome(62)
                ->placedAs(WindowPlace::Feed)
                ->visibleWhen(ActivityOwnerCheck::class),
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
        return DomainUi::ofCore($this, 'Web', 'web');
    }
}
