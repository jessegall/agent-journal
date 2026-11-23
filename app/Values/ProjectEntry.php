<?php

declare(strict_types=1);

namespace App\Values;

/**
 * One entry of a project folder as its host listed it: its name, whether it is a folder, and its size in bytes.
 */
final readonly class ProjectEntry
{
    public function __construct(
        public string $name,
        public bool $isFolder,
        public int $size,
    ) {}

    /**
     * The entry from its fields as a host sends them and a read keeps them.
     *
     * @param  array{name: string, is_folder: bool, size: int}  $fields
     */
    public static function fromFields(array $fields): self
    {
        return new self($fields['name'], $fields['is_folder'], $fields['size']);
    }

    /**
     * @return array{name: string, is_folder: bool, size: int}
     */
    public function fields(): array
    {
        return ['name' => $this->name, 'is_folder' => $this->isFolder, 'size' => $this->size];
    }
}
