<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\CommandMiddleware;

use App\Bus\Contracts\CommandMiddleware;
use App\Bus\Support\CommandCall;
use Closure;
use Tests\Fixtures\Modules\Notes\Exceptions\NoteQuotaReached;

final readonly class RefuseNoteAtQuota implements CommandMiddleware
{
    public function handle(CommandCall $call, Closure $next): mixed
    {
        throw NoteQuotaReached::forCaller();
    }
}
