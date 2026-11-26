<?php

declare(strict_types=1);

namespace App\Notifications;

use App\Notifications\Exceptions\NotificationCursorInvalid;

/**
 * Where a catch-up of one scope's changes stands: the scope it was issued for, the last version examined and the
 * upper version the scan was pinned to, so pages of one scan never reach past it. A cursor taken to another scope is
 * refused.
 */
final readonly class NotificationChangeCursor
{
    private function __construct(
        public string $scopeId,
        public int $afterVersion,
        public int $upperVersion,
    ) {}

    public static function at(string $scopeId, int $afterVersion, int $upperVersion): self
    {
        return new self($scopeId, $afterVersion, $upperVersion);
    }

    /**
     * @throws NotificationCursorInvalid
     */
    public static function read(string $text, string $scopeId): self
    {
        $decoded = base64_decode(strtr($text, '-_', '+/'), true);
        $parts = $decoded === false ? [] : explode('.', $decoded);

        if (count($parts) !== 3 || $parts[0] !== $scopeId || ! ctype_digit($parts[1]) || ! ctype_digit($parts[2])) {
            throw NotificationCursorInvalid::create();
        }

        return new self($scopeId, (int) $parts[1], (int) $parts[2]);
    }

    /**
     * Whether a scan is under way, so its pinned upper version still holds.
     */
    public function isScanning(): bool
    {
        return $this->upperVersion > $this->afterVersion;
    }

    public function text(): string
    {
        return rtrim(
            strtr(base64_encode("{$this->scopeId}.{$this->afterVersion}.{$this->upperVersion}"), '+/', '-_'),
            '=',
        );
    }
}
