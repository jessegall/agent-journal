<?php

declare(strict_types=1);

namespace App\Processes\Values;

use App\Processes\Enums\OutputStream;
use App\Processes\Enums\RecordRole;

/**
 * One record a reader recognised, with its stream, its byte range, its role and the values it captured.
 */
final readonly class OutputRecord
{
    /**
     * @param  array<string, string>  $captures
     */
    public function __construct(
        public OutputStream $stream,
        public int $start,
        public int $end,
        public RecordRole $role,
        public array $captures,
    ) {}

    /**
     * The whole number a capture holds, or null when the record captured none there.
     */
    public function count(string $field): int|null
    {
        $value = $this->captures[$field] ?? '';

        return ctype_digit($value) ? (int) $value : null;
    }

    /**
     * @return array{stream: string, start: int, end: int, role: string, captures: array<string, string>}
     */
    public function toArray(): array
    {
        return [
            'stream' => $this->stream->value,
            'start' => $this->start,
            'end' => $this->end,
            'role' => $this->role->value,
            'captures' => $this->captures,
        ];
    }

    /**
     * @param  array{stream: string, start: int, end: int, role: string, captures: array<string, string>}  $fields
     */
    public static function fromArray(array $fields): self
    {
        $stream = OutputStream::from($fields['stream']);

        return new self($stream, $fields['start'], $fields['end'], RecordRole::from($fields['role']), $fields['captures']);
    }
}
