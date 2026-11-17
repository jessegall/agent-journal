<?php

declare(strict_types=1);

namespace App\Core\Web\Pages;

use App\Core\Ui\Contracts\ProvidesPages;
use App\Core\Ui\Declarations\DomainUi;
use App\Core\Ui\Declarations\Page;
use App\Core\Ui\Declarations\Slot;
use App\Core\Ui\Enums\Icon;
use App\Core\Ui\Enums\SlotContextType;
use App\Core\Web\Readers\HomeWindowReader;

/**
 * The pages Core's Web declares itself, served beside the domains' pages: Home, at /.
 */
final class WebPages implements ProvidesPages
{
    public function pages(): array
    {
        return [
            Page::make('home', 'Home', Icon::Home, HomeWindowReader::class, 'Home.vue')
                ->at('')
                ->slots(Slot::make('bar', SlotContextType::Session)),
        ];
    }

    /**
     * Web's pages under its own key, web, as checked with the domains' declarations.
     */
    public function declarations(): DomainUi
    {
        return DomainUi::of($this, 'Web', 'App\\Core\\Web', dirname(__DIR__));
    }
}
