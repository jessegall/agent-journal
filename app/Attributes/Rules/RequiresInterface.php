<?php

declare(strict_types=1);

namespace App\Attributes\Rules;

use App\Support\ReflectedType;
use Attribute;

/**
 * On a trait: a class that uses it implements at least one of these interfaces, or it is refused when the container
 * resolves it. Repeated, each one must hold.
 */
#[Attribute(Attribute::TARGET_CLASS | Attribute::IS_REPEATABLE)]
final readonly class RequiresInterface
{
    /**
     * @var list<class-string>
     */
    public array $interfaces;

    /**
     * @param  class-string  ...$interfaces
     */
    public function __construct(string ...$interfaces)
    {
        $this->interfaces = array_values($interfaces);
    }

    /**
     * @param  ReflectedType<object>  $type
     */
    public function isMetBy(ReflectedType $type): bool
    {
        return array_intersect($this->interfaces, $type->typeNames()) !== [];
    }
}
