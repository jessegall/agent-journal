<?php

declare(strict_types=1);

namespace App\Support\Layout;

use App\Web\Creation\Exceptions\MissingFields;
use Spatie\LaravelData\Data;

final class LayoutNativeDataFields
{
    private string $component;

    private Data $props;

    public function component(string $component): self
    {
        $this->component = $component;

        return $this;
    }

    public function props(Data $props): self
    {
        $this->props = $props;

        return $this;
    }

    public function finish(): LayoutNativeData
    {
        if (! isset($this->component)) {
            throw MissingFields::forType(LayoutNativeData::class, 'component');
        }

        if (! isset($this->props)) {
            throw MissingFields::forType(LayoutNativeData::class, 'props');
        }

        return new LayoutNativeData(
            component: $this->component,
            props: $this->props->toArray(),
        );
    }
}
