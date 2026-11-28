<?php

declare(strict_types=1);

namespace App\Data\Pages;

use App\Navigation\Enums\Icon;
use App\Web\Creation\Exceptions\MissingFields;
use App\Web\Enums\WindowPlace;
use Spatie\LaravelData\Optional;

final class HomeWindowDataFields
{
    private string $paneKey;

    private string $key;

    private string $propName;

    private string $component;

    private string $title;

    private Icon $icon;

    private WindowPlace|Optional $place;

    public function __construct()
    {
        $this->place = new Optional();
    }

    public function paneKey(string $paneKey): self
    {
        $this->paneKey = $paneKey;

        return $this;
    }

    public function key(string $key): self
    {
        $this->key = $key;

        return $this;
    }

    public function propName(string $propName): self
    {
        $this->propName = $propName;

        return $this;
    }

    public function component(string $component): self
    {
        $this->component = $component;

        return $this;
    }

    public function title(string $title): self
    {
        $this->title = $title;

        return $this;
    }

    public function icon(Icon $icon): self
    {
        $this->icon = $icon;

        return $this;
    }

    public function place(WindowPlace|Optional $place): self
    {
        $this->place = $place;

        return $this;
    }

    public function finish(): HomeWindowData
    {
        if (! isset($this->paneKey)) {
            throw MissingFields::forType(HomeWindowData::class, 'paneKey');
        }

        if (! isset($this->key)) {
            throw MissingFields::forType(HomeWindowData::class, 'key');
        }

        if (! isset($this->propName)) {
            throw MissingFields::forType(HomeWindowData::class, 'propName');
        }

        if (! isset($this->component)) {
            throw MissingFields::forType(HomeWindowData::class, 'component');
        }

        if (! isset($this->title)) {
            throw MissingFields::forType(HomeWindowData::class, 'title');
        }

        if (! isset($this->icon)) {
            throw MissingFields::forType(HomeWindowData::class, 'icon');
        }

        return new HomeWindowData(
            paneKey: $this->paneKey,
            key: $this->key,
            propName: $this->propName,
            component: $this->component,
            title: $this->title,
            icon: $this->icon,
            place: $this->place,
        );
    }
}
