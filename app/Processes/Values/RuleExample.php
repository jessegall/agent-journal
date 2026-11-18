<?php

declare(strict_types=1);

namespace App\Processes\Values;

use App\Processes\Contracts\StoredValue;
use App\Processes\Enums\ExampleType;

/**
 * One example a proposal gives for review: a command line the rule must match with the classes it must give, or a
 * line the rule must not match. Examples are compared, never run.
 */
final readonly class RuleExample implements StoredValue
{
    private function __construct(public ExampleType $type, public string $line, public CommandClassSet $classes) {}

    public static function positive(string $line, CommandClassSet $classes): self
    {
        return new self(ExampleType::Positive, $line, $classes);
    }

    public static function negative(string $line): self
    {
        return new self(ExampleType::Negative, $line, CommandClassSet::empty());
    }

    /**
     * @return array{type: string, line: string, classes: list<string>}
     */
    public function toArray(): array
    {
        return ['type' => $this->type->value, 'line' => $this->line, 'classes' => $this->classes->toArray()];
    }

    /**
     * @param  array<string, mixed>  $fields  the shape toArray writes
     */
    public static function fromArray(array $fields): self
    {
        return new self(
            ExampleType::from($fields['type']),
            $fields['line'],
            CommandClassSet::fromArray($fields['classes']),
        );
    }

    /**
     * The example as a reviewer reads it: must match with its classes, or must not match.
     */
    public function label(): string
    {
        return $this->isPositive()
            ? "matches {$this->line} as ".implode(', ', $this->classes->toArray())
            : "does not match {$this->line}";
    }

    public function isPositive(): bool
    {
        return $this->type === ExampleType::Positive;
    }
}
