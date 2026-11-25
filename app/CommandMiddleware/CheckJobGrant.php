<?php

declare(strict_types=1);

namespace App\CommandMiddleware;

use App\Contracts\Bus\CommandAdmission;
use App\Contracts\Bus\CommandMiddleware;
use App\Enums\Accounts\CommandEntry;
use App\Enums\Engine\CommandAdmissionStage;
use App\Support\CommandCall;
use App\Support\CommandNesting;
use App\Support\CommandRegistry;
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
