<?php

declare(strict_types=1);

namespace App\Web\Pages;

use App\Ui\Contracts\ProvidesPages;
use App\Ui\Declarations\DomainUi;
use App\Ui\Declarations\ActionRoute;
use App\Ui\Declarations\Page;
use App\Ui\Declarations\Slot;
use App\Ui\Enums\Icon;
use App\Ui\Enums\SlotContextType;
use App\Http\Controllers\Web\Runtimes\CancelRuntimeRequestController;
use App\Http\Controllers\Web\Runtimes\CancelScriptRuntimeRequestController;
use App\Http\Controllers\Web\Runtimes\ReleaseRuntimeHoldController;
use App\Http\Controllers\Web\Runtimes\ResolveRuntimeRequestController;
use App\Http\Controllers\Web\Runtimes\ResumeScriptRuntimeRequestController;
use App\Http\Controllers\Web\Runtimes\RetryRuntimeRequestController;
use App\Web\Resolvers\HomeWindowResolver;
use App\Web\Resolvers\RuntimeStatusResolver;

/**
 * The pages Core's Web declares itself, served beside the domains' pages: Home, at /, and the runtime status, at
 * /web/runtimes, with the owner's recovery actions.
 */
final class WebPages implements ProvidesPages
{
    public function pages(): array
    {
        return [
            Page::make('home', 'Home', Icon::Home, HomeWindowResolver::class, 'Home.vue')
                ->at('')
                ->slots(Slot::make('bar', SlotContextType::Session)),
            Page::make('runtimes', 'Runtimes', Icon::Activity, RuntimeStatusResolver::class, 'Runtimes.vue')
                ->at('runtimes')
                ->actions(
                    ActionRoute::post(
                        'runtimes/{session}/release-hold',
                        ReleaseRuntimeHoldController::class,
                        'release-runtime-hold',
                    ),
                    ActionRoute::post(
                        'runtimes/requests/{driverRequest}/retry',
                        RetryRuntimeRequestController::class,
                        'retry-runtime-request',
                    ),
                    ActionRoute::post(
                        'runtimes/requests/{driverRequest}/cancel',
                        CancelRuntimeRequestController::class,
                        'cancel-runtime-request',
                    ),
                    ActionRoute::post(
                        'runtimes/requests/{driverRequest}/resolve',
                        ResolveRuntimeRequestController::class,
                        'resolve-runtime-request',
                    ),
                    ActionRoute::post(
                        'runtimes/requests/{driverRequest}/resume-script',
                        ResumeScriptRuntimeRequestController::class,
                        'resume-runtime-script',
                    ),
                    ActionRoute::post(
                        'runtimes/requests/{driverRequest}/cancel-script',
                        CancelScriptRuntimeRequestController::class,
                        'cancel-runtime-script',
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
