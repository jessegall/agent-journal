<?php

declare(strict_types=1);

namespace Tests\Fixtures\Reflection;

use App\Bus\Concerns\Reflects;
use App\Support\Reflector;

/**
 * A final readonly class that reflects itself.
 */
final readonly class ReadonlyReflectingParcel
{
    use Reflects;

    public function __construct(public string $label) {}

    /**
     * @return Reflector<self>
     */
    public static function reflector(): Reflector
    {
        return self::reflect();
    }
}
