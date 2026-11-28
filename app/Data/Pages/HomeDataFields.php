<?php

declare(strict_types=1);

namespace App\Data\Pages;

use App\Navigation\Data\Pages\SlotSectionData;
use App\Web\Creation\Exceptions\MissingFields;

final class HomeDataFields
{
    /** @var list<LayoutData> */
    private array $layouts;

    /** @var list<HomeWindowData> */
    private array $windows;

    /** @var list<SlotSectionData> */
    private array $barSections;

    /** @param list<LayoutData> $layouts */
    public function layouts(array $layouts): self
    {
        $this->layouts = $layouts;

        return $this;
    }

    /** @param list<HomeWindowData> $windows */
    public function windows(array $windows): self
    {
        $this->windows = $windows;

        return $this;
    }

    /** @param list<SlotSectionData> $barSections */
    public function barSections(array $barSections): self
    {
        $this->barSections = $barSections;

        return $this;
    }

    public function finish(): HomeData
    {
        if (! isset($this->layouts)) {
            throw MissingFields::forType(HomeData::class, 'layouts');
        }

        if (! isset($this->windows)) {
            throw MissingFields::forType(HomeData::class, 'windows');
        }

        if (! isset($this->barSections)) {
            throw MissingFields::forType(HomeData::class, 'barSections');
        }

        return new HomeData(
            layouts: $this->layouts,
            windows: $this->windows,
            barSections: $this->barSections,
        );
    }
}
