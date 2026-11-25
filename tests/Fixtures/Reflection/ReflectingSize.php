<?php

declare(strict_types=1);

namespace Tests\Fixtures\Reflection;

use App\Concerns\Reflects;
use App\Support\ReflectedType;

/**
 * An enum that reflects itself.
 */
enum ReflectingSize
{
    use Reflects;

    case Large;

    /**
     * @return ReflectedType<self>
     */
    public function reflector(): ReflectedType
    {
        return self::reflect();
    }
}
