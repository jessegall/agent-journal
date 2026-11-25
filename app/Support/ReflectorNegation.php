<?php

declare(strict_types=1);

namespace App\Support;

use App\Exceptions\QuestionNotNegatable;

/**
 * A ReflectedType's yes-or-no questions turned around, so a caller reads $type->not()->is(X) instead of a bang. It asks
 * the wrapped ReflectedType the same question and answers the opposite, so every question the ReflectedType answers with a
 * bool works here with no second copy; any other method is refused.
 *
 * @template-covariant T of object
 *
 * @mixin ReflectedType<T>
 */
final readonly class ReflectorNegation
{
    /**
     * @param  ReflectedType<T>  $type
     */
    public function __construct(private ReflectedType $type) {}

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
     * Whether the ReflectedType has a public instance method of this name that answers bool.
     */
    private static function isQuestion(string $method): bool
    {
        $reflector = ReflectedType::of(ReflectedType::class);

        if (! $reflector->hasMethod($method)) {
            return false;
        }

        $question = $reflector->method($method);

        return $question->isPublic()
            && ! $question->isStatic()
            && $question->returnType()->filter(fn (DeclaredType $type) => $type->isNamedAs('bool'))->isDefined();
    }
}
