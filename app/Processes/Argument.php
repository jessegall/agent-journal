<?php

declare(strict_types=1);

namespace App\Processes;

use App\Processes\Contracts\Condition;
use Closure;

/**
 * One rule of a declared command line: the words it adds, in its place, while its condition holds.
 *
 * @template-contravariant TContext of object
 */
final readonly class Argument
{
    /**
     * @param  Condition<TContext>  $condition
     * @param  string|list<string>|Closure(TContext): (string|list<string>)  $value
     */
    private function __construct(private Condition $condition, private string|array|Closure $value) {}

    /**
     * @template T of object
     *
     * @param  Condition<T>  $condition
     * @param  string|list<string>|Closure(T): (string|list<string>)  $value
     * @return self<T>
     */
    public static function for(Condition $condition, string|array|Closure $value): self
    {
        return new self($condition, $value);
    }

    /**
     * @template T of object
     *
     * @param  Condition<T>  $condition
     * @param  string|list<string>|Closure(T): (string|list<string>)  $value
     * @return self<T>
     */
    public static function unless(Condition $condition, string|array|Closure $value): self
    {
        return new self(new Negation($condition), $value);
    }

    /**
     * The template with each {value} replaced by the context's value; no words when the context has none.
     *
     * @template T of object
     *
     * @param  list<string>  $template
     * @param  Closure(T): (string|null)  $value
     * @return self<T>
     */
    public static function option(array $template, Closure $value): self
    {
        $values = function (object $context) use ($template, $value): array {
            /**
             * @var T $context
             */
            $text = $value($context);

            if ($text === null) {
                return [];
            }

            return str_replace('{value}', $text, $template);
        };

        return new self(new AnyContext(), $values);
    }

    /**
     * @param  TContext  $context
     * @return list<string>
     */
    public function valueFor(object $context): array
    {
        if (! $this->condition->holdsFor($context)) {
            return [];
        }

        $value = $this->value instanceof Closure ? ($this->value)($context) : $this->value;

        if (is_string($value)) {
            return [$value];
        }

        return $value;
    }
}
