<?php

declare(strict_types=1);

namespace App\Bus\Values;

use App\Bus\Attributes\Operation;
use App\Bus\Contracts\Command;
use App\Bus\Enums\CommandAdmissionStage;
use App\Bus\Enums\CommandEffectType;

final readonly class EffectiveCommand
{
    /**
     * @param  Command<mixed>  $command
     */
    public function __construct(
        public Command $command,
        public CommandEffectType $effect,
        public Operation|null $operation,
        public CommandAdmissionStage $stage,
    ) {}
}
