<?php

declare(strict_types=1);

namespace App\CommandMiddleware;

use App\Contracts\Bus\CommandMiddleware;
use App\Support\CommandCall;
use App\Support\CommandSubjects;
use Closure;

/**
 * The first step inside a command's transaction: a declared command's subject is resolved, locked and authorized for
 * the acting actor before any receipt lookup or effect; a refusal leaves only its refusal receipt.
 */
final readonly class AuthorizeCommand implements CommandMiddleware
{
    public function __construct(private CommandSubjects $subjects) {}

    public function handle(CommandCall $call, Closure $next): mixed
    {
        return $next($this->subjects->authorized($call));
    }
}
