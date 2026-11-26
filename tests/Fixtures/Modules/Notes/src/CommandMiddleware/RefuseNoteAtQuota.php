<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\CommandMiddleware;

use App\Bus\CommandCall;
use App\Bus\Contracts\CommandMiddleware;
use Closure;
use Tests\Fixtures\Modules\Notes\Exceptions\NoteQuotaReached;

final readonly class RefuseNoteAtQuota implements CommandMiddleware
{
    public function handle(CommandCall $call, Closure $next): mixed
    {
        throw NoteQuotaReached::forCaller();
    }
}
