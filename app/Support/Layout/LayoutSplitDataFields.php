<?php

declare(strict_types=1);

namespace App\Support\Layout;

use App\Web\Creation\Exceptions\MissingFields;
use App\Web\Enums\NarrowView;
use App\Web\Enums\ReaderWidth;
use Spatie\LaravelData\Optional;

final class LayoutSplitDataFields
{
    private int $listWidth = LayoutSplitData::LIST_WIDTH;

    private NarrowView $narrowShows;

    private ReaderWidth $readerWidth = ReaderWidth::Unrestricted;

    private LayoutBackData|Optional $back;

    public function __construct()
    {
        $this->back = new Optional();
    }

    public function listWidth(int $listWidth): self
    {
        $this->listWidth = $listWidth;

        return $this;
    }

    public function narrowShows(NarrowView $narrowShows): self
    {
        $this->narrowShows = $narrowShows;

        return $this;
    }

    public function readerWidth(ReaderWidth $readerWidth): self
    {
        $this->readerWidth = $readerWidth;

        return $this;
    }

    public function back(LayoutBackData|Optional $back): self
    {
        $this->back = $back;

        return $this;
    }

    public function asShowingList(): self
    {
        return $this->narrowShows(NarrowView::List);
    }

    public function asShowingReader(): self
    {
        return $this->narrowShows(NarrowView::Reader);
    }

    public function finish(): LayoutSplitData
    {
        if (! isset($this->narrowShows)) {
            throw MissingFields::forType(LayoutSplitData::class, 'narrowShows');
        }

        return new LayoutSplitData(
            listWidth: $this->listWidth,
            narrowShows: $this->narrowShows,
            readerWidth: $this->readerWidth,
            back: $this->back,
        );
    }
}
