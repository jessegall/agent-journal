<?php

declare(strict_types=1);

namespace App\Web\Declarations;

use App\Profiles\Enums\SlotContextType;
use App\Web\Exceptions\InvalidPageDeclaration;

/**
 * A place on a page where sections of any domain may show, with what it hands them.
 */
final readonly class Slot
{
    private function __construct(
        public string $key,
        public SlotContextType $takes,
        public string|null $recordParameter,
        public string|null $recordType,
    ) {}

    /**
     * A slot that hands its sections nothing or the session chosen in the conversation window.
     */
    public static function make(string $key, SlotContextType $takes): self
    {
        if ($takes === SlotContextType::Record) {
            throw InvalidPageDeclaration::recordSlotWithoutParameter($key);
        }

        return new self($key, $takes, null, null);
    }

    /**
     * A slot that hands its sections the record whose number the given route parameter of its page holds, named by
     * the word users use for that type of record, such as doc for /docs/12.
     */
    public static function record(string $key, string $parameter, string $type): self
    {
        return new self($key, SlotContextType::Record, $parameter, $type);
    }
}
