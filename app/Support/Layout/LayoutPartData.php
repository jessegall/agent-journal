<?php

declare(strict_types=1);

namespace App\Support\Layout;

use App\Connections\Layout\LayoutBodyData;
use App\Exceptions\LayoutRefused;
use App\Navigation\Layout\LayoutMenuData;
use App\Terminals\Enums\LayoutTag;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One part of a declared layout: its tag, its key among its siblings, its size and style from the tag's catalogue,
 * the escaped text it shows, the rows of a collection and the children of a box. A reader builds parts with the
 * typed fields; the layout checks the whole tree before anything is sent.
 */
#[TypeScript]
final class LayoutPartData extends Data
{
    /** @use \App\Web\Creation\Buildable<LayoutPartDataFields> */
    use \App\Web\Creation\Buildable;

    protected const string FIELDS = LayoutPartDataFields::class;

    /**
     * The deepest a part may sit below the layout's root.
     */
    public const int DEPTH_LIMIT = 12;

    /**
     * The most rows one collection holds; a longer list is paged by its reader.
     */
    public const int ROW_LIMIT = 100;

    /**
     * The tones a badge takes; waiting is a state that has not started or is absent, drawn with a hollow dot.
     */
    private const array TONES = [
        'quiet',
        'good',
        'warn',
        'danger',
        'busy',
        'waiting',
    ];

    /**
     * @param  list<LayoutRowData>  $rows
     * @param  list<LayoutPartData>  $children
     * @param  list<LayoutTabData>  $tabs
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
        public readonly LayoutActionData|Optional $action = new Optional(),
        public readonly LayoutFieldData|Optional $field = new Optional(),
        public readonly string|Optional $tone = new Optional(),
        public readonly LayoutFormData|Optional $form = new Optional(),
        #[DataCollectionOf(LayoutTabData::class)]
        public readonly array $tabs = [],
        public readonly LayoutBodyData|Optional $body = new Optional(),
        public readonly LayoutNativeData|Optional $native = new Optional(),
        public readonly LayoutMenuData|Optional $menu = new Optional(),
        public readonly int|Optional $placeholders = new Optional(),
        public readonly LayoutSplitData|Optional $split = new Optional(),
        public readonly LayoutProgressData|Optional $progress = new Optional(),
        public readonly LayoutDialogData|Optional $dialog = new Optional(),
    ) {}

    /**
     * Checks this part and everything below it against the catalogue and the limits, and answers how many parts
     * it holds, itself among them.
     *
     * @throws LayoutRefused
     */
    public function assertWithinCatalogue(string $path = 'root', int $depth = 0, bool $isInForm = false): int
    {
        if ($depth > self::DEPTH_LIMIT) {
            throw LayoutRefused::tooDeep($path, self::DEPTH_LIMIT);
        }

        $this->assertTagAccepts($path);

        if ($this->action instanceof LayoutActionData && $this->action->submits && ! $isInForm) {
            throw LayoutRefused::submitOutsideForm($path);
        }

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

            $parts += $child->assertWithinCatalogue(
                "{$path}.{$child->key}",
                $depth + 1,
                $isInForm || $this->tag === LayoutTag::Form,
            );
        }

        foreach ($this->rows as $row) {
            foreach ($row->parts() as $part) {
                $parts += $part->assertWithinCatalogue("{$path}.{$row->key}.{$part->key}", $depth + 1, $isInForm);
            }
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

        $this->assertBindings($path);

        if (count($this->rows) > self::ROW_LIMIT) {
            throw LayoutRefused::tooManyRows($path, count($this->rows), self::ROW_LIMIT);
        }
    }

    private function hasOpenerAndForm(): bool
    {
        return count($this->children) === 2
            && in_array($this->children[0]->tag, [LayoutTag::Action, LayoutTag::Menu], true)
            && $this->children[1]->tag === LayoutTag::Form;
    }

    /**
     * Only a badge takes a tone, and only a known one; only an action takes an action binding and only a field a
     * field binding, and each of them needs its own.
     */
    private function assertBindings(string $path): void
    {
        $isBadge = $this->style === 'badge';

        $hasTone = ! $this->tone instanceof Optional;

        if ($isBadge !== $hasTone || $hasTone && ! in_array($this->tone, self::TONES, true)) {
            throw LayoutRefused::toneNotAllowed($path, $hasTone ? $this->tone : 'none', self::TONES);
        }

        $isAction = $this->tag === LayoutTag::Action;
        $isField = $this->tag === LayoutTag::Field;

        $isForm = $this->tag === LayoutTag::Form;

        if (
            $isAction === $this->action instanceof Optional
            || $isField === $this->field instanceof Optional
            || $isForm === $this->form instanceof Optional
            || ($this->tag === LayoutTag::Body) === $this->body instanceof Optional
            || ($this->tag === LayoutTag::Native) === $this->native instanceof Optional
            || ($this->tag === LayoutTag::Menu) === $this->menu instanceof Optional
            || ($this->tag === LayoutTag::Progress) === $this->progress instanceof Optional
            || ($this->tag === LayoutTag::Dialog) === $this->dialog instanceof Optional
            || ($this->tag === LayoutTag::Dialog && ! $this->hasOpenerAndForm())
            || ($this->tag === LayoutTag::Tabs) === ($this->tabs === [])
            || ($this->style === 'skeleton') === $this->placeholders instanceof Optional
            || ! $this->split instanceof Optional && ! ($this->tag === LayoutTag::Box && $this->style === 'split')
        ) {
            throw LayoutRefused::bindingMismatch($path, $this->tag);
        }
    }
}
