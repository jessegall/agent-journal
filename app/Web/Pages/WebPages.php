<?php

declare(strict_types=1);

namespace App\Web\Pages;

use App\Ui\Contracts\PageProvider;
use App\Ui\Declarations\ActionRoute;
use App\Ui\Declarations\DomainUi;
use App\Ui\Declarations\Page;
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
use App\Web\Http\Controllers\Terminal\OpenTerminalPageController;
use App\Web\Http\Controllers\Terminal\RenewTerminalPageController;
use App\Web\Resolvers\AskDetailResolver;
use App\Web\Resolvers\AskInboxResolver;
use App\Web\Resolvers\HomeWindowResolver;
use App\Web\Resolvers\RuntimeStatusResolver;
use App\Web\Resolvers\TerminalWindowResolver;

/**
 * The pages Core's Web declares itself, served beside the domains' pages: Home, at /, and the runtime status, at
 * /web/runtimes, with the owner's recovery actions.
 */
final class WebPages implements PageProvider
{
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
            Page::make('runtimes', 'Runtimes', Icon::Activity, RuntimeStatusResolver::class, 'Runtimes.vue')
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
                    ActionRoute::post('agents/{agent}/terminal/open', OpenTerminalPageController::class, 'open-terminal'),
                    ActionRoute::post('agents/{agent}/terminal/renew', RenewTerminalPageController::class, 'renew-terminal'),
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
