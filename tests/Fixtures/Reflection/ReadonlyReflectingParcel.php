<?php

declare(strict_types=1);

namespace Tests\Fixtures\Reflection;

use App\Concerns\Reflects;
use App\Support\ReflectedType;

/**
 * A final readonly class that reflects itself.
 */
final readonly class ReadonlyReflectingParcel
{
    use Reflects;

    public function __construct(public string $label) {}

    /**
     * @return ReflectedType<self>
     */
    public static function reflector(): ReflectedType
    {
        return self::reflect();
    }
}
