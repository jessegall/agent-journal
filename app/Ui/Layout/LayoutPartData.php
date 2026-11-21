<?php

declare(strict_types=1);

namespace App\Ui\Layout;

use App\Ui\Enums\LayoutTag;
use App\Ui\Exceptions\LayoutRefused;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One part of a declared layout: its tag, its key among its siblings, its size and style from the tag's catalogue,
 * the escaped text it shows, the rows of a collection and the children of a box. A reader builds parts with the
 * named factories; the layout checks the whole tree before anything is sent.
 */
#[TypeScript]
final class LayoutPartData extends Data
{
    /**
     * @param  list<LayoutRowData>  $rows
     * @param  list<LayoutPartData>  $children
     */
    public function __construct(
        public readonly LayoutTag $tag,
        public readonly string $key,
        public readonly string|null $size,
        public readonly string $style,
        public readonly string|null $text,
        public readonly string|null $detail,
        #[DataCollectionOf(LayoutRowData::class)]
        public readonly array $rows,
        #[DataCollectionOf(LayoutPartData::class)]
        public readonly array $children,
    ) {}

    public static function box(string $key, string $style, LayoutPartData ...$children): self
    {
        return new self(LayoutTag::Box, $key, 'normal', $style, null, null, [], array_values($children));
    }

    public static function text(string $key, string $value, string $style = 'plain', string $size = 'normal'): self
    {
        return new self(LayoutTag::Text, $key, $size, $style, $value, null, [], []);
    }

    /**
     * @param  list<LayoutRowData>  $rows
     */
    public static function collection(string $key, string $style, array $rows): self
    {
        return new self(LayoutTag::Collection, $key, 'normal', $style, null, null, $rows, []);
    }

    public static function notice(string $key, string $style, string $title, string|null $detail = null): self
    {
        return new self(LayoutTag::Notice, $key, null, $style, $title, $detail, [], []);
    }

    /**
     * Checks this part and everything below it against the catalogue and the limits, and answers how many parts
     * it holds, itself among them.
     *
     * @throws LayoutRefused
     */
    public function assertWithinCatalogue(string $path = 'root', int $depth = 0): int
    {
        if ($depth > LayoutLimits::DEPTH_LIMIT) {
            throw LayoutRefused::tooDeep($path, LayoutLimits::DEPTH_LIMIT);
        }

        $this->assertTagAccepts($path);

        $parts = 1;
        $keys = [];

        foreach ($this->children as $child) {
            if ($child->key === '') {
                throw LayoutRefused::emptyKey($path);
            }

            if (isset($keys[$child->key])) {
                throw LayoutRefused::siblingKeyRepeated($path, $child->key);
            }

            $keys[$child->key] = true;
            $parts += $child->assertWithinCatalogue("{$path}.{$child->key}", $depth + 1);
        }

        return $parts;
    }

    private function assertTagAccepts(string $path): void
    {
        $sizes = $this->tag->sizes();

        if ($sizes === [] ? $this->size !== null : ! in_array($this->size, $sizes, true)) {
            throw LayoutRefused::unknownSize($path, $this->tag, (string) $this->size);
        }

        if (! in_array($this->style, $this->tag->styles(), true)) {
            throw LayoutRefused::unknownStyle($path, $this->tag, $this->style);
        }

        if ($this->children !== [] && ! $this->tag->holdsChildren($this->style)) {
            throw LayoutRefused::childrenNotAllowed($path, $this->tag);
        }

        if (count($this->rows) > LayoutLimits::ROW_LIMIT) {
            throw LayoutRefused::tooManyRows($path, count($this->rows), LayoutLimits::ROW_LIMIT);
        }
    }
}
