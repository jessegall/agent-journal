<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\CommandRules\ExampleType;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * One example a proposal gives for review: a command line the rule must match with the classes it must give, or a
 * line the rule must not match. Examples are compared, never run.
 */
#[MapName(SnakeCaseMapper::class)]
final class RuleExample extends Data
{
    public function __construct(
        public readonly ExampleType $type,
        public readonly string $line,
        public readonly CommandClassSet $classes,
    ) {}

    public static function positive(string $line, CommandClassSet $classes): self
    {
        return new self(ExampleType::Positive, $line, $classes);
    }

    public static function negative(string $line): self
    {
        return new self(ExampleType::Negative, $line, CommandClassSet::none());
    }

    /**
     * The example as a reviewer reads it: must match with its classes, or must not match.
     */
    public function label(): string
    {
        if ($this->isPositive()) {
            return "matches {$this->line} as ".implode(', ', $this->classes->values());
        }

        return "does not match {$this->line}";
    }

    public function isPositive(): bool
    {
        return $this->type === ExampleType::Positive;
    }
}
