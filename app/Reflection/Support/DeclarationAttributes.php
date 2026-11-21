<?php

declare(strict_types=1);

namespace App\Reflection\Support;

use App\Reflection\Enums\AttributeMatch;
use App\Reflection\Exceptions\AttributeMissing;
use Closure;
use ReflectionAttribute;

/**
 * The attributes written on one declaration: every occurrence read once in PHP's order, and each selection by class
 * kept, so overlapping selections share the same occurrences and an empty selection is a kept answer too. A class's
 * attributes are its own; its parents' are not walked.
 */
final class DeclarationAttributes
{
    /**
     * @var list<AttributeOccurrence>
     */
    private array $occurrences;

    /**
     * Each selection made, by how it matches and the lowercase class it asked for.
     *
     * @var array<string, Attributes<object>>
     */
    private array $selections = [];

    /**
     * @param  Closure(): list<ReflectionAttribute<object>>  $readAttributes  reads the declaration's attributes from PHP
     * @param  string  $label  what the declaration is in a sentence, such as class App\Thing
     */
    public function __construct(private readonly Closure $readAttributes, private readonly string $label) {}

    /**
     * The attributes of exactly this class.
     *
     * @template A of object
     *
     * @param  class-string<A>  $type
     * @return Attributes<A>
     */
    public function attributes(string $type): Attributes
    {
        return $this->selection(AttributeMatch::Exact, $type);
    }

    /**
     * The attributes of this class or of any class that extends or implements it.
     *
     * @template A of object
     *
     * @param  class-string<A>  $type
     * @return Attributes<A>
     */
    public function attributesImplementing(string $type): Attributes
    {
        return $this->selection(AttributeMatch::Implementing, $type);
    }

    /**
     * The first attribute of exactly this class, built.
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
        return $this->attributes($type)->first()->getOrThrow(AttributeMissing::on($this->label, $type));
    }

    /**
     * Whether an attribute of exactly this class is written, without building any.
     *
     * @param  class-string  $type
     */
    public function hasAttribute(string $type): bool
    {
        return $this->attributes($type)->count() > 0;
    }

    /**
     * @template A of object
     *
     * @param  class-string<A>  $type
     * @return Attributes<A>
     */
    private function selection(AttributeMatch $match, string $type): Attributes
    {
        $key = $match->value.':'.strtolower(ltrim($type, '\\'));

        $selection = $this->selections[$key] ??= new Attributes(array_values(array_map(
            fn (AttributeOccurrence $occurrence) => new AttributeEntry($occurrence, $type),
            array_filter(
                $this->occurrences(),
                fn (AttributeOccurrence $occurrence) => $match->selects($occurrence->name(), $type),
            ),
        )));

        /**
         * A selection is kept only under the class it was made for.
         *
         * @var Attributes<A> $selection
         */
        return $selection;
    }

    /**
     * @return list<AttributeOccurrence>
     */
    private function occurrences(): array
    {
        return $this->occurrences ??= array_map(
            fn (ReflectionAttribute $attribute) => new AttributeOccurrence(
                $attribute->getName(),
                fn () => $attribute->getArguments(),
                fn () => $attribute->newInstance(),
                $this->label,
            ),
            ($this->readAttributes)(),
        );
    }
}
