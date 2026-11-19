<?php

declare(strict_types=1);

namespace App\Communication\Support;

use App\Communication\Exceptions\MessageBodyEmpty;
use App\Communication\Exceptions\MessageBodyTooLong;

/**
 * The text of a message: not blank, and at most 64 KiB of UTF-8.
 */
final readonly class MessageBody
{
    public const int MOST_BYTES = 65_536;

    private function __construct(public string $text) {}

    /**
     * @throws MessageBodyEmpty
     * @throws MessageBodyTooLong
     */
    public static function from(string $text): self
    {
        if (preg_match('/\S/u', $text) !== 1) {
            throw MessageBodyEmpty::forSend();
        }

        if (strlen($text) > self::MOST_BYTES) {
            throw MessageBodyTooLong::forBytes(strlen($text));
        }

        return new self($text);
    }
}
