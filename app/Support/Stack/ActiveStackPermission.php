<?php

declare(strict_types=1);

namespace App\Support\Stack;

use App\Enums\CommandEffectType;
use App\Models\Agents\AgentStackRow;
use App\Support\Stack\Contracts\StackPermission;
use App\Values\StackTarget;
use App\Values\StackVerdict;

final readonly class ActiveStackPermission implements StackPermission
{
    public function __construct(private StackRestorer $restorer) {}

    public function allows(StackTarget $target, CommandEffectType $effect): StackVerdict
    {
        if ($effect === CommandEffectType::Recovery) {
            return StackVerdict::allow();
        }

        return AgentStackRow::activeAuthorizedFor($target)
            ->map(fn (AgentStackRow $row) => $this->restorer->restore($row->frames, $row->target())->permission())
            ->getOrCall(StackVerdict::allow(...));
    }
}
