<?php

declare(strict_types=1);

namespace Tests\Fixtures\PhpStan;

use ReflectionClass;

/**
 * A stand-in wrapper file: native reflection inside it passes, a native reflector in a public signature does not.
 */
final class RawReflectionWrapper
{
    /**
     * @var ReflectionClass<self>
     */
    private ReflectionClass $type;

    public function __construct()
    {
        $this->type = new ReflectionClass(self::class);
    }

    public function name(): string
    {
        return $this->type->getName();
    }

    /**
     * @return ReflectionClass<self>
     */
    public function native(): ReflectionClass
    {
        return $this->type;
    }
}
