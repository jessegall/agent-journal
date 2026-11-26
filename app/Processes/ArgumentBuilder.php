<?php

declare(strict_types=1);

namespace App\Processes;

use App\Processes\Exceptions\CommandLineEmpty;

/**
 * A command line declared as rules in command line order, built for one context.
 *
 * @template TContext of object
 */
abstract readonly class ArgumentBuilder
{
    /**
     * The rules of the command line, its driver first, in the order their words stand on the line.
     *
     * @return list<Argument<TContext>>
     */
    abstract protected function arguments(): array;

    /**
     * @param  TContext  $context
     * @return non-empty-list<string>
     *
     * @throws CommandLineEmpty
     */
    final public function build(object $context): array
    {
        $words = array_merge(
            ...array_map(fn (Argument $argument) => $argument->valueFor($context), $this->arguments()),
        );

        if ($words === []) {
            throw CommandLineEmpty::in(static::class);
        }

        return $words;
    }
}
