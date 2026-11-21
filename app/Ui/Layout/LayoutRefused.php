<?php

declare(strict_types=1);

namespace App\Ui\Layout;

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

    public static function unknownVariant(string $path, LayoutTag $tag, string $variant): self
    {
        return new self("Layout part {$path} ({$tag->value}) has the variant {$variant}, which it does not take.");
    }

    public static function childrenNotAllowed(string $path, LayoutTag $tag): self
    {
        return new self("Layout part {$path} ({$tag->value}) holds children, which it does not take.");
    }

    public static function siblingKeyRepeated(string $path, string $key): self
    {
        return new self("Layout part {$path} holds two children keyed {$key}; sibling keys must differ.");
    }

    public static function emptyKey(string $path): self
    {
        return new self("Layout part {$path} holds a child with an empty key.");
    }

    public static function tooDeep(string $path): self
    {
        return new self(sprintf('Layout part %s sits deeper than %d parts.', $path, LayoutLimits::DEPTH_LIMIT));
    }

    public static function tooManyParts(): self
    {
        return new self(sprintf('The layout holds more than %d parts.', LayoutLimits::PART_LIMIT));
    }

    public static function tooManyRows(string $path, int $rows): self
    {
        return new self(sprintf('Collection %s holds %d rows, more than %d.', $path, $rows, LayoutLimits::ROW_LIMIT));
    }
}
