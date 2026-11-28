<?php

declare(strict_types=1);

namespace App\Web\Data;

use App\Web\Creation\Exceptions\MissingFields;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Lazy;

final class ScheduledSurfacePropFields
{
    private Lazy|Data $value;

    public function value(Lazy|Data $value): self
    {
        $this->value = $value;

        return $this;
    }

    public function finish(): ScheduledSurfaceProp
    {
        if (! isset($this->value)) {
            throw MissingFields::forType(ScheduledSurfaceProp::class, 'value');
        }

        return new ScheduledSurfaceProp(
            value: $this->value,
        );
    }
}
