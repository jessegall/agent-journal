<?php

declare(strict_types=1);

namespace App\Pipelines\Support;

use App\Bus\Contracts\PipelineContext;
use App\Support\DeclaredType;
use App\Support\Reflector;
use PhpOption\None;
use PhpOption\Option;

/**
 * How a pipe's handle method is called, read from its declaration: with the carried value it types or with the
 * context, with or without the rest of the pipeline as $next, and what it returns. The runner and the validator read
 * the same signature.
 */
final readonly class PipeSignature
{
    /**
     * @param  Option<DeclaredType>  $takes  the carried value's declared type; none for the context or no type
     * @param  Option<DeclaredType>  $returns
     */
    private function __construct(
        public Option $takes,
        public bool $takesContext,
        public bool $takesNext,
        public Option $returns,
    ) {}

    /**
     * @param  class-string  $pipe
     */
    public static function of(string $pipe): self
    {
        $handle = Reflector::of($pipe)->method('handle');
        $parameters = $handle->parameters();
        $first = $parameters === [] ? None::create() : $parameters[0]->type();
        $takesContext = $first->filter(self::namesContext(...))->isDefined();

        return new self(
            $takesContext ? None::create() : $first,
            $takesContext,
            count($parameters) > 1,
            $handle->returnType(),
        );
    }

    private static function namesContext(DeclaredType $type): bool
    {
        return $type->namesClass()
            && Reflector::exists($type->name())
            && Reflector::of($type->name())->is(PipelineContext::class);
    }
}
