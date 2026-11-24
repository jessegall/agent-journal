<?php

declare(strict_types=1);

namespace App\Values;

use App\Contracts\Settings\StoredValue;
use App\Enums\ExampleType;
use App\Support\Stored\StoredRuleExample;

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
        return self::fromStored(StoredRuleExample::from($fields));
    }

    public static function fromJson(string $json): self
    {
        return self::fromStored(StoredRuleExample::from(json_decode($json, true, flags: JSON_THROW_ON_ERROR)));
    }

    public static function listFromJson(string $json): array
    {
        return array_values(array_map(
            self::fromStored(...),
            StoredRuleExample::collect(json_decode($json, true, flags: JSON_THROW_ON_ERROR)),
        ));
    }

    private static function fromStored(StoredRuleExample $stored): self
    {
        return new self($stored->type, $stored->line, CommandClassSet::fromArray($stored->classes));
    }

    /**
     * The example as a reviewer reads it: must match with its classes, or must not match.
     */
    public function label(): string
    {
        if ($this->isPositive()) {
            return "matches {$this->line} as ".implode(', ', $this->classes->toArray());
        }

        return "does not match {$this->line}";
    }

    public function isPositive(): bool
    {
        return $this->type === ExampleType::Positive;
    }
}
