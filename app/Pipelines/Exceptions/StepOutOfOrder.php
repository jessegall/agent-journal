<?php

declare(strict_types=1);

namespace App\Pipelines\Exceptions;

use LogicException;

/**
 * A pipe was handed an input it does not take, or a pipeline ended on an output other than the one its caller reads: a
 * step is missing or stands in the wrong place, which is a definition to read rather than a value to debug.
 */
final class StepOutOfOrder extends LogicException
{
    /**
     * @param  class-string  $pipe
     */
    public static function handing(string $pipe, object $input): self
    {
        return new self(sprintf('[%s] was handed a [%s], which it does not take.', $pipe, $input::class));
    }

    /**
     * @param  class-string  $definition
     * @param  class-string  $wanted
     */
    public static function ending(string $definition, string $wanted, object $output): self
    {
        return new self(sprintf('[%s] ended on a [%s] where a [%s] is read.', $definition, $output::class, $wanted));
    }

    /**
     * @param  class-string  $definition
     * @param  class-string  $declared
     */
    public static function entering(string $definition, string $declared, object $input): self
    {
        return new self(sprintf('[%s] takes a [%s] and was handed a [%s].', $definition, $declared, $input::class));
    }

    /**
     * @param  class-string  $definition
     * @param  class-string  $declared
     */
    public static function leaving(string $definition, string $declared, object $output): self
    {
        return new self(sprintf('[%s] hands out a [%s] and ended on a [%s].', $definition, $declared, $output::class));
    }

    /**
     * @param  class-string  $wanted
     */
    public static function endingSteps(string $wanted, object $output): self
    {
        return new self(sprintf('The listed steps ended on a [%s] where a [%s] is read.', $output::class, $wanted));
    }
}
