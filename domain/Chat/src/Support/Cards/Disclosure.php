<?php

declare(strict_types=1);

namespace Domain\Chat\Support\Cards;

use App\Processes\Enums\DisclosureStatus;
use Domain\Chat\Contracts\Docking\DockPart;
use Domain\Chat\Enums\PartType;
use Domain\Chat\Exceptions\DockCardInvalid;

/**
 * An expandable heading over a body, shut or open at first; the user's own fold wins over later refreshes.
 */
final readonly class Disclosure implements DockPart
{
    public function __construct(
        public string $key,
        public string $title,
        public DisclosureStatus $initial,
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
