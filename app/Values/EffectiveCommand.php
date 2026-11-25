<?php

declare(strict_types=1);

namespace App\Values;

use App\Attributes\Commands\Authorize;
use App\Contracts\Bus\Command;
use App\Enums\Engine\CommandAdmissionStage;
use App\Enums\Engine\CommandEffectType;

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
