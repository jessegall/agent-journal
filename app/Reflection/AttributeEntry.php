<?php

declare(strict_types=1);

namespace App\Reflection;

use App\Reflection\Exceptions\AttributeBuiltRecursively;
use App\Reflection\Exceptions\AttributeTypeUnexpected;

/**
 * One attribute of a selection, seen as the class the selection asked for: its name and arguments without building
 * it, and its instance.
 *
 * @template A of object
 */
final class AttributeEntry
{
    /**
     * @param  class-string<A>  $type
     */
    public function __construct(private readonly AttributeOccurrence $occurrence, private readonly string $type) {}

    public function name(): string
    {
        return $this->occurrence->name();
    }

    /**
     * @return array<int|string, mixed>
     */
    public function arguments(): array
    {
        return $this->occurrence->arguments();
    }

    /**
     * @return A
     *
     * @throws AttributeBuiltRecursively
     * @throws AttributeTypeUnexpected
     */
    public function instance(): object
    {
        return $this->typed($this->occurrence->instance());
    }

    /**
     * A new build of the attribute, never kept or shared, for a reader whose use changes the object it is given, such
     * as a validation rule a normalizer rewrites.
     *
     * @return A
     *
     * @throws AttributeTypeUnexpected
     */
    public function freshInstance(): object
    {
        return $this->typed($this->occurrence->freshInstance());
    }

    /**
     * @return A
     *
     * @throws AttributeTypeUnexpected
     */
    private function typed(object $instance): object
    {
        if (! $instance instanceof $this->type) {
            throw AttributeTypeUnexpected::for($this->name(), $this->type);
        }

        return $instance;
    }
}
