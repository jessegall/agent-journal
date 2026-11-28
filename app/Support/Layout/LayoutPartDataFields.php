<?php

declare(strict_types=1);

namespace App\Support\Layout;

use App\Connections\Layout\LayoutBodyData;
use App\Navigation\Layout\LayoutMenuData;
use App\Terminals\Enums\LayoutTag;
use App\Web\Creation\Exceptions\MissingFields;
use Spatie\LaravelData\Optional;

final class LayoutPartDataFields
{
    private LayoutTag $tag;

    private string $key;

    private string|null $size = null;

    private string $style;

    private string|null $text = null;

    private string|null $detail = null;

    /** @var list<LayoutRowData> */
    private array $rows = [];

    /** @var list<LayoutPartData> */
    private array $children = [];

    private LayoutActionData|Optional $action;

    private LayoutFieldData|Optional $field;

    private string|Optional $tone;

    private LayoutFormData|Optional $form;

    /** @var list<LayoutTabData> */
    private array $tabs = [];

    private LayoutBodyData|Optional $body;

    private LayoutNativeData|Optional $native;

    private LayoutMenuData|Optional $menu;

    private int|Optional $placeholders;

    private LayoutSplitData|Optional $split;

    private LayoutProgressData|Optional $progress;

    private LayoutDialogData|Optional $dialog;

    public function __construct()
    {
        $this->action = new Optional();
        $this->field = new Optional();
        $this->tone = new Optional();
        $this->form = new Optional();
        $this->body = new Optional();
        $this->native = new Optional();
        $this->menu = new Optional();
        $this->placeholders = new Optional();
        $this->split = new Optional();
        $this->progress = new Optional();
        $this->dialog = new Optional();
    }

    public function key(string $key): self
    {
        $this->key = $key;

        return $this;
    }

    public function size(string|null $size): self
    {
        $this->size = $size;

        return $this;
    }

    public function style(string $style): self
    {
        $this->style = $style;

        return $this;
    }

    public function text(string|null $text): self
    {
        $this->text = $text;

        return $this;
    }

    public function detail(string|null $detail): self
    {
        $this->detail = $detail;

        return $this;
    }

    /** @param list<LayoutRowData> $rows */
    public function rows(array $rows): self
    {
        $this->rows = $rows;

        return $this;
    }

    public function children(LayoutPartData ...$children): self
    {
        $this->children = array_values($children);

        return $this;
    }

    public function action(LayoutActionData|Optional $action): self
    {
        $this->action = $action;

        return $this;
    }

    public function field(LayoutFieldData|Optional $field): self
    {
        $this->field = $field;

        return $this;
    }

    public function tone(string|Optional $tone): self
    {
        $this->tone = $tone;

        return $this;
    }

    public function form(LayoutFormData|Optional $form): self
    {
        $this->form = $form;

        return $this;
    }

    /** @param list<LayoutTabData> $tabs */
    public function tabs(array $tabs): self
    {
        $this->tabs = $tabs;

        return $this;
    }

    public function body(LayoutBodyData|Optional $body): self
    {
        $this->body = $body;

        return $this;
    }

    public function native(LayoutNativeData|Optional $native): self
    {
        $this->native = $native;

        return $this;
    }

    public function menu(LayoutMenuData|Optional $menu): self
    {
        $this->menu = $menu;

        return $this;
    }

    public function placeholders(int|Optional $placeholders): self
    {
        $this->placeholders = $placeholders;

        return $this;
    }

    public function split(LayoutSplitData|Optional $split): self
    {
        $this->split = $split;

        return $this;
    }

    public function progress(LayoutProgressData|Optional $progress): self
    {
        $this->progress = $progress;

        return $this;
    }

    public function dialog(LayoutDialogData|Optional $dialog): self
    {
        $this->dialog = $dialog;

        return $this;
    }

    public function asBox(): self
    {
        $this->tag = LayoutTag::Box;
        $this->size = 'normal';

        return $this;
    }

    public function asSplit(): self
    {
        $this->tag = LayoutTag::Box;
        $this->size = 'normal';
        $this->style = 'split';

        return $this;
    }

    public function asText(): self
    {
        $this->tag = LayoutTag::Text;
        $this->size = 'normal';
        $this->style = 'plain';

        return $this;
    }

    public function asTime(): self
    {
        $this->tag = LayoutTag::Text;
        $this->size = 'normal';
        $this->style = 'time';

        return $this;
    }

    public function asCollection(): self
    {
        $this->tag = LayoutTag::Collection;
        $this->size = 'normal';

        return $this;
    }

