<?php

declare(strict_types=1);

namespace App\Support;

use App\Exceptions\MessageBodyTooLong;

/**
 * The text of a message: at most 64 KiB of UTF-8. The command that carries it refuses a blank one.
 */
final readonly class MessageBody
{
    public const int MOST_BYTES = 65_536;

    private function __construct(public string $text) {}

    /**
     * @throws MessageBodyTooLong
     */
    public static function from(string $text): self
    {
        if (strlen($text) > self::MOST_BYTES) {
            throw MessageBodyTooLong::forBytes(strlen($text));
        }

        return new self($text);
    }
}
