<?php

declare(strict_types=1);

namespace App\Domain\Web;

use App\Domain\Access\AccessDomain;
use App\Domain\Contracts\Domain;
use App\Domain\Contracts\ProvidesPages;
use App\Domain\Declarations\Page;
use App\Domain\Declarations\Slot;
use App\Domain\Enums\Icon;
use App\Domain\Enums\SlotContextKind;
use App\Domain\Web\Readers\HomeWindowReader;

final class WebDomain implements Domain, ProvidesPages
{
    public function description(): string
    {
        return 'The browser interface: pages, routes and the data each page shows; no domain depends on it.';
    }

    /**
     * Approved in question 13.
     *
     * @return list<class-string<Domain>>
     */
    public function requires(): array
    {
        return [AccessDomain::class];
    }

    /**
     * @return list<class-string>
     */
    public function exports(): array
    {
        return [];
    }

    public function pages(): array
    {
        return [
            Page::make('home', 'Home', Icon::Home, HomeWindowReader::class, 'Home.vue')
                ->at('')
                ->slots(Slot::make('bar', SlotContextKind::Session)),
        ];
    }
}
