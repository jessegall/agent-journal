<?php

declare(strict_types=1);

namespace App\Bus\Values;

use App\Attributes\Commands\Authorize;
use App\Bus\Contracts\Command;
use App\Engine\Enums\CommandAdmissionStage;
use App\Engine\Enums\CommandEffectType;

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
