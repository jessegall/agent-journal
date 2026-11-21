<?php

declare(strict_types=1);

namespace App\Reflection\Concerns;

use App\Reflection\Exceptions\AttributeMissing;
use App\Reflection\Support\Attributes;
use App\Reflection\Support\DeclarationAttributes;

/**
 * The attribute reads every reflected declaration answers, a class, a method, a property or a parameter, through the
 * one DeclarationAttributes it keeps.
 */
trait ReadsDeclaredAttributes
{
    /**
     * The declaration's own attributes of exactly this class, in declaration order.
     *
     * @template A of object
     *
     * @param  class-string<A>  $type
     * @return Attributes<A>
     */
    public function attributes(string $type): Attributes
    {
        return $this->declaredAttributes()->attributes($type);
    }

    /**
     * The declaration's own attributes of this class or of any class that extends or implements it.
     *
     * @template A of object
     *
     * @param  class-string<A>  $type
     * @return Attributes<A>
     */
    public function attributesImplementing(string $type): Attributes
    {
        return $this->declaredAttributes()->attributesImplementing($type);
    }

    /**
     * The declaration's first own attribute of exactly this class, built.
     *
     * @template A of object
     *
     * @param  class-string<A>  $type
     * @return A
     *
     * @throws AttributeMissing
     */
    public function attribute(string $type): object
    {
        return $this->declaredAttributes()->attribute($type);
    }

    /**
     * Whether the declaration carries an attribute of exactly this class, without building any.
     *
     * @param  class-string  $type
     */
    public function hasAttribute(string $type): bool
    {
        return $this->declaredAttributes()->hasAttribute($type);
    }

    abstract private function declaredAttributes(): DeclarationAttributes;
}
