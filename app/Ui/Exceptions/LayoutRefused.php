<?php

declare(strict_types=1);

namespace App\Ui\Exceptions;

use App\Ui\Enums\LayoutTag;
use RuntimeException;

/**
 * A layout a reader built that breaks the catalogue: it names the part by its path of keys from the root and what is
 * wrong, and nothing of it is sent.
 */
final class LayoutRefused extends RuntimeException
{
    public static function unknownSize(string $path, LayoutTag $tag, string $size): self
    {
        return new self("Layout part {$path} ({$tag->value}) has the size {$size}, which it does not take.");
    }

    public static function unknownStyle(string $path, LayoutTag $tag, string $style): self
    {
        return new self("Layout part {$path} ({$tag->value}) has the style {$style}, which it does not take.");
    }

    public static function childrenNotAllowed(string $path, LayoutTag $tag): self
    {
        return new self("Layout part {$path} ({$tag->value}) holds children, which it does not take.");
    }

    public static function toneNotAllowed(string $path, string $tone): self
    {
        return new self("Layout part {$path} has the tone {$tone}; only a badge takes a tone, and only a known one.");
    }

    public static function bindingMismatch(string $path, LayoutTag $tag): self
    {
        return new self(
            "Layout part {$path} ({$tag->value}) takes an action binding only as an action, a field binding only as a field.",
        );
    }

    public static function siblingKeyRepeated(string $path, string $key): self
    {
        return new self("Layout part {$path} holds two children keyed {$key}; sibling keys must differ.");
    }

    public static function emptyKey(string $path): self
    {
        return new self("Layout part {$path} holds a child with an empty key.");
    }

    public static function tooDeep(string $path, int $limit): self
    {
        return new self(sprintf('Layout part %s sits deeper than %d parts.', $path, $limit));
    }

    public static function tooManyParts(int $limit): self
    {
        return new self(sprintf('The layout holds more than %d parts.', $limit));
    }

    public static function tooManyRows(string $path, int $rows, int $limit): self
    {
        return new self(sprintf('Collection %s holds %d rows, more than %d.', $path, $rows, $limit));
    }
}
