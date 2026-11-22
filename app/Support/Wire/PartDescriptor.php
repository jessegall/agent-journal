<?php

declare(strict_types=1);

namespace App\Support\Wire;

use App\Enums\PartType;
use App\Support\Cards\Contracts\DockPart;
use App\Support\Wire\Contracts\PartField;

/**
 * How one part class goes on the wire: the literal type it is written as, its fields, and whether it holds children.
 */
final readonly class PartDescriptor
{
    /**
     * @param  class-string<DockPart>  $class
     * @param  list<PartField>  $fields
     */
    public function __construct(public string $class, public PartType $type, public array $fields) {}

    public function nodeName(): string
    {
        return str_replace(' ', '', ucwords(str_replace('-', ' ', $this->type->value))).'Node';
    }

    public function typeScript(): string
    {
        $fields = array_map(fn (PartField $field) => "{$field->name()}: {$field->typeScript()}", $this->fields);
        $children = $this->type->isContainer() ? ['children: DockNode[]'] : [];

        return '{'.implode('; ', ["type: '{$this->type->value}'", 'key: string', ...$fields, ...$children]).'}';
    }
}
