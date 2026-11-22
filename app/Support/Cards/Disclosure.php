<?php

declare(strict_types=1);

namespace App\Support\Cards;

use App\Enums\DisclosureState;
use App\Enums\PartType;
use App\Exceptions\DockCardInvalid;
use App\Support\Cards\Contracts\DockPart;

/**
 * An expandable heading over a body, shut or open at first; the user's own fold wins over later refreshes.
 */
final readonly class Disclosure implements DockPart
{
    public function __construct(
        public string $key,
        public string $title,
        public DisclosureState $initial,
        public DockPart $body,
    ) {
        PartKey::assertGiven($key, PartType::Disclosure);

        if (trim($title) === '' || ($body->type()->isContainer() && $body->children() === [])) {
            throw DockCardInvalid::emptyDisclosure($key);
        }
    }

    public function key(): string
    {
        return $this->key;
    }

    public function type(): PartType
    {
        return PartType::Disclosure;
    }

    public function children(): array
    {
        return [$this->body];
    }
}
