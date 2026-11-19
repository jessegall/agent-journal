<?php

declare(strict_types=1);

namespace App\Web\Pages;

use App\Ui\Contracts\ProvidesPages;
use App\Ui\Declarations\DomainUi;
use App\Ui\Declarations\Page;
use App\Ui\Declarations\Slot;
use App\Ui\Enums\Icon;
use App\Ui\Enums\SlotContextType;
use App\Web\Resolvers\HomeWindowResolver;
use App\Web\Resolvers\RuntimeStatusResolver;

/**
 * The pages Core's Web declares itself, served beside the domains' pages: Home, at /, and the read-only runtime
 * status, at /web/runtimes.
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
                ->at('runtimes'),
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
