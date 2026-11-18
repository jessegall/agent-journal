<?php

declare(strict_types=1);

namespace App\Skills\Support;

use App\Programs\Enums\HookProgram;
use App\Skills\Values\ProgramKey;
use App\Skills\Values\ProviderKey;
use App\Text\Support\StableKey;

/**
 * The program a session was launched with, as its program and provider keys: a registered program gives both, a
 * program without a registration gives no provider, and a session with no program gives neither.
 */
final readonly class LaunchProgram
{
    private function __construct(
        public ?ProgramKey $program,
        public ?ProviderKey $provider,
    ) {}

    /**
     * @param  string|null  $program  the program the session recorded at launch
     */
    public static function of(?string $program): self
    {
        $registered = $program === null ? null : HookProgram::tryFrom($program);

        if ($registered !== null) {
            return new self($registered->programKey(), $registered->provider());
        }

        return new self($program !== null && StableKey::isValid($program) ? ProgramKey::from($program) : null, null);
    }
}
