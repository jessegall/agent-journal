<?php

declare(strict_types=1);

namespace App\Core\Ui\Declarations;

use App\Core\Ui\Enums\SlotContextKind;

/**
 * What a slot hands a section in one request: nothing, or the id of the chosen session or the shown record.
 */
final readonly class SlotContext
{
    private function __construct(
        public SlotContextKind $kind,
        public string|null $id,
    ) {}

    public static function nothing(): self
    {
        return new self(SlotContextKind::Nothing, null);
    }

    public static function session(int $id): self
    {
        return new self(SlotContextKind::Session, (string) $id);
    }

    public static function record(int $id): self
    {
        return new self(SlotContextKind::Record, (string) $id);
    }
}
