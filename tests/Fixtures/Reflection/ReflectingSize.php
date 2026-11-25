<?php

declare(strict_types=1);

namespace Tests\Fixtures\Reflection;

use App\Concerns\Reflects;
use App\Support\Reflector;

/**
 * An enum that reflects itself.
 */
enum ReflectingSize
{
    use Reflects;

    case Large;

    /**
     * @return Reflector<self>
     */
    public function reflector(): Reflector
    {
        return self::reflect();
    }
}