    public function asNotice(): self
    {
        $this->tag = LayoutTag::Notice;

        return $this;
    }

    public function asSkeleton(): self
    {
        $this->tag = LayoutTag::Notice;
        $this->style = 'skeleton';

        return $this;
    }

    public function asStale(): self
    {
        $this->tag = LayoutTag::Notice;
        $this->style = 'stale';

        return $this;
    }

    public function asBadge(): self
    {
        $this->tag = LayoutTag::Text;
        $this->size = 'small';
        $this->style = 'badge';
        $this->tone = 'quiet';

        return $this;
    }

    public function asAction(): self
    {
        $this->tag = LayoutTag::Action;
        $this->size = 'normal';
        $this->style = 'bordered';

        return $this;
    }

    public function asField(): self
    {
        $this->tag = LayoutTag::Field;
        $this->size = 'normal';
        $this->style = 'search';

        return $this;
    }

    public function asForm(): self
    {
        $this->tag = LayoutTag::Form;

        return $this;
    }

    public function asTabs(): self
    {
        $this->tag = LayoutTag::Tabs;
        $this->style = 'tabs';

        return $this;
    }

    public function asBody(): self
    {
        $this->tag = LayoutTag::Body;
        $this->style = 'prose';

        return $this;
    }

    public function asMenu(): self
    {
        $this->tag = LayoutTag::Menu;
        $this->style = 'dropdown';

        return $this;
    }

    public function asDialog(): self
    {
        $this->tag = LayoutTag::Dialog;
        $this->style = 'dialog';

        return $this;
    }

    public function asCreation(): self
    {
        $this->tag = LayoutTag::Action;
        $this->size = 'small';
        $this->style = 'bordered';
        $this->detail = 'plus';

        return $this;
    }

    public function asProgress(): self
    {
        $this->tag = LayoutTag::Progress;
        $this->style = 'meter';

        return $this;
    }

    public function asShare(): self
    {
        $this->tag = LayoutTag::Progress;
        $this->style = 'share';

        return $this;
    }

    public function asUsage(): self
    {
        $this->tag = LayoutTag::Progress;
        $this->style = 'usage';

        return $this;
    }

    public function asNative(): self
    {
        $this->tag = LayoutTag::Native;
        $this->style = 'native';

        return $this;
    }

    public function value(string $value): self
    {
        return $this->text($value);
    }

    public function title(string $title): self
    {
        return $this->text($title);
    }

    public function label(string $label): self
    {
        return $this->text($label);
    }

    public function shown(LayoutPartData $shown): self
    {
        return $this->children($shown);
    }

    public function list(LayoutPartData $list): self
    {
        return $this->children($list);
    }

    public function reader(LayoutPartData ...$reader): self
    {
        $this->children = [...$this->children, ...array_values($reader)];

        return $this;
    }

    public function opener(LayoutPartData $opener): self
    {
        return $this->children($opener);
    }

    /**
     * @param list<LayoutPartData> $fields
     * @param list<LayoutPartData> $footer
     */
    public function sheet(LayoutFormData $form, array $fields, array $footer): self
    {
        $actions = LayoutPartData::build()->asBox()->key('footer')->style('row')->children(...$footer)->finish();
        $this->children[] = LayoutPartData::build()
            ->asForm()
            ->key('form')
            ->form($form)
            ->style('stack')
            ->children(...[...$fields, $actions])
            ->finish();

        return $this;
    }

    public function tip(string|null $tip): self
    {
        $this->style = $tip === null ? 'usage' : 'usage-row';

        return $this->detail($tip);
    }

    public function finish(): LayoutPartData
    {
        if (! isset($this->tag)) {
            throw MissingFields::forType(LayoutPartData::class, 'tag');
        }

        if (! isset($this->key)) {
            throw MissingFields::forType(LayoutPartData::class, 'key');
        }

        if (! isset($this->style)) {
            throw MissingFields::forType(LayoutPartData::class, 'style');
        }

        return new LayoutPartData(
            tag: $this->tag,
            key: $this->key,
            size: $this->size,
            style: $this->style,
            text: $this->text,
            detail: $this->detail,
            rows: $this->rows,
            children: $this->children,
            action: $this->action,
            field: $this->field,
            tone: $this->tone,
            form: $this->form,
            tabs: $this->tabs,
            body: $this->body,
            native: $this->native,
            menu: $this->menu,
            placeholders: $this->placeholders,
            split: $this->split,
            progress: $this->progress,
            dialog: $this->dialog,
        );
    }
}
