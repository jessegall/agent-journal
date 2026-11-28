<?php

declare(strict_types=1);

namespace App\Http\Pages;

use App\Data\Pages\HomeData;
use App\Data\Pages\HomeWindowData;
use App\Navigation\Contracts\ClientOwnerAvailability;
use App\Support\ClientDeclarations;
use App\Support\Views\LayoutsView;
use App\Web\Creation\Contracts\PageBuilder;
use App\Web\Declarations\RegisteredPage;
use Illuminate\Http\Request;

/**
 * Home's own data, owned by Web alone: the saved layouts, the windows the installed domains put on Home, and the
 * props of the sections in Home's bar. Each window's data comes as its own prop, read by its owner.
 */
final readonly class HomePageBuilder implements PageBuilder
{
    public function __construct(
        private ClientDeclarations $declarations,
        private LayoutsView $layouts,
        private ClientOwnerAvailability $owners,
    ) {}

    public function build(Request $visit): HomeData
    {
        $windows = array_values(
            array_filter($this->declarations->pages(), fn (RegisteredPage $page) => $page->page->homePosition !== null),
        );

        usort(
            $windows,
            fn (
                RegisteredPage $one,
                RegisteredPage $other,
            ) => [
                $one->page->homePosition,
                $one->key,
            ] <=> [
                $other->page->homePosition,
                $other->key,
            ],
        );

        $owners = array_count_values(array_map(fn (RegisteredPage $page) => $page->owner->key, $windows));

        $panes = [];

        foreach ($windows as $page) {
            $component = $page->windowComponentName();

            if ($component === null || ! $this->owners->isAvailable($page->owner)) {
                continue;
            }

            $panes[] = HomeWindowData::build()
                ->paneKey($owners[$page->owner->key] === 1 ? $page->owner->key : $page->key)
                ->key($page->key)
                ->propName($page->propName)
                ->component($component)
                ->title($page->page->title)
                ->icon($page->page->icon)
                ->place($page->page->place)
                ->finish();
        }

        return HomeData::build()
            ->layouts($this->layouts->layouts(array_map(fn (HomeWindowData $pane) => $pane->paneKey, $panes)))
            ->windows($panes)
            ->barSections($this->declarations->sectionsIn(RegisteredPage::HOME, 'bar'))
            ->finish();
    }
}
