<?php

declare(strict_types=1);

namespace Tests\Support\Hosts\Steps;

use Tests\Support\Hosts\Steps\Contracts\HostStep;
use Tests\Support\Seeding\TestJournal;

/**
 * The runner shows the owner the challenge of the named sign-in, or of the newest one, and the test keeps it.
 */
final readonly class ShowsChallenge implements HostStep
{
    public function __construct(private string|null $name = null) {}

    public static function of(string $name): self
    {
        return new self($name);
    }

    public function __invoke(TestJournal $journal): void
    {
        $journal->awaitSignInChallenge($this->name ?? $journal->newestSignIn());
    }
}
