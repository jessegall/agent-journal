<?php

declare(strict_types=1);

namespace App\Pages;

use App\Data\Palette\PaletteSearchData;
use App\Data\Palette\PaletteSourcesData;
use App\Data\Palette\SearchInput;
use App\Data\Palette\SearchSourcesInput;
use App\Http\Loaders\Shell\NotificationChangesLoader;
use App\Http\Loaders\Shell\NotificationsLoader;
use App\Http\Loaders\Shell\SearchLoader;
use App\Http\Loaders\Shell\SearchSourcesLoader;
use App\Navigation\Contracts\LoaderProvider;
use App\Navigation\Declarations\DomainClient;
use App\Navigation\Declarations\Loader;
use App\Notifications\Data\NotificationChangePage;
use App\Notifications\Data\NotificationChangesInput;
use App\Notifications\Data\NotificationPage;
use App\Notifications\Data\NotificationPageInput;
use App\Records\Contracts\TypeProvider;

/**
 * The loaders of the shell around every page, under the key shell: no page guards them, only the member gate.
 */
final class ShellLoaders implements LoaderProvider, TypeProvider
{
    public function loaders(): array
    {
        return [
            Loader::make('search', SearchLoader::class),
            Loader::make('search-sources', SearchSourcesLoader::class),
            Loader::make('notifications', NotificationsLoader::class),
            Loader::make('notification-changes', NotificationChangesLoader::class),
        ];
    }

    /**
     * The input and answer Data of the shell's loaders, generated in the shell module.
     */
    public function types(): array
    {
        return [
            NotificationChangePage::class,
            NotificationChangesInput::class,
            NotificationPage::class,
            NotificationPageInput::class,
            PaletteSearchData::class,
            PaletteSourcesData::class,
            SearchInput::class,
            SearchSourcesInput::class,
        ];
    }

    /**
     * The shell's loaders under its own key, shell, as checked with the domains' declarations.
     */
    public function declarations(): DomainClient
    {
        return DomainClient::ofCore($this, 'Shell', 'shell');
    }
}
