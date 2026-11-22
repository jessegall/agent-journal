<?php

declare(strict_types=1);

namespace App\Exceptions;

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
     * @param  class-string  $wanted
     */
    public static function endingSteps(string $wanted, object $output): self
    {
        return new self(sprintf('The listed steps ended on a [%s] where a [%s] is read.', $output::class, $wanted));
    }
}
