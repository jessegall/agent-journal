<?php

declare(strict_types=1);

namespace App\Ui\Declarations;

use App\Ui\Contracts\SectionResolver;
use App\Ui\Contracts\VisibilityCheck;
use App\Ui\Enums\SlotContextType;
use App\Ui\Exceptions\InvalidSectionDeclaration;
use Spatie\LaravelData\Data;

/**
 * A section a domain shows in a slot of any domain's page, keyed within its own domain and naming the slot by its
 * full key. Each change returns a new section.
 */
final class Section
{
    /**
     * @param  class-string<SectionResolver>  $resolver
     * @param  class-string<Data>  $dataClass  the Data class the resolver's read method declares
     * @param  list<ActionRoute>  $actions
     * @param  class-string<VisibilityCheck>|null  $visibility  null when everyone who sees the host page sees the section
     */
    private function __construct(
        public readonly string $key,
        public readonly string $title,
        public readonly string $slot,
        public readonly SlotContextType $takes,
        public readonly string $resolver,
        public readonly string $dataClass,
        public readonly string $component,
        public readonly int $position = 0,
        public readonly array $actions = [],
        public readonly string|null $visibility = null,
    ) {}

    /**
     * @param  string  $slot  the slot's full key, such as plans.inspector
     * @param  class-string<SectionResolver>  $resolver
     */
    public static function make(string $key, string $title, string $slot, SlotContextType $takes, string $resolver, string $component): self
    {
        if (preg_match('/^[a-z0-9-]+\.[a-z0-9-]+$/', $slot) !== 1) {
            throw InvalidSectionDeclaration::slotNotFullKey($key, $slot);
        }

        $dataClass = ResolverDataClass::of($resolver);

        if ($dataClass === null) {
            throw InvalidSectionDeclaration::resolverReturnsNoData($key, $resolver);
        }

        return new self($key, $title, $slot, $takes, $resolver, $dataClass, $component);
    }

    public function at(int $position): self
    {
        return clone ($this, ['position' => $position]);
    }

    public function actions(ActionRoute ...$actions): self
    {
        return clone ($this, ['actions' => array_values($actions)]);
    }

    /**
     * @param  class-string<VisibilityCheck>  $check
     */
    public function visibleWhen(string $check): self
    {
        return clone ($this, ['visibility' => $check]);
    }
}
