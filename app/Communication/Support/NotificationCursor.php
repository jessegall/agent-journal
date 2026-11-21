<?php

declare(strict_types=1);

namespace App\Communication\Support;

use App\Communication\Exceptions\NotificationCursorInvalid;

/**
 * The opaque cursor of a notification page: the scope it was issued for and the sequence the next page reads below,
 * so a cursor taken to another scope is refused.
 */
final readonly class NotificationCursor
{
    private function __construct(
        public string $scopeId,
        public int $beforeSequence,
    ) {}

    public static function at(string $scopeId, int $beforeSequence): self
    {
        return new self($scopeId, $beforeSequence);
    }

    /**
     * @throws NotificationCursorInvalid
     */
    public static function read(string $text, string $scopeId): self
    {
        $decoded = base64_decode(strtr($text, '-_', '+/'), true);
        $parts = $decoded === false ? [] : explode('.', $decoded);

        if (count($parts) !== 2 || $parts[0] !== $scopeId || ! ctype_digit($parts[1])) {
            throw NotificationCursorInvalid::create();
        }

        return new self($scopeId, (int) $parts[1]);
    }

    public function text(): string
    {
        return rtrim(strtr(base64_encode("{$this->scopeId}.{$this->beforeSequence}"), '+/', '-_'), '=');
    }
}
