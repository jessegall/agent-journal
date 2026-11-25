<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\Profiles\ScriptOperandType;

/**
 * A condition an instruction tests: a member of a script object, maybe negated.
 */
final class BooleanOperand extends ScriptOperand
{
    public function __construct(
        public readonly string $object,
        public readonly string $member,
        public readonly bool $isNegated,
    ) {
        $this->type = ScriptOperandType::Condition;
    }

    public function label(): string
    {
        if ($this->isNegated) {
            return "NOT {$this->object}.{$this->member}";
        }

        return "{$this->object}.{$this->member}";
    }
}
