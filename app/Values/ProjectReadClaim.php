<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\ProjectReadType;
use App\Models\Projects\ProjectRead;
use JsonSerializable;

/**
 * A read handed to a project's host: which binding's folder or file to read, and how much of it to send.
 */
final readonly class ProjectReadClaim implements JsonSerializable
{
    public function __construct(
        public string $id,
        public string $bindingId,
        public ProjectReadType $type,
        public string $path,
    ) {}

    public static function of(ProjectRead $read): self
    {
        return new self($read->id, $read->binding_id, $read->type, $read->path);
    }

    /**
     * @return array{id: string, binding_id: string, type: string, path: string, entries_limit: int, text_limit: int}
     */
    public function jsonSerialize(): array
    {
        return [
            'id' => $this->id,
            'binding_id' => $this->bindingId,
            'type' => $this->type->value,
            'path' => $this->path,
            'entries_limit' => ProjectRead::DIRECTORY_ENTRY_LIMIT,
            'text_limit' => ProjectRead::FILE_TEXT_BYTE_LIMIT,
        ];
    }
}
