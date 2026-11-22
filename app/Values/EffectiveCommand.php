<?php

declare(strict_types=1);

namespace App\Values;

use App\Attributes\Authorize;
use App\Contracts\Command;
use App\Enums\CommandAdmissionStage;
use App\Enums\CommandEffectType;

final readonly class EffectiveCommand
{
    /**
     * @param  Command<mixed>  $command
     */
    public function __construct(
        public Command $command,
        public CommandEffectType $effect,
        public Authorize|null $authorize,
        public CommandAdmissionStage $stage,
    ) {}
}
