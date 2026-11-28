<?php

declare(strict_types=1);

namespace App\Navigation\Layout;

use App\Navigation\Enums\Icon;
use App\Settings\Enums\ActionMethod;
use App\Web\Creation\Exceptions\MissingFields;
use Spatie\LaravelData\Optional;

final class LayoutMenuItemDataFields
{
    private string $key;

    private string $label;

    private string $href;

    private ActionMethod $method;

    private Icon|Optional $icon;

    public function __construct()
    {
        $this->icon = new Optional();
    }

    public function key(string $key): self
    {
        $this->key = $key;

        return $this;
    }

    public function label(string $label): self
    {
        $this->label = $label;

        return $this;
    }

    public function href(string $href): self
    {
        $this->href = $href;

        return $this;
    }

    public function method(ActionMethod $method): self
    {
        $this->method = $method;

        return $this;
    }

    public function icon(Icon|Optional $icon): self
    {
        $this->icon = $icon;

        return $this;
    }

    public function finish(): LayoutMenuItemData
    {
        if (! isset($this->key)) {
            throw MissingFields::forType(LayoutMenuItemData::class, 'key');
        }

        if (! isset($this->label)) {
            throw MissingFields::forType(LayoutMenuItemData::class, 'label');
        }

        if (! isset($this->href)) {
            throw MissingFields::forType(LayoutMenuItemData::class, 'href');
        }

        if (! isset($this->method)) {
            throw MissingFields::forType(LayoutMenuItemData::class, 'method');
        }

        return new LayoutMenuItemData(
            key: $this->key,
            label: $this->label,
            href: $this->href,
            method: $this->method,
            icon: $this->icon,
        );
    }
}
