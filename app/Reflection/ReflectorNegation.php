<?php

declare(strict_types=1);

namespace App\Reflection;

use App\Reflection\Exceptions\QuestionNotNegatable;
use App\Support\DeclaredType;
use App\Support\Reflector;

/**
 * A Reflector's yes-or-no questions turned around, so a caller reads $type->not()->is(X) instead of a bang. It asks
 * the wrapped Reflector the same question and answers the opposite, so every question the Reflector answers with a
 * bool works here with no second copy; any other method is refused.
 *
 * @template-covariant T of object
 *
 * @mixin Reflector<T>
 */
final readonly class ReflectorNegation
{
    /**
     * @param  Reflector<T>  $type
     */
    public function __construct(private Reflector $type) {}

    /**
     * @param  list<mixed>  $arguments
     *
     * @throws QuestionNotNegatable
     */
    public function __call(string $method, array $arguments): bool
    {
        if (! self::isQuestion($method)) {
            throw QuestionNotNegatable::for($method);
        }

        return ! $this->type->{$method}(...$arguments);
    }

    /**
     * Whether the Reflector has a public instance method of this name that answers bool.
     */
    private static function isQuestion(string $method): bool
    {
        $reflector = Reflector::of(Reflector::class);

        if (! $reflector->hasMethod($method)) {
            return false;
        }

        $question = $reflector->method($method);

        return $question->isPublic()
            && ! $question->isStatic()
            && $question->returnType()->filter(fn (DeclaredType $type) => $type->isNamedAs('bool'))->isDefined();
    }
}
