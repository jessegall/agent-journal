<?php

declare(strict_types=1);

namespace Tests\Fixtures\Reflection;

use App\Concerns\Reflects;
use App\Support\ReflectedType;

/**
 * A class that reflects itself, or a target it is given, through the Reflects trait.
 */
class ReflectingParcel
{
    use Reflects;

    /**
     * @return ReflectedType<static>
     */
    public function reflectorOfItself(): ReflectedType
    {
        return $this->reflect();
    }

    /**
     * @return ReflectedType<Parcel>
     */
    public function reflectorOf(Parcel $parcel): ReflectedType
    {
        return static::reflect($parcel);
    }
}
