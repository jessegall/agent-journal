<?php

declare(strict_types=1);

namespace App\Web\Pages;

use App\Ui\Contracts\NativePartProvider;
use App\Ui\Contracts\NavigationProvider;
use App\Ui\Contracts\PageProvider;
use App\Ui\Contracts\SidebarGroupProvider;
use App\Ui\Declarations\ActionRoute;
use App\Ui\Declarations\DomainUi;
use App\Ui\Declarations\NavigationItem;
use App\Ui\Declarations\Page;
use App\Ui\Declarations\SidebarGroup;
use App\Ui\Declarations\Slot;
use App\Ui\Enums\Icon;
use App\Ui\Enums\SlotContextType;
use App\Web\Http\Controllers\Asks\ApproveMergeAskPageController;
use App\Web\Http\Controllers\Runtimes\CancelRuntimeRequestController;
use App\Web\Http\Controllers\Runtimes\CancelScriptRuntimeRequestController;
use App\Web\Http\Controllers\Runtimes\ReleaseRuntimeHoldController;
use App\Web\Http\Controllers\Runtimes\ResolveRuntimeRequestController;
use App\Web\Http\Controllers\Runtimes\ResumeScriptRuntimeRequestController;
use App\Web\Http\Controllers\Runtimes\RetryRuntimeRequestController;
use App\Web\Http\Controllers\Terminal\CancelPrivateEntryController;
use App\Web\Http\Controllers\Terminal\CancelTerminalTakeController;
use App\Web\Http\Controllers\Terminal\CheckTerminalScreenController;
use App\Web\Http\Controllers\Terminal\ChooseTerminalDraftController;
use App\Web\Http\Controllers\Terminal\CloseTerminalController;
use App\Web\Http\Controllers\Terminal\OpenPrivateEntryController;
use App\Web\Http\Controllers\Terminal\OpenTerminalController;
use App\Web\Http\Controllers\Terminal\ReleaseTerminalControlController;
use App\Web\Http\Controllers\Terminal\RenewTerminalControlController;
use App\Web\Http\Controllers\Terminal\RenewTerminalController;
use App\Web\Http\Controllers\Terminal\SendTerminalInputController;
use App\Web\Http\Controllers\Terminal\SubmitPrivateInputController;
use App\Web\Http\Controllers\Terminal\TakeTerminalControlController;
use App\Web\Http\Controllers\Terminal\TerminalControlReceiptController;
use App\Web\Http\Controllers\Terminal\TerminalFrameController;
use App\Web\Resolvers\AskDetailResolver;
use App\Web\Resolvers\AskInboxResolver;
use App\Web\Resolvers\HomeWindowResolver;
use App\Web\Resolvers\RuntimeStatusResolver;
use App\Web\Resolvers\TerminalWindowResolver;

/**
 * The pages Core's Web declares itself, served beside the domains' pages: Home, at /, and the runtime status, at
 * /web/runtimes, with the owner's recovery actions; Home, first in the sidebar; and the sidebar groups Work and Agents
 * that any domain may join.
 */
final class WebPages implements NativePartProvider, NavigationProvider, PageProvider, SidebarGroupProvider
{
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
                ->slots(Slot::make('bar', SlotContextType::Nothing)),
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
        return DomainUi::of($this, 'Web', 'App\\Web', dirname(__DIR__).'/Resources/js');
    }
}
