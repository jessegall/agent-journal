<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Enums\Layouts\LayoutTag;
use RuntimeException;

/**
 * A layout a reader built that breaks the catalogue: it names the part by its path of keys from the root and what is
 * wrong, and nothing of it is sent.
 */
final class LayoutRefused extends RuntimeException
{
    public static function unknownSize(string $path, LayoutTag $tag, string $size): self
    {
        $allowed = $tag->sizes() === [] ? 'none' : implode(', ', $tag->sizes());

        return new self(sprintf(
            'Layout part %s (%s) has the size %s, which it does not take. Sizes allowed: %s.',
            $path,
            $tag->value,
            $size,
            $allowed,
        ));
    }

    public static function unknownStyle(string $path, LayoutTag $tag, string $style): self
    {
        $allowed = implode(', ', $tag->styles());

        return new self(sprintf(
            'Layout part %s (%s) has the style %s, which it does not take. Styles allowed: %s.',
            $path,
            $tag->value,
            $style,
            $allowed,
        ));
    }

    public static function childrenNotAllowed(string $path, LayoutTag $tag): self
    {
        return new self("Layout part {$path} ({$tag->value}) holds children, which it does not take.");
    }

    /**
     * @param  list<string>  $allowed
     */
    public static function toneNotAllowed(string $path, string $tone, array $allowed): self
    {
        $known = implode(', ', $allowed);

        return new self(sprintf(
            'Layout part %s has the tone %s; only a badge takes a tone, and only a known one. Tones allowed: %s.',
            $path,
            $tone,
            $known,
        ));
    }

    public static function bindingMismatch(string $path, LayoutTag $tag): self
    {
        return new self(sprintf(
            'Layout part %s (%s) takes an action binding only as an action, a field binding only as a field.',
            $path,
            $tag->value,
        ));
    }

    public static function submitOutsideForm(string $path): self
    {
        return new self("Layout part {$path} submits a form, but no form holds it.");
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
