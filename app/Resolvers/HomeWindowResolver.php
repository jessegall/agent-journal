<?php

declare(strict_types=1);

namespace App\Resolvers;

use App\Contracts\PageResolver;
use App\Data\HomeData;
use App\Data\HomeWindowData;
use App\Declarations\RegisteredPage;
use App\Support\UiDeclarations;
use App\Support\Views\LayoutsView;

/**
 * Home's own data, owned by Web alone: the saved layouts, the windows the installed domains put on Home, and the
 * props of the sections in Home's bar. Each window's data comes as its own prop, read by its owner.
 */
final readonly class HomeWindowResolver implements PageResolver
{
    public function __construct(
        private UiDeclarations $declarations,
        private LayoutsView $layouts,
    ) {}

    public function read(): HomeData
    {
        $windows = array_values(
            array_filter($this->declarations->pages(), fn (RegisteredPage $page) => $page->page->homePosition !== null),
        );

        usort(
            $windows,
            fn (
                RegisteredPage $one,
                RegisteredPage $other,
            ) => [$one->page->homePosition, $one->key] <=> [$other->page->homePosition, $other->key],
        );

        $owners = array_count_values(array_map(fn (RegisteredPage $page) => $page->owner->key, $windows));

        return HomeData::from([
            'layouts' => $this->layouts->layouts(),
            'windows' => array_map(fn (RegisteredPage $page) => HomeWindowData::from([
                // A domain with one window on Home keeps its short pane key, so saved layouts keep their panes.
                'paneKey' => $owners[$page->owner->key] === 1 ? $page->owner->key : $page->key,
                'key' => $page->key,
                'propName' => $page->propName,
                'component' => $page->componentName(),
                'title' => $page->page->title,
                'icon' => $page->page->icon,
            ]), $windows),
            'barSections' => $this->declarations->sectionsIn(RegisteredPage::HOME, 'bar'),
        ]);
    }
}
