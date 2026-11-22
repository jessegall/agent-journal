<?php

declare(strict_types=1);

namespace App\Ui\Layout;

use App\Ui\Enums\LayoutTag;
use App\Ui\Exceptions\LayoutRefused;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
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
     * The tones a badge takes.
     */
    private const array TONES = ['quiet', 'good', 'warn', 'danger', 'busy'];

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
     * A label and the moment it names, such as Saved and when; the browser shows the moment in the viewer's own zone.
     */
    public static function time(string $key, string $label, string $moment): self
    {
        return new self(LayoutTag::Text, $key, 'normal', 'time', $label, $moment, [], []);
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
     * The placeholder rows a list shows while its first read is pending, announced once by their label.
     */
    public static function skeleton(string $key, int $rows, string $label): self
    {
        return new self(LayoutTag::Notice, $key, null, 'skeleton', $label, null, [], [], placeholders: $rows);
    }

    /**
     * The list's earlier rows stay under this notice when a refresh failed: the reason and its own Retry, which reads
     * only the failed address again.
     */
    public static function stale(string $key, string $reason): self
    {
        return new self(LayoutTag::Notice, $key, null, 'stale', $reason, null, [], []);
    }

    /**
     * A short state word in a tone: quiet, good, warn, danger or busy.
     */
    public static function badge(string $key, string $word, string $tone = 'quiet'): self
    {
        return new self(LayoutTag::Text, $key, 'small', 'badge', $word, null, [], [], tone: $tone);
    }

    /**
     * A labelled action that leads where its binding says, or names why it cannot run.
     */
    public static function action(
        string $key,
        string $label,
        LayoutActionData $action,
        string $style = 'bordered',
    ): self {
        return new self(LayoutTag::Action, $key, 'normal', $style, $label, null, [], [], action: $action);
    }

    /**
     * A labelled field that filters its own window by one query key.
     */
    public static function field(
        string $key,
        string $label,
        LayoutFieldData $field,
        string $style = 'search',
        string|null $hint = null,
    ): self {
        return new self(LayoutTag::Field, $key, 'normal', $style, $label, $hint, [], [], field: $field);
    }

    /**
     * A form that sends its fields and fixed values to one registered action; a submitting action among its parts
     * sends it.
     */
    public static function form(string $key, LayoutFormData $form, string $style, LayoutPartData ...$parts): self
    {
        return new self(LayoutTag::Form, $key, null, $style, null, null, [], array_values($parts), form: $form);
    }

    /**
     * A tab set: every tab's key and label, and as its one child the content of the tab shown, the only one read.
     *
     * @param  list<LayoutTabData>  $tabs
     */
    public static function tabs(string $key, array $tabs, LayoutPartData $shown): self
    {
        return new self(LayoutTag::Tabs, $key, null, 'tabs', null, null, [], [$shown], tabs: $tabs);
    }

    /**
     * A trusted rich body, made by the safe Markdown renderer.
     */
    public static function body(string $key, LayoutBodyData $body): self
    {
        return new self(LayoutTag::Body, $key, null, 'prose', null, null, [], [], body: $body);
    }

    /**
     * A record's actions menu, opened from its actions button or by a right click on its host; the same groups and
     * items either way.
     */
    public static function menu(string $key, LayoutMenuData $menu): self
    {
        return new self(LayoutTag::Menu, $key, null, 'dropdown', null, null, [], [], menu: $menu);
    }

    /**
     * A native part, mounted by its registered component name with its typed props.
     */
    public static function native(string $key, LayoutNativeData $native): self
    {
        return new self(LayoutTag::Native, $key, null, 'native', null, null, [], [], native: $native);
    }

    /**
     * Checks this part and everything below it against the catalogue and the limits, and answers how many parts
     * it holds, itself among them.
     *
     * @throws LayoutRefused
     */
    public function assertWithinCatalogue(string $path = 'root', int $depth = 0, bool $isInForm = false): int
    {
        if ($depth > LayoutLimits::DEPTH_LIMIT) {
            throw LayoutRefused::tooDeep($path, LayoutLimits::DEPTH_LIMIT);
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

        if (count($this->rows) > LayoutLimits::ROW_LIMIT) {
            throw LayoutRefused::tooManyRows($path, count($this->rows), LayoutLimits::ROW_LIMIT);
        }
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
            || ($this->tag === LayoutTag::Tabs) === ($this->tabs === [])
            || ($this->style === 'skeleton') === $this->placeholders instanceof Optional
        ) {
            throw LayoutRefused::bindingMismatch($path, $this->tag);
        }
    }
}
