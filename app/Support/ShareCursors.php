<?php

declare(strict_types=1);

namespace App\Support;

use App\Data\Sharing\ShareCursorData;
use App\Exceptions\ShareReadRefused;
use Illuminate\Container\Attributes\Config;
use JsonException;
use Spatie\LaravelData\Exceptions\CannotCreateData;
use TypeError;

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
        $encodedCursor = self::encode(json_encode(get_object_vars($cursor), JSON_THROW_ON_ERROR));

        return $encodedCursor.'.'.$this->signatureOf($encodedCursor);
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
        [$encodedCursor, $signature] = explode('.', $text, 2) + [1 => ''];

        if (! hash_equals($this->signatureOf($encodedCursor), $signature)) {
            throw ShareReadRefused::staleCursor();
        }

        try {
            $cursor = ShareCursorData::from(
                json_decode(self::decode($encodedCursor), true, 3, JSON_THROW_ON_ERROR),
            )->cursor();
        } catch (JsonException|CannotCreateData|TypeError $cause) {
            throw ShareReadRefused::staleCursor(previous: $cause);
        }

        if ($cursor->belongsTo($expected)) {
            return $cursor;
        }

        throw ShareReadRefused::staleCursor();
    }

    private function signatureOf(string $encodedCursor): string
    {
        return self::encode(hash_hmac('sha256', $encodedCursor, $this->key, true));
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
