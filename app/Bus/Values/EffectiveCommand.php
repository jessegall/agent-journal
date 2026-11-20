<?php

declare(strict_types=1);

namespace App\Bus\Values;

use App\Bus\Contracts\Command;
use App\Bus\Enums\CommandEffectType;

final readonly class EffectiveCommand
{
    /**
     * @param  Command<mixed>  $command
     */
    public function __construct(public Command $command, public CommandEffectType $effect) {}
}
