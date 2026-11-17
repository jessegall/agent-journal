<?php

declare(strict_types=1);

namespace App\Core\Ui\Declarations;

use App\Core\Ui\Enums\SlotContextType;

/**
 * What a slot hands a section in one request: nothing, or the id of the chosen session or the shown record.
 */
final readonly class SlotContext
{
    private function __construct(
        public SlotContextType $type,
        public string|null $id,
    ) {}

    public static function nothing(): self
    {
        return new self(SlotContextType::Nothing, null);
    }

    public static function session(int $id): self
    {
        return new self(SlotContextType::Session, (string) $id);
    }

    public static function record(int $id): self
    {
        return new self(SlotContextType::Record, (string) $id);
    }
}
