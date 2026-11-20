<?php

declare(strict_types=1);

namespace App\Processes\Values;

use App\Processes\Enums\OperandType;
use App\Processes\Enums\UnresolvedType;

/**
 * The words a declared command accepts after its program and subcommands: its options, its operand slots, and
 * whether -- ends the options. A word the grammar does not accept is reported as unresolved, never passed over.
 */
final readonly class ArgumentGrammar
{
    /**
     * @param  list<OptionGrammar>  $options
     * @param  list<OperandType>  $operands  the operand slots in order
     */
    private function __construct(
        public array $options,
        public array $operands,
        public bool $repeatsLastOperand,
        public bool $endsOptionsAtDoubleDash,
        public bool $acceptsNumericOptions = false,
        public int $minimumOperands = 0,
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'options' => array_map(fn (OptionGrammar $option): array => $option->toArray(), $this->options),
            'operands' => array_map(fn (OperandType $type): string => $type->value, $this->operands),
            'repeats_last_operand' => $this->repeatsLastOperand,
            'ends_options_at_double_dash' => $this->endsOptionsAtDoubleDash,
            'accepts_numeric_options' => $this->acceptsNumericOptions,
            'minimum_operands' => $this->minimumOperands,
        ];
    }

    /**
     * @param  array<string, mixed>  $fields  the shape toArray writes
     */
    public static function fromArray(array $fields): self
    {
        return new self(
            array_values(array_map(OptionGrammar::fromArray(...), $fields['options'])),
            array_values(array_map(OperandType::from(...), $fields['operands'])),
            $fields['repeats_last_operand'],
            $fields['ends_options_at_double_dash'],
            $fields['accepts_numeric_options'],
            $fields['minimum_operands'],
        );
    }

    public static function none(): self
    {
        return new self([], [], false, false);
    }

    /**
     * A grammar of optional flags only, such as git branch --list.
     *
     * @param  list<string>  $flags
     */
    public static function options(array $flags): self
    {
        return new self(array_map(fn (string $flag) => OptionGrammar::flag($flag), $flags), [], false, false);
    }

    /**
     * A grammar that requires one option followed by its operands, such as git branch -D <branch>.
     */
    public static function optionWithOperands(string $option, OperandType ...$operands): self
    {
        return new self([OptionGrammar::flag($option)->required()], array_values($operands), false, false);
    }

    public static function operands(OperandType ...$operands): self
    {
        return new self([], array_values($operands), false, false);
    }

    public function withOptions(OptionGrammar ...$options): self
    {
        return clone ($this, ['options' => [...$this->options, ...array_values($options)]]);
    }

    public function withOperands(OperandType ...$operands): self
    {
        return clone ($this, ['operands' => [...$this->operands, ...array_values($operands)]]);
    }

    /**
     * Accepts any number of operands of the last slot's type, as cat accepts many paths.
     */
    public function repeating(): self
    {
        return clone ($this, ['repeatsLastOperand' => true]);
    }

    public function endingOptionsAtDoubleDash(): self
    {
        return clone ($this, ['endsOptionsAtDoubleDash' => true]);
    }

    /**
     * Requires at least this many operands, as git branch topic requires the new branch's name.
     */
    public function requiringOperands(int $count): self
    {
        return clone ($this, ['minimumOperands' => $count]);
    }

    /**
     * Accepts a count written as an option, as head -20 and tail -5 take it.
     */
    public function acceptingNumericOptions(): self
    {
        return clone ($this, ['acceptsNumericOptions' => true]);
    }

    /**
     * What the grammar does not accept in these words; an empty list means the words match.
     *
     * @param  list<Word>  $words
     * @return list<UnresolvedFact>
     */
    public function check(array $words, int $node): array
    {
        $seen = [];
        $operandCount = 0;
        $afterDoubleDash = false;

        for ($index = 0; $index < count($words); $index++) {
            $text = $words[$index]->literal();

            if ($this->endsOptionsAtDoubleDash && ! $afterDoubleDash && $text === '--') {
                $afterDoubleDash = true;

                continue;
            }

            if (! $afterDoubleDash && $this->isOptionWord($text)) {
                $options = $this->optionsIn((string) $text);

                if ($options === []) {
                    $problem = "The option {$text} is not declared.";

                    return [new UnresolvedFact(UnresolvedType::UnknownOption, $node, $problem)];
                }
                $seen = [...$seen, ...$options];
                $last = $options[array_key_last($options)];
                $index += $last->takesNextWord((string) $text) ? 1 : 0;

                continue;
            }

            if ($operandCount >= count($this->operands) && ! $this->hasRepeatingOperand()) {
                $problem = 'The word '.($text ?? 'with an expansion').' is not an accepted operand.';

                return [new UnresolvedFact(UnresolvedType::UnknownSubcommand, $node, $problem)];
            }
            $operandCount++;
        }

        if ($operandCount < $this->minimumOperands) {
            $problem = "{$this->minimumOperands} operands are required here.";

            return [new UnresolvedFact(UnresolvedType::UnknownSubcommand, $node, $problem)];
        }

        return $this->missingRequired($seen, $node);
    }

    /**
     * Whether no command line can match both grammars: one requires an option the other does not accept, or more
     * operands than the other takes.
     */
    public function isDisjointFrom(self $other): bool
    {
        return $this->requiresOptionUnknownTo($other) || $other->requiresOptionUnknownTo($this)
            || $this->minimumOperands > $other->maximumOperands() || $other->minimumOperands > $this->maximumOperands();
    }

    /**
     * The most operands the grammar accepts; a repeating last slot accepts any number.
     */
    private function maximumOperands(): int|float
    {
        return $this->hasRepeatingOperand() ? INF : count($this->operands);
    }

    private function requiresOptionUnknownTo(self $other): bool
    {
        return array_any(
            $this->options,
            fn (OptionGrammar $option): bool => $option->isRequired && ! $other->knowsOption($option),
        );
    }

    private function knowsOption(OptionGrammar $option): bool
    {
        return array_any($this->options, fn (OptionGrammar $known): bool => $known->sharesNameWith($option));
    }

    private function isOptionWord(string|null $text): bool
    {
        return $text !== null && $text !== '-' && str_starts_with($text, '-');
    }

    /**
     * The options a word holds: one option by name, a numeric count, a short option with its value attached (-n10), or
     * a cluster of short flags (-la) where only the last may take the next word as its value. None when any part of
     * the word is undeclared.
     *
     * @return list<OptionGrammar>
     */
    private function optionsIn(string $text): array
    {
        $named = array_values(array_filter(
            $this->options,
            fn (OptionGrammar $option): bool => $option->matches($text),
        ));

        if ($named !== []) {
            return [$named[0]];
        }

        if ($this->acceptsNumericOptions && preg_match('/^-[0-9]+$/', $text) === 1) {
            return [OptionGrammar::flag($text)];
        }

        if (preg_match('/^-[A-Za-z0-9]{2,}$/', $text) !== 1) {
            return [];
        }
        $first = $this->shortOption($text[1]);

        if ($first !== [] && $first[0]->takesValue()) {
            return $first;
        }

        return $this->combinedFlagsOf(substr($text, 1));
    }

    /**
     * @return list<OptionGrammar>
     */
    private function combinedFlagsOf(string $letters): array
    {
        $options = [];

        foreach (str_split($letters) as $position => $letter) {
            $option = $this->shortOption($letter);

            if ($option === [] || ($option[0]->takesValue() && $position < strlen($letters) - 1)) {
                return [];
            }
            $options[] = $option[0];
        }

        return $options;
    }

    /**
     * @return list<OptionGrammar>
     */
    private function shortOption(string $letter): array
    {
        return array_values(array_filter(
            $this->options,
            fn (OptionGrammar $option): bool => in_array("-{$letter}", $option->names, true),
        ));
    }

    /**
     * Whether the last operand slot repeats, so any number of operands is accepted.
     */
    private function hasRepeatingOperand(): bool
    {
        return $this->repeatsLastOperand && $this->operands !== [];
    }

    /**
     * @param  list<OptionGrammar>  $seen
     * @return list<UnresolvedFact>
     */
    private function missingRequired(array $seen, int $node): array
    {
        $missing = array_filter(
            $this->options,
            fn (OptionGrammar $option): bool => $option->isRequired && ! in_array($option, $seen, true),
        );

        return array_values(array_map(
            fn (OptionGrammar $option) => new UnresolvedFact(
                UnresolvedType::UnknownOption,
                $node,
                "The option {$option->names[0]} is required here.",
            ),
            $missing,
        ));
    }
}
