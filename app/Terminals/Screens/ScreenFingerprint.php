<?php

declare(strict_types=1);

namespace App\Terminals\Screens;

use App\Hosts\Data\HostFrameData;

/**
 * The fingerprint of a still screen: what stays the same each time the same menu is drawn, with the composer, the
 * spinner, the status line and the options left out, each row redacted and normalised, so a library entry knows its
 * screen again. Rows that leave the machine are redacted: no email address, path or token leaves in them.
 */
final readonly class ScreenFingerprint
{
    private const string VERSION = 'fp1';

    private const string UNKNOWN_MENU = 'unknown';

    private const string EMAIL = '/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/';

    private const string PATH = '#(^|[^\w~/.])(~/[^\s/]+|/[^\s/]+/)\S*#';

    private const string WORD = '/[A-Za-z0-9_-]+/';

    private const array TOKEN_PREFIXES = [
        'sk-',
        'ghp_',
        'xox',
    ];

    /**
     * The shortest run of letters and digits read as a token when it holds both.
     */
    private const int TOKEN_LENGTH = 20;

    public function of(ScreenLayout $layout, string $driver, HostFrameData $frame, string|null $menu): string
    {
        $left = array_filter([
            $layout->composer->rowsOf($frame),
            ...array_map(fn ($region) => $region->rowsOf($frame), $layout->others),
            $layout->optionsOf($frame),
        ]);

        $markers = $layout->optionList()->markers;
        $lines = [self::VERSION, $driver, $frame->buffer, $menu ?? self::UNKNOWN_MENU];

        foreach ($frame->rows as $row => $text) {
            $normalised = self::normalised($text, $markers);

            if ($normalised !== '' && ! array_any($left, fn (RowRange $range) => $range->holds($row))) {
                $lines[] = $normalised;
            }
        }

        return self::VERSION.':'.hash('sha256', implode("\n", $lines));
    }

    /**
     * The row as it may be shown away from the machine: email addresses, paths and tokens masked.
     */
    public static function redacted(string $text): string
    {
        $unmailed = (string) preg_replace(self::EMAIL, '<redacted>', $text);
        $masked = (string) preg_replace(self::PATH, '${1}<path>', $unmailed);

        return (string) preg_replace_callback(
            self::WORD,
            fn (array $run) => self::isToken($run[0]) ? '<token>' : $run[0],
            $masked,
        );
    }

    /**
     * The row redacted, in lower case, with the highlight markers taken out, its spaces collapsed and each run of
     * digits one #, so a moved highlight or a changed count draws the same row.
     *
     * @param  list<string>  $markers
     */
    private static function normalised(string $text, array $markers): string
    {
        $lowered = mb_strtolower(self::redacted($text));
        $unmarked = str_replace(array_map(mb_strtolower(...), $markers), '', $lowered);
        $collapsed = implode(' ', preg_split('/\s+/u', trim($unmarked), -1, PREG_SPLIT_NO_EMPTY) ?: []);

        return (string) preg_replace('/[0-9]+/', '#', $collapsed);
    }

    private static function isToken(string $run): bool
    {
        $isPrefixed = array_any(
            self::TOKEN_PREFIXES,
            fn (string $prefix) => strlen($run) > strlen($prefix) && str_starts_with($run, $prefix),
        );

        if ($isPrefixed) {
            return true;
        }

        $isMixed = preg_match('/[A-Za-z]/', $run) === 1 && preg_match('/\d/', $run) === 1;

        return strlen($run) >= self::TOKEN_LENGTH && $isMixed;
    }
}
