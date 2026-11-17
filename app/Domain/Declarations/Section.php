<?php

declare(strict_types=1);

namespace App\Domain\Declarations;

use App\Domain\Contracts\SectionReader;
use App\Domain\Contracts\VisibilityCheck;
use App\Domain\Enums\SlotContextKind;
use App\Domain\Exceptions\InvalidSectionDeclaration;
use Spatie\LaravelData\Data;

/**
 * A section a domain shows in a slot of any domain's page, keyed within its own domain and naming the slot by its
 * full key. Each change returns a new section.
 */
final class Section
{
    /**
     * @param  class-string<SectionReader>  $reader
     * @param  class-string<Data>  $dataClass  the Data class the reader's read method declares
     * @param  list<ActionRoute>  $actions
     * @param  class-string<VisibilityCheck>|null  $visibility  null when everyone who sees the host page sees the section
     */
    private function __construct(
        public private(set) string $key,
        public private(set) string $title,
        public private(set) string $slot,
        public private(set) SlotContextKind $takes,
        public private(set) string $reader,
        public private(set) string $dataClass,
        public private(set) string $component,
        public private(set) int $position = 0,
        public private(set) array $actions = [],
        public private(set) string|null $visibility = null,
    ) {}

    /**
     * @param  string  $slot  the slot's full key, such as plans.inspector
     * @param  class-string<SectionReader>  $reader
     */
    public static function make(string $key, string $title, string $slot, SlotContextKind $takes, string $reader, string $component): self
    {
        if (preg_match('/^[a-z0-9-]+\.[a-z0-9-]+$/', $slot) !== 1) {
            throw InvalidSectionDeclaration::slotNotFullKey($key, $slot);
        }

        $dataClass = ReaderDataClass::of($reader);

        if ($dataClass === null) {
            throw InvalidSectionDeclaration::readerReturnsNoData($key, $reader);
        }

        return new self($key, $title, $slot, $takes, $reader, $dataClass, $component);
    }

    public function at(int $position): self
    {
        $section = clone $this;
        $section->position = $position;

        return $section;
    }

    public function actions(ActionRoute ...$actions): self
    {
        $section = clone $this;
        $section->actions = array_values($actions);

        return $section;
    }

    /**
     * @param  class-string<VisibilityCheck>  $check
     */
    public function visibleWhen(string $check): self
    {
        $section = clone $this;
        $section->visibility = $check;

        return $section;
    }
}
