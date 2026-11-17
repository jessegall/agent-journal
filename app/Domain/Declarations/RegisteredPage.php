<?php

declare(strict_types=1);

namespace App\Domain\Declarations;

use App\Domain\Contracts\PageReader;
use App\Domain\Contracts\VisibilityCheck;
use App\Domain\Exceptions\UiSlotMismatch;

/**
 * A checked page of an installed domain: its full key, which is also its route name, its URI under the domain's
 * prefix, its reader, its component file and its window prop name on Home.
 */
final readonly class RegisteredPage
{
    /**
     * @param  array<string, Slot>  $slots  the page's slots by full key
     */
    private function __construct(
        public DomainUi $owner,
        public Page $page,
        public string $key,
        public RoutePath $path,
        public string $uri,
        public ReaderDefinition $reader,
        public string $componentFile,
        public string $propName,
        public array $slots,
    ) {}

    public static function of(DomainUi $owner, Page $page): self
    {
        $key = $owner->fullKey('page', $page->key);
        $path = RoutePath::of($key, $page->path);

        if ($page->visibility !== null) {
            $owner->checkImplements($key, $page->visibility, VisibilityCheck::class);
        }

        return new self(
            owner: $owner,
            page: $page,
            key: $key,
            path: $path,
            uri: $owner->uri($path),
            reader: ReaderDefinition::of($owner, $key, $page->reader, PageReader::class, $page->dataClass),
            componentFile: $owner->componentFile($key, $page->component),
            propName: 'window_'.str_replace(['.', '-'], '_', $key),
            slots: self::checkedSlots($owner, $key, $path, $page->slots),
        );
    }

    /**
     * @return list<ActionRoute>
     */
    public function declaredActions(): array
    {
        return $this->page->actions;
    }

    /**
     * The checks an actor must pass to see this page, in the order they run.
     *
     * @return list<class-string<VisibilityCheck>>
     */
    public function visibilityChecks(): array
    {
        return $this->page->visibility === null ? [] : [$this->page->visibility];
    }

    /**
     * @param  list<Slot>  $slots
     * @return array<string, Slot>
     */
    private static function checkedSlots(DomainUi $owner, string $page, RoutePath $path, array $slots): array
    {
        $checked = [];

        foreach ($slots as $slot) {
            $slotKey = $owner->fullKey('slot', $slot->key);

            if ($slot->recordParameter !== null && ! $path->hasParameter($slot->recordParameter)) {
                throw UiSlotMismatch::parameterMissing($page, $slotKey, $slot->recordParameter);
            }

            $checked[$slotKey] = $slot;
        }

        return $checked;
    }

    /**
     * The name the browser loads its component by: the domain's key and the component's path without .vue, so two
     * domains' Index.vue never share one.
     */
    public function componentName(): string
    {
        return $this->owner->key.'/'.preg_replace('/\.vue$/', '', $this->page->component);
    }
}
