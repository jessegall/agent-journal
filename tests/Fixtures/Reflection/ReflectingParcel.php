<?php

declare(strict_types=1);

namespace Tests\Fixtures\Reflection;

use App\Reflection\Concerns\Reflects;
use App\Reflection\Support\Reflector;

/**
 * A class that reflects itself, or a target it is given, through the Reflects trait.
 */
class ReflectingParcel
{
    use Reflects;

    /**
     * @return Reflector<static>
     */
    public function reflectorOfItself(): Reflector
    {
        return $this->reflect();
    }

    /**
     * @return Reflector<Parcel>
     */
    public function reflectorOf(Parcel $parcel): Reflector
    {
        return static::reflect($parcel);
    }
}
