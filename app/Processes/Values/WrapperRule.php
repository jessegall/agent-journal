<?php

declare(strict_types=1);

namespace App\Processes\Values;

/**
 * A program that runs another command, such as env, sudo or timeout (doc 21 revision 3, section 8): its own options,
 * the classes it adds by itself, how many operands it takes before the child, and whether NAME=value words come first.
 * The child is classified as a command of its own and its classes are added to the wrapper's.
 */
final readonly class WrapperRule
{
    /**
     * @param  list<OptionGrammar>  $options
     */
    public function __construct(
        public string $family,
        public array $options,
        public CommandClassSet $classes,
        public int $leadingOperands = 0,
        public bool $takesAssignments = false,
    ) {}

    /**
     * The option the word is, or none when the wrapper does not declare it.
     *
     * @return list<OptionGrammar>
     */
    public function optionFor(string $word): array
    {
        return array_values(array_filter($this->options, fn (OptionGrammar $option): bool => $option->matches($word)));
    }
}
