<?php

declare(strict_types=1);

namespace App\Domain\Declarations;

use App\Domain\Contracts\SectionReader;
use App\Domain\Contracts\VisibilityCheck;
use App\Domain\Exceptions\UiSlotMismatch;

/**
 * A checked section of an installed domain, joined to the page whose slot it fills: its full key, its reader, its
 * component file and its deferred prop name on that page.
 */
final readonly class RegisteredSection
{
    private function __construct(
        public DomainUi $owner,
        public Section $section,
        public string $key,
        public RegisteredPage $host,
        public Slot $slot,
        public ReaderDefinition $reader,
        public string $componentFile,
        public string $propName,
    ) {}

    public static function of(DomainUi $owner, Section $section, RegisteredPage $host): self
    {
        $key = $owner->fullKey('section', $section->key);
        $slot = $host->slots[$section->slot];

        if ($slot->takes !== $section->takes) {
            throw UiSlotMismatch::takes($key, $section->slot, $slot->takes->value, $section->takes->value);
        }

        if ($section->visibility !== null) {
            $owner->checkImplements($key, $section->visibility, VisibilityCheck::class);
        }

        return new self(
            owner: $owner,
            section: $section,
            key: $key,
            host: $host,
            slot: $slot,
            reader: ReaderDefinition::of($owner, $key, $section->reader, SectionReader::class, $section->dataClass),
            componentFile: $owner->componentFile($key, $section->component),
            propName: 'section_'.str_replace(['.', '-'], '_', "{$section->slot}.{$key}"),
        );
    }

    /**
     * @return list<ActionRoute>
     */
    public function declaredActions(): array
    {
        return $this->section->actions;
    }

    /**
     * The checks an actor must pass to see this section: its host page's first, then its own.
     *
     * @return list<class-string<VisibilityCheck>>
     */
    public function visibilityChecks(): array
    {
        return $this->section->visibility === null
            ? $this->host->visibilityChecks()
            : [...$this->host->visibilityChecks(), $this->section->visibility];
    }

    /**
     * The name the browser loads its component by: the domain's key and the component's path without .vue, so two
     * domains' Index.vue never share one.
     */
    public function componentName(): string
    {
        return $this->owner->key.'/'.preg_replace('/\.vue$/', '', $this->section->component);
    }
}
