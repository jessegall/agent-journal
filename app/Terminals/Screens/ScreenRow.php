<?php

declare(strict_types=1);

namespace App\Terminals\Screens;

/**
 * One row of a driver's screen as its text, read the way its regions are found: no-break spaces as plain ones.
 */
final readonly class ScreenRow
{
    private const string RULE = '─';

    private const int RULE_WIDTH = 10;

    public string $text;

    public function __construct(string $text)
    {
        $this->text = str_replace("\u{00a0}", ' ', $text);
    }

    /**
     * Whether the row starts with the marker; a bare marker such as an empty prompt's "❯ " is drawn without its
     * trailing space, and counts too.
     */
    public function startsWith(string $marker): bool
    {
        return str_starts_with($this->text, $marker) || rtrim($this->text, ' ') === rtrim($marker, ' ');
    }

    /**
     * Whether the row is drawn as a horizontal rule across most of its width.
     */
    public function isRule(): bool
    {
        return mb_strlen($this->text) >= self::RULE_WIDTH && str_replace(self::RULE, '', $this->text) === '';
    }

    public function isBlank(): bool
    {
        return trim($this->text) === '';
    }
}
