<?php

declare(strict_types=1);

namespace App\Sharing\Support;

use App\Sharing\Exceptions\ShareReadRefused;
use Illuminate\Container\Attributes\Config;
use JsonException;

/**
 * Writes page cursors as signed text with the application key and reads them back only for the share, scope
 * version, path, relation and order they were made for.
 */
final readonly class ShareCursors
{
    public function __construct(
        #[Config('app.key')]
        private string $key,
    ) {}

    public function write(ShareCursor $cursor): string
    {
        $payload = self::encode(
            json_encode(
                [
                    $cursor->shareId,
                    $cursor->scopeVersion,
                    $cursor->path,
                    $cursor->relation,
                    $cursor->ordering,
                    $cursor->continuation,
                ],
                JSON_THROW_ON_ERROR,
            ),
        );

        return $payload.'.'.$this->signatureOf($payload);
    }

    /**
     * The cursor in the text, refused when its signature fails or it belongs to another share, scope, path,
     * relation or order than the one expected.
     *
     * @param  ShareCursor  $expected  the cursor's place, with any continuation
     *
     * @throws ShareReadRefused
     */
    public function read(string $text, ShareCursor $expected): ShareCursor
    {
        [$payload, $signature] = explode('.', $text, 2) + [1 => ''];

        if (! hash_equals($this->signatureOf($payload), $signature)) {
            throw ShareReadRefused::staleCursor();
        }

        try {
            $cursor = new ShareCursor(...json_decode(self::decode($payload), false, 3, JSON_THROW_ON_ERROR));
        } catch (JsonException) {
            throw ShareReadRefused::staleCursor();
        }

        return $cursor->belongsTo($expected) ? $cursor : throw ShareReadRefused::staleCursor();
    }

    private function signatureOf(string $payload): string
    {
        return self::encode(hash_hmac('sha256', $payload, $this->key, true));
    }

    private static function encode(string $bytes): string
    {
        return rtrim(strtr(base64_encode($bytes), '+/', '-_'), '=');
    }

    private static function decode(string $text): string
    {
        return (string) base64_decode(strtr($text, '-_', '+/'), true);
    }
}
