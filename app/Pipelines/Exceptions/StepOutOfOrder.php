<?php

declare(strict_types=1);

namespace App\Pipelines\Exceptions;

use LogicException;

/**
 * A pipe was handed a stage it does not take, or a pipeline ended on a stage other than the one its caller reads: a step
 * is missing or stands in the wrong place, which is a definition to read rather than a value to debug.
 */
final class StepOutOfOrder extends LogicException
{
    /**
     * @param  class-string  $pipe
     */
    public static function handing(string $pipe, object $stage): self
    {
        return new self(sprintf('[%s] was handed a [%s], which it does not take.', $pipe, $stage::class));
    }

    /**
     * @param  class-string  $definition
     * @param  class-string  $wanted
     */
    public static function ending(string $definition, string $wanted, object $stage): self
    {
        return new self(sprintf('[%s] ended on a [%s] where a [%s] is read.', $definition, $stage::class, $wanted));
    }
}
