<?php

declare(strict_types=1);

namespace Tests\Fixtures\AccessorReads;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

/**
 * A model with an accessor read by its camel case method name, which is refused, and by its snake case name, which
 * passes.
 *
 * @property-read string $tracking_label
 */
final class Parcel extends Model
{
    public function label(): string
    {
        return $this->trackingLabel;
    }

    public function snakeLabel(): string
    {
        return $this->tracking_label;
    }

    /**
     * @return Attribute<string, never>
     */
    protected function trackingLabel(): Attribute
    {
        return Attribute::get(fn (): string => 'parcel');
    }
}
