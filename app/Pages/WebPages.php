<?php

declare(strict_types=1);

namespace App\Pages;

use App\Accounts\Data\LoginInput;
use App\Agents\Activity\Data\ActivityEventData;
use App\Agents\Activity\Data\ActivityWindowData;
use App\Agents\ActivityOwnerCheck;
use App\Agents\Data\CapacityData;
use App\Agents\Data\CapacityInput;
use App\Agents\Data\StartPreviewData;
use App\Agents\Data\StartPreviewInput;
use App\Agents\Drivers\Contracts\NativePartProvider;
use App\Agents\Drivers\Data\DriverLookData;
use App\Agents\Drivers\Enums\MarkTone;
use App\Agents\Drivers\Enums\SignInCodeDirection;
use App\Data\Pages\DeniedWindow;
use App\Data\Pages\DraftedRecordData;
use App\Data\Pages\FailedWindow;
use App\Data\Pages\HomeData;
use App\Data\Pages\HomeWindowData;
use App\Data\Pages\LayoutData;
use App\Data\Pages\ReadyWindow;
use App\Declarations\Page;
use App\Declarations\PageActions;
use App\Declarations\PageLoaders;
use App\Declarations\PageSlots;
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
use App\Http\Loaders\Agents\CapacityLoader;
use App\Http\Loaders\Agents\StartPreviewLoader;
use App\Http\Loaders\Drafts\DraftQuestionsLoader;
use App\Http\Loaders\Drafts\DraftRecordLoader;
use App\Http\Loaders\Profiles\StartReceiptLoader;
use App\Http\Pages\Resolvers\ActivityWindowResolver;
use App\Http\Pages\Resolvers\AskDetailResolver;
use App\Http\Pages\Resolvers\AskInboxResolver;
use App\Http\Pages\Resolvers\HomeWindowResolver;
use App\Http\Pages\Resolvers\RuntimeStatusResolver;
use App\Http\Pages\Resolvers\TerminalWindowResolver;
use App\Messages\Data\DraftQuestionsData;
use App\Navigation\Contracts\NavigationProvider;
use App\Navigation\Contracts\PageProvider;
use App\Navigation\Data\NavigationCountsData;
use App\Navigation\Data\NavigationData;
use App\Navigation\Data\NavigationGroupData;
use App\Navigation\Data\NavigationItemData;
use App\Navigation\Declarations\DomainClient;
use App\Navigation\Declarations\NavigationItem;
use App\Navigation\Enums\Icon;
use App\Processes\Data\RecoveryRefusalPartData;
use App\Processes\Data\RuntimeEntryData;
use App\Profiles\Data\StartReceiptData;
use App\Profiles\Data\StartReceiptInput;
use App\Profiles\Enums\SlotContextType;
use App\Records\Contracts\TypeProvider;
use App\Terminals\Data\TerminalWindowData;
use App\Web\Data\AppContextData;
use App\Web\Data\InstallationData;
use App\Web\Data\LoaderReplyData;
use App\Web\Data\Pages\UnavailableWindow;
use App\Web\Data\ViewerData;
use App\Web\Drafts\Data\DraftAnswersInput;
use App\Web\Drafts\Data\DraftQuestionsInput;
use App\Web\Enums\LoaderStatus;
use App\Web\Enums\ViewerType;
use App\Web\Enums\WindowPlace;
use App\Web\Enums\WindowStatus;

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
            AppContextData::class,
            CapacityData::class,
            CapacityInput::class,
            DeniedWindow::class,
            DraftAnswersInput::class,
            DraftedRecordData::class,
            DraftQuestionsData::class,
            DraftQuestionsInput::class,
            DriverLookData::class,
            FailedWindow::class,
            HomeData::class,
            HomeWindowData::class,
            InstallationData::class,
            LayoutData::class,
            LoaderReplyData::class,
            LoaderStatus::class,
            LoginInput::class,
            MarkTone::class,
            NavigationCountsData::class,
            NavigationData::class,
            NavigationGroupData::class,
            NavigationItemData::class,
            ReadyWindow::class,
            RecoveryRefusalPartData::class,
            RuntimeEntryData::class,
            SignInCodeDirection::class,
            StartPreviewData::class,
            StartPreviewInput::class,
            StartReceiptData::class,
            StartReceiptInput::class,
            TerminalWindowData::class,
            UnavailableWindow::class,
            ViewerData::class,
            ViewerType::class,
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
                ->slots(fn (PageSlots $slots) => $slots->add('bar', SlotContextType::Nothing))
                ->loaders(fn (PageLoaders $loaders) => $loaders
                    ->add('draft-questions', DraftQuestionsLoader::class)
                    ->add('draft-record', DraftRecordLoader::class)
                    ->add('start-receipt', StartReceiptLoader::class)
                    ->add('capacity', CapacityLoader::class)
                    ->add('start-preview', StartPreviewLoader::class)),
            Page::make('asks', 'Asks', Icon::Speech, AskInboxResolver::class, 'Asks.vue')->at('asks')->onHome(26),
            Page::make('ask', 'Ask', Icon::Speech, AskDetailResolver::class, 'AskDetail.vue')->at('asks/{ask}'),
            Page::layout('runtimes', 'Runtimes', Icon::Activity, RuntimeStatusResolver::class)
                ->at('runtimes')
                ->actions(fn (PageActions $actions) => $actions
                    ->post(
                        'runtimes/{session}/release-hold',
                        ReleaseRuntimeHoldController::class,
                        'release-runtime-hold',
                    )
                    ->post(
                        'runtimes/requests/{driver_request}/retry',
                        RetryRuntimeRequestController::class,
                        'retry-runtime-request',
                    )
                    ->post(
                        'runtimes/requests/{driver_request}/send-again',
                        SendRuntimeRequestAgainController::class,
                        'send-runtime-request-again',
                    )
                    ->post(
                        'runtimes/requests/{driver_request}/cancel',
                        CancelRuntimeRequestController::class,
                        'cancel-runtime-request',
                    )
                    ->post(
                        'runtimes/requests/{driver_request}/resolve',
                        ResolveRuntimeRequestController::class,
                        'resolve-runtime-request',
                    )
                    ->post(
                        'runtimes/requests/{driver_request}/resume-script',
                        ResumeScriptRuntimeRequestController::class,
                        'resume-runtime-script',
                    )
                    ->post(
                        'runtimes/requests/{driver_request}/cancel-script',
                        CancelScriptRuntimeRequestController::class,
                        'cancel-runtime-script',
                    )),
            Page::make('activity', 'Activity', Icon::Activity, ActivityWindowResolver::class, 'ActivityPanel.vue')
                ->at('activity')
                ->onHome(62)
                ->placedAs(WindowPlace::Feed)
                ->visibleWhen(ActivityOwnerCheck::class),
            Page::make('terminal', 'Terminal', Icon::Activity, TerminalWindowResolver::class, 'TerminalWindow.vue')
                ->at('agents/{agent}/terminal')
                ->actions(fn (PageActions $actions) => $actions
                    ->post(
                        'agents/{agent}/terminal/interests',
                        OpenTerminalController::class,
                        'open-terminal-interest',
                    )
                    ->post(
                        'agents/{agent}/terminal/interests/renew',
                        RenewTerminalController::class,
                        'renew-terminal-interest',
                    )
                    ->post(
                        'agents/{agent}/terminal/interests/close',
                        CloseTerminalController::class,
                        'close-terminal-interest',
                    )
                    ->get('agents/{agent}/terminal/frame', TerminalFrameController::class, 'terminal-frame')
                    ->post(
                        'agents/{agent}/terminal/control/take',
                        TakeTerminalControlController::class,
                        'take-terminal-control',
                    )
                    ->post(
                        'agents/{agent}/terminal/control/cancel',
                        CancelTerminalTakeController::class,
                        'cancel-terminal-take',
                    )
                    ->post(
                        'agents/{agent}/terminal/control/renew',
                        RenewTerminalControlController::class,
                        'renew-terminal-control',
                    )
                    ->post(
                        'agents/{agent}/terminal/control/release',
                        ReleaseTerminalControlController::class,
                        'release-terminal-control',
                    )
                    ->post(
                        'agents/{agent}/terminal/control/input',
                        SendTerminalInputController::class,
                        'send-terminal-input',
                    )
                    ->post(
                        'agents/{agent}/terminal/control/draft',
                        ChooseTerminalDraftController::class,
                        'choose-terminal-draft',
                    )
                    ->post(
                        'agents/{agent}/terminal/control/check',
                        CheckTerminalScreenController::class,
                        'check-terminal-screen',
                    )
                    ->post(
                        'agents/{agent}/terminal/private/open',
                        OpenPrivateEntryController::class,
                        'open-private-entry',
                    )
                    ->post(
                        'agents/{agent}/terminal/private/submit',
                        SubmitPrivateInputController::class,
                        'submit-private-input',
                    )
                    ->post(
                        'agents/{agent}/terminal/private/cancel',
                        CancelPrivateEntryController::class,
                        'cancel-private-entry',
                    )
                    ->get(
                        'agents/{agent}/terminal/control',
                        TerminalControlReceiptController::class,
                        'terminal-control',
                    )),
        ];
    }

    /**
     * Web's pages under its own key, web, as checked with the domains' declarations.
     */
    public function declarations(): DomainClient
    {
        return DomainClient::ofCore($this, 'Web', 'web');
    }
}
