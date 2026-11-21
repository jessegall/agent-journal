<?php

declare(strict_types=1);

namespace App\Connections\Pages;

use App\Connections\Resolvers\ConnectProjectWindowResolver;
use App\Connections\Support\ConnectionsOwnerCheck;
use App\Ui\Contracts\NavigationProvider;
use App\Ui\Contracts\PageProvider;
use App\Ui\Declarations\DomainUi;
use App\Ui\Declarations\NavigationItem;
use App\Ui\Declarations\Page;
use App\Ui\Enums\Icon;

/**
 * The pages Core's Connections declares, for the owner alone, under /connections: the Connect a project window.
 */
final class ConnectionsPages implements NavigationProvider, PageProvider
{
    public function pages(): array
    {
        return [
            Page::make(
                'connect',
                'Connect a project',
                Icon::Connections,
                ConnectProjectWindowResolver::class,
                'ConnectProjectWindow.vue',
            )
                ->at('')
                ->visibleWhen(ConnectionsOwnerCheck::class),
        ];
    }

    public function navigation(): array
    {
        return [
            NavigationItem::page('connect', 'Connect a project', Icon::Connections, group: 'Agents', position: 50),
        ];
    }

    /**
     * The Connections pages under their own key, connections, as checked with the domains' declarations.
     */
    public function declarations(): DomainUi
    {
        return DomainUi::of($this, 'Connections', 'App\\Connections', dirname(__DIR__).'/Resources/js');
    }
}
