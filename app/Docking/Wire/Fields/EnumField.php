<?php

declare(strict_types=1);

namespace App\Docking\Wire\Fields;

use App\Docking\Cards\Contracts\DockPart;
use App\Docking\Wire\Contracts\PartField;
use App\Docking\Wire\DestinationEncoder;
use BackedEnum;

/**
 * A field holding one case of a closed enum, written as its value.
 */
final readonly class EnumField implements PartField
{
    /**
     * @param  class-string<BackedEnum>  $enum
     */
    public function __construct(private string $name, private string $enum) {}

    /**
     * @param  class-string<BackedEnum>  $enum
     */
    public static function named(string $name, string $enum): self
    {
        return new self($name, $enum);
    }

    public function name(): string
    {
        return $this->name;
    }

    public function typeScript(): string
    {
        return implode(' | ', array_map(fn (BackedEnum $case) => "'{$case->value}'", $this->enum::cases()));
    }

    public function encode(DockPart $part, DestinationEncoder $destinations): mixed
    {
        $value = $part->{$this->name};

        return $value instanceof BackedEnum ? $value->value : null;
    }
}
