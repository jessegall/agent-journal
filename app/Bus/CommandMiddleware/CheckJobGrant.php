<?php

declare(strict_types=1);

namespace App\Bus\CommandMiddleware;

use App\Bus\Contracts\CommandAdmission;
use App\Bus\Contracts\CommandMiddleware;
use App\Bus\Enums\CommandAdmissionStage;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\CommandCall;
use App\Bus\Support\CommandNesting;
use App\Bus\Support\CommandRegistry;
use Closure;

final readonly class CheckJobGrant implements CommandMiddleware
{
    public function __construct(
        private CommandAdmission $admission,
        private CommandNesting $nesting,
        private CommandRegistry $registry,
    ) {}

    public function handle(CommandCall $call, Closure $next): mixed
    {
        if ($this->nesting->isNested() || $this->registry->entryOf($call->name()) !== CommandEntry::Application) {
            return $next($call);
        }

        $command = $this->registry->effective($call, CommandAdmissionStage::BeforeMiddleware);
        $this->admission->assess($command)->assertAllowed();

        return $next($call);
    }
}
