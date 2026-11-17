<?php

declare(strict_types=1);

namespace App\Domain\Declarations;

use App\Domain\Enums\SlotContextKind;
use App\Domain\Exceptions\InvalidPageDeclaration;

/**
 * A place on a page where sections of any domain may show, with what it hands them.
 */
final readonly class Slot
{
    private function __construct(
        public string $key,
        public SlotContextKind $takes,
        public string|null $recordParameter,
    ) {}

    /**
     * A slot that hands its sections nothing or the session chosen in Chat.
     */
    public static function make(string $key, SlotContextKind $takes): self
    {
        if ($takes === SlotContextKind::Record) {
            throw InvalidPageDeclaration::recordSlotWithoutParameter($key);
        }

        return new self($key, $takes, null);
    }

    /**
     * A slot that hands its sections the record named by the given route parameter of its page.
     */
    public static function record(string $key, string $parameter): self
    {
        return new self($key, SlotContextKind::Record, $parameter);
    }
}
