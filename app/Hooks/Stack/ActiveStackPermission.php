<?php

declare(strict_types=1);

namespace App\Hooks\Stack;

use App\Agents\Values\StackTarget;
use App\Bus\Enums\CommandEffectType;
use App\Hooks\Contracts\StackPermission;
use App\Hooks\Models\AgentStackRow;

final readonly class ActiveStackPermission implements StackPermission
{
    public function __construct(private StackRestorer $restorer) {}

    public function allows(StackTarget $target, CommandEffectType $effect): StackVerdict
    {
        if ($effect === CommandEffectType::Recovery) {
            return StackVerdict::allow();
        }

        return AgentStackRow::activeAuthorizedFor($target)
            ->map(fn (AgentStackRow $row) => $this->restorer->restore($row->frames)->permission())
            ->getOrCall(StackVerdict::allow(...));
    }
}
