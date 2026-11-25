<?php

declare(strict_types=1);

namespace App\Values;

/**
 * What `codex login status` said about an account folder: how it ended, the line it printed, and whether the folder
 * holds its own auth.json. Exit 0 is signed in, exit 1 signed out, anything else proves nothing.
 */
final readonly class CodexStatus
{
    public function __construct(
        public int|null $exitCode,
        public string $output,
        public bool $hasAuthFile,
    ) {}

    /**
     * Signed in when the status names this method, as its first words, and the folder keeps its own sign-in; a
     * sign-in by another method is not.
     */
    public function signedInAs(string $wording): SignInVerification
    {
        $isSignedIn = $this->exitCode === 0 && $this->hasAuthFile && str_starts_with(trim($this->output), $wording);

        return new SignInVerification($isSignedIn, SignInIdentity::unproved(), in_array($this->exitCode, [
            0,
            1,
        ], true));
    }
}
