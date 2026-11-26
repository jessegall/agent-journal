<?php

declare(strict_types=1);

namespace App\Values;

/**
 * The screen rows a key write is meant for, named by the SHA-256 of their text joined by newlines.
 */
final readonly class RowGuard
{
    public function __construct(public int $from, public int $to, public string $hash) {}

    /**
     * @return array{from: int, to: int, hash: string}
     */
    public function payload(): array
    {
        return [
            'from' => $this->from,
            'to' => $this->to,
            'hash' => $this->hash,
        ];
    }
}
